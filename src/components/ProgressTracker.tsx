import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { ProgressLog } from '../types';
import { Plus, TrendingDown, Target, Scale, Ruler, Trash2, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

interface ProgressTrackerProps {
  token: string | null;
  targetWeight?: number; // e.g. 80 kg
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ token, targetWeight = 80 }) => {
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<'weight' | 'measurements' | 'bodyFat'>('weight');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '81.0',
    bodyFat: '',
    chest: '',
    waist: '',
    arms: '',
    thighs: '',
    notes: '',
  });

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/progress', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to load progress logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.weight) return;

    const weightNum = parseFloat(formData.weight);
    // Convert to kg if imperial
    const weightInKg = unit === 'imperial' ? Number((weightNum * 0.453592).toFixed(1)) : weightNum;

    const newEntry = {
      date: formData.date,
      weight: weightInKg,
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
      chest: formData.chest ? parseFloat(formData.chest) : undefined,
      waist: formData.waist ? parseFloat(formData.waist) : undefined,
      arms: formData.arms ? parseFloat(formData.arms) : undefined,
      thighs: formData.thighs ? parseFloat(formData.thighs) : undefined,
      notes: formData.notes,
    };

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newEntry),
      });

      if (res.ok) {
        await fetchLogs();
        setIsModalOpen(false);
        setFeedback('New measurement logged successfully!');
        setTimeout(() => setFeedback(null), 3500);
        // Reset some fields
        setFormData({
          date: new Date().toISOString().split('T')[0],
          weight: '',
          bodyFat: '',
          chest: '',
          waist: '',
          arms: '',
          thighs: '',
          notes: '',
        });
      }
    } catch (err) {
      console.error('Failed to save log:', err);
    }
  };

  const handleDeleteLog = async (id: string) => {
    try {
      const res = await fetch(`/api/progress/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setLogs(logs.filter((l) => l.id !== id));
        setFeedback('Log entry removed.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete log:', err);
    }
  };

  // Unit conversion helpers
  const toDisplayWeight = (kg: number) => {
    if (unit === 'imperial') return Number((kg * 2.20462).toFixed(1));
    return kg;
  };

  const toDisplayLength = (cm: number) => {
    if (unit === 'imperial') return Number((cm * 0.393701).toFixed(1));
    return cm;
  };

  // Derived statistics
  const firstLog = logs[0];
  const latestLog = logs[logs.length - 1];

  const initialWeight = firstLog ? toDisplayWeight(firstLog.weight) : 0;
  const currentWeight = latestLog ? toDisplayWeight(latestLog.weight) : 0;
  const weightChange = latestLog && firstLog ? Number((currentWeight - initialWeight).toFixed(1)) : 0;

  const currentWaist = latestLog?.waist ? toDisplayLength(latestLog.waist) : null;
  const initialWaist = firstLog?.waist ? toDisplayLength(firstLog.waist) : null;
  const waistChange = currentWaist && initialWaist ? Number((currentWaist - initialWaist).toFixed(1)) : null;

  const currentBodyFat = latestLog?.bodyFat ?? null;
  const initialBodyFat = firstLog?.bodyFat ?? null;
  const bodyFatChange = currentBodyFat && initialBodyFat ? Number((currentBodyFat - initialBodyFat).toFixed(1)) : null;

  const displayTargetWeight = toDisplayWeight(targetWeight);

  // Chart formatted data
  const chartData = logs.map((log) => ({
    rawDate: log.date,
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: toDisplayWeight(log.weight),
    bodyFat: log.bodyFat ?? null,
    waist: log.waist ? toDisplayLength(log.waist) : null,
    chest: log.chest ? toDisplayLength(log.chest) : null,
    arms: log.arms ? toDisplayLength(log.arms) : null,
    thighs: log.thighs ? toDisplayLength(log.thighs) : null,
    notes: log.notes,
  }));

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-950 border border-neutral-800 p-3 shadow-2xl text-xs space-y-1">
          <div className="font-bold text-neutral-400 border-b border-neutral-800 pb-1">{label}</div>
          {payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-neutral-300 capitalize">{item.name}:</span>
              <span className="font-mono font-bold text-white" style={{ color: item.color || '#FFFF00' }}>
                {item.value} {activeMetric === 'weight' ? (unit === 'metric' ? 'kg' : 'lbs') : activeMetric === 'bodyFat' ? '%' : (unit === 'metric' ? 'cm' : 'in')}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFFF00] mb-1">
            <Scale className="w-4 h-4" />
            <span>Biometric Analytics & Recomposition</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
            Visual Progress Tracker
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Log regular weigh-ins and circumference tape measurements to chart your athletic transformation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Unit Toggle */}
          <div className="flex items-center bg-neutral-900 p-1 border border-neutral-800">
            <button
              onClick={() => setUnit('metric')}
              className={`px-2.5 py-1 text-xs font-bold uppercase transition-colors cursor-pointer ${
                unit === 'metric' ? 'bg-[#FFFF00] text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              kg / cm
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={`px-2.5 py-1 text-xs font-bold uppercase transition-colors cursor-pointer ${
                unit === 'imperial' ? 'bg-[#FFFF00] text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              lbs / in
            </button>
          </div>

          {/* Log Entry Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Log Check-In</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {feedback && (
        <div className="p-3 bg-neutral-900 border-l-4 border-[#FFFF00] text-white flex items-center gap-2 text-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#FFFF00]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Stat Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Weight */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">
            Current Weight
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight">
            {currentWeight}{' '}
            <span className="text-xs font-normal text-neutral-400">{unit === 'metric' ? 'kg' : 'lbs'}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium">
            <span className={weightChange <= 0 ? 'text-emerald-400' : 'text-yellow-400'}>
              {weightChange > 0 ? `+${weightChange}` : weightChange} {unit === 'metric' ? 'kg' : 'lbs'}
            </span>
            <span className="text-neutral-500 text-[11px]">since start</span>
          </div>
        </div>

        {/* Waist Measurement */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">
            Waist Circumference
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight">
            {currentWaist ?? '—'}{' '}
            <span className="text-xs font-normal text-neutral-400">{unit === 'metric' ? 'cm' : 'in'}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium">
            {waistChange !== null ? (
              <>
                <span className={waistChange <= 0 ? 'text-emerald-400' : 'text-neutral-300'}>
                  {waistChange > 0 ? `+${waistChange}` : waistChange} {unit === 'metric' ? 'cm' : 'in'}
                </span>
                <span className="text-neutral-500 text-[11px]">reduction</span>
              </>
            ) : (
              <span className="text-neutral-500 text-[11px]">No baseline</span>
            )}
          </div>
        </div>

        {/* Body Fat % */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">
            Body Fat Estimate
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#FFFF00] tabular-nums tracking-tight">
            {currentBodyFat ? `${currentBodyFat}%` : '—'}
          </div>
          <div className="flex items-center gap-1 text-xs font-medium">
            {bodyFatChange !== null ? (
              <>
                <span className={bodyFatChange <= 0 ? 'text-emerald-400' : 'text-yellow-400'}>
                  {bodyFatChange > 0 ? `+${bodyFatChange}%` : `${bodyFatChange}%`}
                </span>
                <span className="text-neutral-500 text-[11px]">overall</span>
              </>
            ) : (
              <span className="text-neutral-500 text-[11px]">Calibrated via InBody</span>
            )}
          </div>
        </div>

        {/* Target Goal Progress */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">
            Goal Target ({unit === 'metric' ? '80 kg' : '176 lbs'})
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight">
            {Math.abs(Number((currentWeight - displayTargetWeight).toFixed(1)))}{' '}
            <span className="text-xs font-normal text-neutral-400">{unit === 'metric' ? 'kg' : 'lbs'} to goal</span>
          </div>
          <div className="text-xs text-neutral-400 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-[#FFFF00]" />
            <span>Target: {displayTargetWeight} {unit === 'metric' ? 'kg' : 'lbs'}</span>
          </div>
        </div>
      </div>

      {/* Chart View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMetric('weight')}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeMetric === 'weight'
                ? 'bg-[#FFFF00] text-black shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            Weight Trend ({unit === 'metric' ? 'kg' : 'lbs'})
          </button>
          <button
            onClick={() => setActiveMetric('measurements')}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeMetric === 'measurements'
                ? 'bg-[#FFFF00] text-black shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            Body Circumferences ({unit === 'metric' ? 'cm' : 'in'})
          </button>
          <button
            onClick={() => setActiveMetric('bodyFat')}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeMetric === 'bodyFat'
                ? 'bg-[#FFFF00] text-black shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            Body Fat %
          </button>
        </div>

        <div className="text-xs text-neutral-500 font-mono">
          {logs.length} Logged Entries
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="bg-neutral-900/60 border border-neutral-800 p-4 sm:p-6">
        {loading ? (
          <div className="h-72 flex items-center justify-center text-xs text-neutral-500">
            Loading visual progress graph...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center text-center space-y-3">
            <Scale className="w-10 h-10 text-neutral-600" />
            <p className="text-xs text-neutral-400">
              No progress entries recorded yet. Click &ldquo;Log Check-In&rdquo; to begin tracking your transformation.
            </p>
          </div>
        ) : (
          <div className="w-full h-80">
            {activeMetric === 'weight' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFFF00" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#FFFF00" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="date" stroke="#737373" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#737373"
                    fontSize={11}
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tickLine={false}
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={displayTargetWeight}
                    stroke="#F59E0B"
                    strokeDasharray="4 4"
                    label={{
                      value: `Target ${displayTargetWeight}`,
                      fill: '#F59E0B',
                      fontSize: 10,
                      position: 'insideTopRight',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    name="Weight"
                    stroke="#FFFF00"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#weightGrad)"
                    dot={{ fill: '#000', stroke: '#FFFF00', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#FFFF00', stroke: '#000', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {activeMetric === 'measurements' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="date" stroke="#737373" fontSize={11} tickLine={false} />
                  <YAxis stroke="#737373" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="waist"
                    name="Waist"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="chest"
                    name="Chest"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="arms"
                    name="Arms"
                    stroke="#FFFF00"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="thighs"
                    name="Thighs"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {activeMetric === 'bodyFat' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="date" stroke="#737373" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#737373"
                    fontSize={11}
                    tickLine={false}
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="bodyFat"
                    name="Body Fat %"
                    stroke="#F59E0B"
                    strokeWidth={2.5}
                    dot={{ fill: '#000', stroke: '#F59E0B', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>

      {/* Historical Data Table */}
      <div className="space-y-4">
        <h3 className="text-base font-bold uppercase tracking-wider text-white">
          Measurement Log History
        </h3>

        <div className="overflow-x-auto border border-neutral-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900 border-b border-neutral-800 text-[11px] font-bold uppercase text-neutral-400">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-[#FFFF00]">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</th>
                <th className="py-3 px-4">Body Fat</th>
                <th className="py-3 px-4">Waist</th>
                <th className="py-3 px-4">Chest</th>
                <th className="py-3 px-4">Arms</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 bg-neutral-950 font-mono">
              {[...logs].reverse().map((log) => (
                <tr key={log.id} className="hover:bg-neutral-900/60 transition-colors">
                  <td className="py-3 px-4 text-white font-sans">{log.date}</td>
                  <td className="py-3 px-4 text-[#FFFF00] font-bold">
                    {toDisplayWeight(log.weight)}
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    {log.bodyFat ? `${log.bodyFat}%` : '—'}
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    {log.waist ? `${toDisplayLength(log.waist)} ${unit === 'metric' ? 'cm' : 'in'}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    {log.chest ? `${toDisplayLength(log.chest)} ${unit === 'metric' ? 'cm' : 'in'}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    {log.arms ? `${toDisplayLength(log.arms)} ${unit === 'metric' ? 'cm' : 'in'}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-neutral-400 font-sans max-w-xs truncate">
                    {log.notes || '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 text-white shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white"
            >
              &times;
            </button>

            <div className="mb-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#FFFF00] block mb-1">
                Biometric Entry
              </span>
              <h3 className="text-xl font-extrabold uppercase text-white">
                Log New Measurement
              </h3>
            </div>

            <form onSubmit={handleAddLog} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Weight ({unit === 'metric' ? 'kg' : 'lbs'}) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="81.0"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Body Fat % (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="16.5"
                    value={formData.bodyFat}
                    onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Waist ({unit === 'metric' ? 'cm' : 'in'})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="84.0"
                    value={formData.waist}
                    onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Chest
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="106"
                    value={formData.chest}
                    onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Arms
                  </label>
                  <input
                    type="number"
                    step="0.2"
                    placeholder="38.5"
                    value={formData.arms}
                    onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Thighs
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="58.5"
                    value={formData.thighs}
                    onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Training Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Post-cardio morning weigh-in, feeling energized"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs focus:border-[#FFFF00] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Save Measurement Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
