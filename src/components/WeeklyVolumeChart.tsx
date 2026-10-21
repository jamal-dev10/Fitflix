import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import { WorkoutSession } from '../types';
import {
  BarChart3,
  Clock,
  Flame,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Target,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';

interface WeeklyVolumeChartProps {
  token: string | null;
  weeklyTargetMinutes?: number; // default: 300 minutes (5 hours/week)
}

interface DayVolumeData {
  dateStr: string;
  dayShort: string;
  dayFull: string;
  dayNumber: number;
  monthShort: string;
  isToday: boolean;
  totalDuration: number;
  totalCalories: number;
  sessionsCount: number;
  strengthMinutes: number;
  cardioMinutes: number;
  hiitMinutes: number;
  yogaMinutes: number;
  recoveryMinutes: number;
  otherMinutes: number;
  sessions: WorkoutSession[];
}

export const WeeklyVolumeChart: React.FC<WeeklyVolumeChartProps> = ({
  token,
  weeklyTargetMinutes = 300,
}) => {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [metricView, setMetricView] = useState<'duration' | 'discipline' | 'calories'>('duration');

  // Week offset from current week (0 = current week, -1 = last week, +1 = next week)
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Fetch workouts
  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/workouts', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setWorkouts(data.workouts || []);
      }
    } catch (err) {
      console.error('Failed to load workouts for weekly volume chart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [token]);

  // Compute reference date for the active week
  const referenceDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  // Calculate the 7 days (Monday through Sunday) for this week
  const weekDays = useMemo(() => {
    const d = new Date(referenceDate);
    const day = d.getDay(); // 0 = Sun, 1 = Mon ...
    // Calculate Monday
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const result = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      const dateStr = current.toISOString().split('T')[0];
      result.push({
        dateStr,
        dayShort: dayNames[i],
        dayFull: fullDayNames[i],
        dayNumber: current.getDate(),
        monthShort: current.toLocaleString('en-US', { month: 'short' }),
        isToday: dateStr === todayStr,
      });
    }
    return result;
  }, [referenceDate]);

  // Map workouts to each day of the week
  const chartData: DayVolumeData[] = useMemo(() => {
    return weekDays.map((day) => {
      const dayWorkouts = workouts.filter((w) => w.date === day.dateStr);

      const totalDuration = dayWorkouts.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
      const totalCalories = dayWorkouts.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);

      let strengthMinutes = 0;
      let cardioMinutes = 0;
      let hiitMinutes = 0;
      let yogaMinutes = 0;
      let recoveryMinutes = 0;
      let otherMinutes = 0;

      for (const w of dayWorkouts) {
        const mins = w.durationMinutes || 0;
        switch (w.discipline) {
          case 'strength':
            strengthMinutes += mins;
            break;
          case 'cardio':
            cardioMinutes += mins;
            break;
          case 'hiit':
            hiitMinutes += mins;
            break;
          case 'yoga':
            yogaMinutes += mins;
            break;
          case 'recovery':
            recoveryMinutes += mins;
            break;
          default:
            otherMinutes += mins;
            break;
        }
      }

      return {
        ...day,
        totalDuration,
        totalCalories,
        sessionsCount: dayWorkouts.length,
        strengthMinutes,
        cardioMinutes,
        hiitMinutes,
        yogaMinutes,
        recoveryMinutes,
        otherMinutes,
        sessions: dayWorkouts,
      };
    });
  }, [weekDays, workouts]);

  // Weekly Aggregates
  const totalWeeklyMinutes = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.totalDuration, 0);
  }, [chartData]);

  const totalWeeklyCalories = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.totalCalories, 0);
  }, [chartData]);

  const activeDaysCount = useMemo(() => {
    return chartData.filter((d) => d.totalDuration > 0).length;
  }, [chartData]);

  const targetAttainmentPct = useMemo(() => {
    if (weeklyTargetMinutes <= 0) return 0;
    return Math.min(200, Math.round((totalWeeklyMinutes / weeklyTargetMinutes) * 100));
  }, [totalWeeklyMinutes, weeklyTargetMinutes]);

  const avgDailyMinutes = useMemo(() => {
    return activeDaysCount > 0 ? Math.round(totalWeeklyMinutes / activeDaysCount) : 0;
  }, [totalWeeklyMinutes, activeDaysCount]);

  // Formatted date range: e.g. "Oct 19 – Oct 25, 2026"
  const dateRangeLabel = useMemo(() => {
    if (weekDays.length === 0) return '';
    const first = weekDays[0];
    const last = weekDays[6];
    return `${first.monthShort} ${first.dayNumber} – ${last.monthShort} ${last.dayNumber}`;
  }, [weekDays]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DayVolumeData = payload[0].payload;
      return (
        <div className="bg-neutral-900 border border-neutral-700 p-3 shadow-2xl text-xs space-y-2 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
            <div>
              <span className="font-extrabold text-white uppercase block">
                {data.dayFull}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {data.dateStr} {data.isToday && '• (Today)'}
              </span>
            </div>
            {data.sessionsCount > 0 && (
              <span className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-[10px] font-mono text-[#FFFF00]">
                {data.sessionsCount} {data.sessionsCount === 1 ? 'Session' : 'Sessions'}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FFFF00]" />
                <span>Total Duration:</span>
              </span>
              <strong className="font-mono text-white text-sm">
                {data.totalDuration} min
              </strong>
            </div>

            {data.totalCalories > 0 && (
              <div className="flex justify-between items-center text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Caloric Output:</span>
                </span>
                <strong className="font-mono text-white">
                  {data.totalCalories} kcal
                </strong>
              </div>
            )}
          </div>

          {/* Discipline Breakdown within Tooltip */}
          {metricView === 'discipline' && data.totalDuration > 0 && (
            <div className="pt-2 border-t border-neutral-800 space-y-1 text-[11px]">
              {data.strengthMinutes > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Strength & Lifting:</span>
                  <span className="font-mono font-bold">{data.strengthMinutes}m</span>
                </div>
              )}
              {data.hiitMinutes > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>HIIT & Sprints:</span>
                  <span className="font-mono font-bold">{data.hiitMinutes}m</span>
                </div>
              )}
              {data.cardioMinutes > 0 && (
                <div className="flex justify-between text-cyan-400">
                  <span>Cardio & Turf:</span>
                  <span className="font-mono font-bold">{data.cardioMinutes}m</span>
                </div>
              )}
              {data.yogaMinutes > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Yoga & Mobility:</span>
                  <span className="font-mono font-bold">{data.yogaMinutes}m</span>
                </div>
              )}
              {data.recoveryMinutes > 0 && (
                <div className="flex justify-between text-purple-400">
                  <span>Active Recovery:</span>
                  <span className="font-mono font-bold">{data.recoveryMinutes}m</span>
                </div>
              )}
            </div>
          )}

          {/* Session Titles List */}
          {data.sessions.length > 0 && (
            <div className="pt-2 border-t border-neutral-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                Workouts:
              </span>
              {data.sessions.map((s) => (
                <div key={s.id} className="text-[11px] text-neutral-300 truncate">
                  • {s.title} ({s.durationMinutes}m)
                </div>
              ))}
            </div>
          )}

          {data.totalDuration === 0 && (
            <div className="text-[11px] text-neutral-500 italic">
              Rest or scheduled recovery day
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 space-y-6">
      {/* Top Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFFF00] mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Weekly Training Volume Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight">
            Workout Duration & Volume
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Daily time investment, discipline distribution, and progress against your weekly volume target.
          </p>
        </div>

        {/* View Metric Mode Switcher & Week Navigator */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Metric View Toggle */}
          <div className="flex bg-neutral-900 border border-neutral-800 p-0.5 text-xs font-bold uppercase">
            <button
              onClick={() => setMetricView('duration')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                metricView === 'duration'
                  ? 'bg-neutral-800 text-[#FFFF00]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Duration (Min)
            </button>
            <button
              onClick={() => setMetricView('discipline')}
              className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1 ${
                metricView === 'discipline'
                  ? 'bg-neutral-800 text-[#FFFF00]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Disciplines</span>
            </button>
            <button
              onClick={() => setMetricView('calories')}
              className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1 ${
                metricView === 'calories'
                  ? 'bg-neutral-800 text-[#FFFF00]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Calories</span>
            </button>
          </div>

          {/* Week Navigators */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800">
            <button
              onClick={() => setWeekOffset((prev) => prev - 1)}
              title="Previous Week"
              className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer hover:bg-neutral-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-mono font-bold text-white whitespace-nowrap">
              {weekOffset === 0 ? 'This Week' : dateRangeLabel}
            </span>
            <button
              onClick={() => setWeekOffset((prev) => prev + 1)}
              title="Next Week"
              className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer hover:bg-neutral-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {weekOffset !== 0 && (
              <button
                onClick={() => setWeekOffset(0)}
                className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FFFF00] hover:underline border-l border-neutral-800"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Stats Counter Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-neutral-900 border border-neutral-800 p-4">
        {/* Total Time */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Weekly Time Logged
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#FFFF00] font-mono">
              {totalWeeklyMinutes}
            </span>
            <span className="text-xs text-neutral-400 font-semibold uppercase">
              Min ({Math.floor(totalWeeklyMinutes / 60)}h {totalWeeklyMinutes % 60}m)
            </span>
          </div>
        </div>

        {/* Target Attainment */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Target ({weeklyTargetMinutes}m)
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {targetAttainmentPct}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-neutral-950 border border-neutral-800 overflow-hidden relative">
            <div
              className={`h-full transition-all duration-500 ${
                targetAttainmentPct >= 100 ? 'bg-emerald-400' : 'bg-[#FFFF00]'
              }`}
              style={{ width: `${Math.min(100, targetAttainmentPct)}%` }}
            />
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            {totalWeeklyMinutes >= weeklyTargetMinutes
              ? `Target exceeded by +${totalWeeklyMinutes - weeklyTargetMinutes} min`
              : `${weeklyTargetMinutes - totalWeeklyMinutes} min to target`}
          </span>
        </div>

        {/* Active Days */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Active Frequency
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {activeDaysCount}
            </span>
            <span className="text-xs text-neutral-400 font-semibold uppercase">/ 7 Days</span>
          </div>
        </div>

        {/* Total Caloric Output */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Active Caloric Burn
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {totalWeeklyCalories.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400 font-semibold uppercase">kCal</span>
          </div>
        </div>
      </div>

      {/* Main Recharts Bar Chart Container */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase text-white tracking-wider">
              {metricView === 'duration' && 'Daily Workout Duration (Minutes)'}
              {metricView === 'discipline' && 'Discipline Volume Breakdown (Minutes)'}
              {metricView === 'calories' && 'Active Caloric Burn by Day (kCal)'}
            </span>
            <span className="text-[10px] font-mono text-neutral-500">
              ({dateRangeLabel})
            </span>
          </div>

          {/* Quick Legend / Guide */}
          {metricView === 'duration' && (
            <div className="flex items-center gap-3 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#FFFF00] rounded-none inline-block" />
                <span>Logged Minutes</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-yellow-600 border-dashed inline-block" />
                <span>Daily Target (45m)</span>
              </span>
            </div>
          )}

          {metricView === 'discipline' && (
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold">
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 bg-amber-400" /> Strength
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 bg-rose-400" /> HIIT
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 bg-cyan-400" /> Cardio
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 bg-emerald-400" /> Yoga
              </span>
              <span className="flex items-center gap-1 text-purple-400">
                <span className="w-2 h-2 bg-purple-400" /> Recovery
              </span>
            </div>
          )}
        </div>

        {/* Chart Viewport */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {metricView === 'duration' ? (
              <BarChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis
                  dataKey="dayShort"
                  stroke="#737373"
                  tick={{ fill: '#a3a3a3', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#404040' }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#737373"
                  tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#404040' }}
                  tickLine={false}
                  unit="m"
                  domain={[0, 'auto']}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <ReferenceLine
                  y={45}
                  stroke="#ca8a04"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Daily Target: 45m',
                    fill: '#ca8a04',
                    fontSize: 10,
                    position: 'top',
                    fontWeight: 700,
                  }}
                />
                <Bar dataKey="totalDuration" name="Duration" radius={[3, 3, 0, 0]} maxBarSize={48}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isToday ? '#FFFF00' : entry.totalDuration > 0 ? '#EAB308' : '#262626'}
                      stroke={entry.isToday ? '#FFFFFF' : 'transparent'}
                      strokeWidth={entry.isToday ? 1.5 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : metricView === 'discipline' ? (
              <BarChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis
                  dataKey="dayShort"
                  stroke="#737373"
                  tick={{ fill: '#a3a3a3', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#404040' }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#737373"
                  tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#404040' }}
                  tickLine={false}
                  unit="m"
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="strengthMinutes" name="Strength" stackId="a" fill="#F59E0B" maxBarSize={48} />
                <Bar dataKey="hiitMinutes" name="HIIT" stackId="a" fill="#F43F5E" maxBarSize={48} />
                <Bar dataKey="cardioMinutes" name="Cardio" stackId="a" fill="#06B6D4" maxBarSize={48} />
                <Bar dataKey="yogaMinutes" name="Yoga" stackId="a" fill="#10B981" maxBarSize={48} />
                <Bar dataKey="recoveryMinutes" name="Recovery" stackId="a" fill="#A855F7" maxBarSize={48} />
                <Bar dataKey="otherMinutes" name="Other" stackId="a" fill="#737373" maxBarSize={48} />
              </BarChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis
                  dataKey="dayShort"
                  stroke="#737373"
                  tick={{ fill: '#a3a3a3', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#404040' }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#737373"
                  tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#404040' }}
                  tickLine={false}
                  unit=" kcal"
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="totalCalories" name="Active Calories" fill="#F97316" radius={[3, 3, 0, 0]} maxBarSize={48}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cal-cell-${index}`}
                      fill={entry.isToday ? '#FB923C' : entry.totalCalories > 0 ? '#EA580C' : '#262626'}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Days of the Week Breakdown Pill Row */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-4 pt-4 border-t border-neutral-800 text-center">
          {chartData.map((d) => (
            <div
              key={d.dateStr}
              className={`p-2 border transition-all ${
                d.isToday
                  ? 'border-[#FFFF00] bg-neutral-800'
                  : d.totalDuration > 0
                  ? 'border-neutral-800 bg-neutral-950'
                  : 'border-neutral-900 bg-neutral-950/40 opacity-50'
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase block ${
                  d.isToday ? 'text-[#FFFF00]' : 'text-neutral-400'
                }`}
              >
                {d.dayShort} {d.dayNumber}
              </span>
              <span className="font-mono font-extrabold text-xs text-white block mt-0.5">
                {d.totalDuration > 0 ? `${d.totalDuration}m` : 'Rest'}
              </span>
              {d.sessionsCount > 1 && (
                <span className="text-[9px] text-[#FFFF00] font-mono block">
                  {d.sessionsCount} sess.
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
