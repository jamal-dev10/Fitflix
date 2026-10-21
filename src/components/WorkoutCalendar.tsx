import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Dumbbell,
  Flame,
  Clock,
  Activity,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  MessageSquareText,
  Edit3,
  Save,
  FileText,
  Check
} from 'lucide-react';
import { WorkoutSession } from '../types';

interface WorkoutCalendarProps {
  token: string | null;
}

const DISCIPLINE_CONFIG: Record<
  WorkoutSession['discipline'],
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  strength: {
    label: 'Strength',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
  },
  cardio: {
    label: 'Cardio',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    dot: 'bg-cyan-400',
  },
  hiit: {
    label: 'HIIT',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    dot: 'bg-rose-400',
  },
  yoga: {
    label: 'Yoga & Mobility',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  recovery: {
    label: 'Recovery',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    dot: 'bg-purple-400',
  },
  other: {
    label: 'General',
    bg: 'bg-neutral-500/10',
    text: 'text-neutral-400',
    border: 'border-neutral-500/30',
    dot: 'bg-neutral-400',
  },
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({ token }) => {
  // Calendar view state: current month/year
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-indexed

  // Format today as YYYY-MM-DD
  const todayFormatted = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  const [selectedDate, setSelectedDate] = useState<string>(todayFormatted);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form state
  const [formDate, setFormDate] = useState(todayFormatted);
  const [formTitle, setFormTitle] = useState('');
  const [formDiscipline, setFormDiscipline] = useState<WorkoutSession['discipline']>('strength');
  const [formDuration, setFormDuration] = useState<number>(60);
  const [formIntensity, setFormIntensity] = useState<number>(8);
  const [formCalories, setFormCalories] = useState<string>('450');
  const [formExercises, setFormExercises] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Inline reflection editing state
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [editingNotesText, setEditingNotesText] = useState<string>('');
  const [savingInlineNotes, setSavingInlineNotes] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'feed'>('calendar');
  const [feedSearch, setFeedSearch] = useState<string>('');

  const REFLECTION_TAGS = [
    '⚡ High Energy',
    '💪 Hit New PR',
    '🔥 Insane Pump',
    '🎯 Strict Technique',
    '⏳ Smooth Pacing',
    '🧘 Sore / Deload Needed',
    '💧 Hydration Priority',
    '🧠 Bulletproof Focus',
  ];

  const filteredFeedWorkouts = useMemo(() => {
    if (!feedSearch.trim()) return workouts;
    const q = feedSearch.toLowerCase();
    return workouts.filter((w) => {
      const matchTitle = w.title.toLowerCase().includes(q);
      const matchNotes = (w.notes || '').toLowerCase().includes(q);
      const matchExercises = (w.exercisesCompleted || []).some((e) => e.toLowerCase().includes(q));
      const matchDiscipline = w.discipline.toLowerCase().includes(q);
      const matchDate = w.date.includes(q);
      return matchTitle || matchNotes || matchExercises || matchDiscipline || matchDate;
    });
  }, [workouts, feedSearch]);

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
      console.error('Failed to load workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [token]);

  // Navigate months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(todayFormatted);
  };

  // Group workouts by date: { '2026-10-20': [WorkoutSession, ...] }
  const workoutsByDate = useMemo(() => {
    const map: Record<string, WorkoutSession[]> = {};
    for (const w of workouts) {
      if (!map[w.date]) {
        map[w.date] = [];
      }
      map[w.date].push(w);
    }
    return map;
  }, [workouts]);

  // Workouts for the selected date
  const selectedDayWorkouts = useMemo(() => {
    return workoutsByDate[selectedDate] || [];
  }, [workoutsByDate, selectedDate]);

  // Month metrics
  const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const monthWorkouts = useMemo(() => {
    return workouts.filter((w) => w.date.startsWith(monthPrefix));
  }, [workouts, monthPrefix]);

  const totalMinutesThisMonth = useMemo(() => {
    return monthWorkouts.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  }, [monthWorkouts]);

  const totalCaloriesThisMonth = useMemo(() => {
    return monthWorkouts.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);
  }, [monthWorkouts]);

  const avgIntensityThisMonth = useMemo(() => {
    if (monthWorkouts.length === 0) return 0;
    const sum = monthWorkouts.reduce((acc, curr) => acc + (curr.intensityRpe || 0), 0);
    return (sum / monthWorkouts.length).toFixed(1);
  }, [monthWorkouts]);

  // Calendar Grid calculation (Monday start)
  const calendarCells = useMemo(() => {
    // First day of current month
    const firstDay = new Date(currentYear, currentMonth, 1);
    // Number of days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // Weekday of 1st day (0 = Sun, 1 = Mon, ..., 6 = Sat).
    // Convert to Monday start: Mon=0, Tue=1, ..., Sun=6
    const startDayIndex = (firstDay.getDay() + 6) % 7;

    // Previous month padding
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    const cells: Array<{
      dayNumber: number;
      dateString: string;
      isCurrentMonth: boolean;
      isToday: boolean;
    }> = [];

    // Add trailing days from previous month
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const prevM = currentMonth === 0 ? 12 : currentMonth;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${String(prevM).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        dayNumber: day,
        dateString: dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayFormatted,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        dayNumber: day,
        dateString: dateStr,
        isCurrentMonth: true,
        isToday: dateStr === todayFormatted,
      });
    }

    // Remaining slots to complete grid to a multiple of 7 (usually 35 or 42 cells)
    const totalRemaining = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= totalRemaining; day++) {
      const nextM = currentMonth === 11 ? 1 : currentMonth + 2;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextY}-${String(nextM).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        dayNumber: day,
        dateString: dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayFormatted,
      });
    }

    return cells;
  }, [currentYear, currentMonth, todayFormatted]);

  // Open Log Modal
  const handleOpenLogModal = (dateToLog?: string) => {
    const targetDate = dateToLog || selectedDate || todayFormatted;
    setFormDate(targetDate);
    setFormTitle('');
    setFormDiscipline('strength');
    setFormDuration(60);
    setFormIntensity(8);
    setFormCalories('450');
    setFormExercises('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  // Submit Workout Log
  const handleSaveWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          date: formDate,
          title: formTitle.trim(),
          discipline: formDiscipline,
          durationMinutes: formDuration,
          intensityRpe: formIntensity,
          caloriesBurned: formCalories ? Number(formCalories) : undefined,
          exercisesCompleted: formExercises
            ? formExercises.split('\n').map((s) => s.trim()).filter(Boolean)
            : [],
          notes: formNotes.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setWorkouts((prev) => [data.workout, ...prev]);
        setSelectedDate(formDate);
        setIsModalOpen(false);
        setFeedback('Workout successfully logged to your calendar.');
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch (err) {
      console.error('Failed to log workout:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Workout
  const handleDeleteWorkout = async (id: string) => {
    if (!confirm('Are you sure you want to remove this logged workout?')) return;
    try {
      const res = await fetch(`/api/workouts/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setWorkouts((prev) => prev.filter((w) => w.id !== id));
        setFeedback('Workout removed from your calendar.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete workout:', err);
    }
  };

  // Start inline editing of reflection for an existing session
  const handleStartEditingNotes = (workout: WorkoutSession) => {
    setEditingWorkoutId(workout.id);
    setEditingNotesText(workout.notes || '');
  };

  const handleCancelEditingNotes = () => {
    setEditingWorkoutId(null);
    setEditingNotesText('');
  };

  // Save inline reflection updates
  const handleSaveInlineNotes = async (workoutId: string) => {
    setSavingInlineNotes(true);
    try {
      const res = await fetch(`/api/workouts/${workoutId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ notes: editingNotesText.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setWorkouts((prev) =>
          prev.map((w) => (w.id === workoutId ? { ...w, notes: data.workout.notes } : w))
        );
        setEditingWorkoutId(null);
        setEditingNotesText('');
        setFeedback('Post-workout reflection saved.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update reflection:', err);
    } finally {
      setSavingInlineNotes(false);
    }
  };

  const handleAppendFormReflectionTag = (tag: string) => {
    setFormNotes((prev) => (prev ? `${prev} • ${tag}` : tag));
  };

  const handleAppendInlineReflectionTag = (tag: string) => {
    setEditingNotesText((prev) => (prev ? `${prev} • ${tag}` : tag));
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFFF00] mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>FitFlex Training Ledger</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight">
            Workout Calendar
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Log your training sessions, track weekly volume, and build unyielding consistency.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-neutral-900 border border-neutral-800 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-neutral-800 text-[#FFFF00]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Calendar View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('feed')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'feed'
                  ? 'bg-neutral-800 text-[#FFFF00]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span>Reflections Feed</span>
              <span className="text-[10px] font-mono px-1 py-0.2 bg-black text-neutral-300">
                {workouts.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => handleOpenLogModal()}
            className="px-4 py-2 bg-[#FFFF00] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-yellow-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Log Workout</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Monthly Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-900 border border-neutral-800 p-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Workouts ({MONTH_NAMES[currentMonth].slice(0, 3)})
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {monthWorkouts.length}
            </span>
            <span className="text-xs text-neutral-400 uppercase font-semibold">Sessions</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Training Volume
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#FFFF00] font-mono">
              {totalMinutesThisMonth}
            </span>
            <span className="text-xs text-neutral-400 uppercase font-semibold">Minutes</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Caloric Burn
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {totalCaloriesThisMonth.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400 uppercase font-semibold">kCal</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Avg Effort (RPE)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {avgIntensityThisMonth || '—'}
            </span>
            <span className="text-xs text-neutral-400 uppercase font-semibold">/ 10</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar (Left 8 cols) + Day Details (Right 4 cols) OR Feed View */}
      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar View (8 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-neutral-900 border border-neutral-800 p-4 sm:p-6">
          {/* Calendar Header with Prev / Next */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg sm:text-xl font-extrabold uppercase text-white tracking-tight">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={handleJumpToToday}
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition-colors"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                aria-label="Next Month"
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {WEEKDAY_NAMES.map((name) => (
              <div
                key={name}
                className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-1"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarCells.map((cell) => {
              const dayWorkouts = workoutsByDate[cell.dateString] || [];
              const isSelected = selectedDate === cell.dateString;
              const hasWorkouts = dayWorkouts.length > 0;

              return (
                <button
                  key={cell.dateString}
                  type="button"
                  onClick={() => setSelectedDate(cell.dateString)}
                  className={`min-h-[78px] sm:min-h-[92px] p-1.5 sm:p-2 text-left flex flex-col justify-between transition-all border relative cursor-pointer group ${
                    isSelected
                      ? 'border-[#FFFF00] bg-neutral-800 shadow-md ring-1 ring-[#FFFF00]/50'
                      : cell.isToday
                      ? 'border-neutral-700 bg-neutral-900/90'
                      : cell.isCurrentMonth
                      ? hasWorkouts
                        ? 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                        : 'border-neutral-800/60 bg-neutral-950/40 hover:border-neutral-700'
                      : 'border-transparent bg-neutral-950/20 opacity-30 hover:opacity-75'
                  }`}
                >
                  {/* Day Number and Today Indicator */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isSelected
                          ? 'text-[#FFFF00]'
                          : cell.isToday
                          ? 'text-white underline decoration-[#FFFF00] decoration-2'
                          : cell.isCurrentMonth
                          ? 'text-neutral-300'
                          : 'text-neutral-600'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {cell.isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFFF00]" title="Today" />
                    )}
                  </div>

                  {/* Workout Pills inside Cell */}
                  <div className="space-y-1 w-full overflow-hidden mt-1">
                    {dayWorkouts.slice(0, 2).map((w) => {
                      const cfg = DISCIPLINE_CONFIG[w.discipline] || DISCIPLINE_CONFIG.other;
                      return (
                        <div
                          key={w.id}
                          className={`text-[9px] sm:text-[10px] leading-tight px-1 py-0.5 truncate flex items-center gap-1 border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          title={`${w.title} (${w.durationMinutes} min)`}
                        >
                          <span className={`w-1 h-1 rounded-full shrink-0 ${cfg.dot}`} />
                          <span className="truncate font-semibold">{w.title}</span>
                        </div>
                      );
                    })}

                    {dayWorkouts.length > 2 && (
                      <div className="text-[9px] text-neutral-400 font-mono pl-1">
                        +{dayWorkouts.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Discipline Legend */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-neutral-800 text-[11px] text-neutral-400">
            <span className="font-bold uppercase tracking-wider text-neutral-500 mr-1">Disciplines:</span>
            {Object.entries(DISCIPLINE_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span>{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Workout Detail Panel (4-5 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFFF00] block">
                  Daily Dossier
                </span>
                <h4 className="text-lg font-bold uppercase text-white font-mono">
                  {selectedDate}
                </h4>
              </div>
              <button
                onClick={() => handleOpenLogModal(selectedDate)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-[#FFFF00] hover:text-black border border-neutral-700 text-xs font-bold uppercase tracking-wider text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Here</span>
              </button>
            </div>

            {selectedDayWorkouts.length === 0 ? (
              <div className="py-12 text-center bg-neutral-950/60 border border-neutral-800/80 p-6 space-y-3">
                <Activity className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-xs text-neutral-400 font-medium">
                  No workout recorded for this date. Rest day or scheduled recovery.
                </p>
                <button
                  onClick={() => handleOpenLogModal(selectedDate)}
                  className="inline-block mt-1 text-xs font-bold uppercase text-[#FFFF00] hover:underline cursor-pointer"
                >
                  + Record A Session &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {selectedDayWorkouts.map((w) => {
                  const cfg = DISCIPLINE_CONFIG[w.discipline] || DISCIPLINE_CONFIG.other;
                  return (
                    <div
                      key={w.id}
                      className="bg-neutral-950 border border-neutral-800 p-4 space-y-3 relative group"
                    >
                      {/* Top Row: Discipline + Duration + Delete */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            {cfg.label}
                          </span>
                          <h5 className="text-sm font-extrabold uppercase text-white tracking-tight">
                            {w.title}
                          </h5>
                        </div>

                        <button
                          onClick={() => handleDeleteWorkout(w.id)}
                          className="text-neutral-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                          title="Delete session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Stats Bar: Duration, RPE, Calories */}
                      <div className="grid grid-cols-3 gap-2 bg-neutral-900/80 p-2 text-center text-xs">
                        <div>
                          <span className="text-[9px] uppercase text-neutral-500 block">Duration</span>
                          <span className="font-mono font-bold text-white">{w.durationMinutes}m</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase text-neutral-500 block">RPE Effort</span>
                          <span className="font-mono font-bold text-[#FFFF00]">{w.intensityRpe}/10</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase text-neutral-500 block">Burn</span>
                          <span className="font-mono font-bold text-white">
                            {w.caloriesBurned ? `${w.caloriesBurned} kcal` : '—'}
                          </span>
                        </div>
                      </div>

                      {/* Exercises list */}
                      {w.exercisesCompleted && w.exercisesCompleted.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                            Key Movements:
                          </span>
                          <ul className="text-xs text-neutral-300 space-y-1 font-mono pl-2 border-l border-neutral-800">
                            {w.exercisesCompleted.map((ex, idx) => (
                              <li key={idx} className="truncate">
                                • {ex}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Post-Workout Reflections & Personal Notes Section */}
                      <div className="pt-2 border-t border-neutral-900 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1.5 text-[#FFFF00]">
                            <MessageSquareText className="w-3.5 h-3.5" />
                            <span>Post-Workout Reflections</span>
                          </span>

                          {editingWorkoutId !== w.id ? (
                            <button
                              type="button"
                              onClick={() => handleStartEditingNotes(w)}
                              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{w.notes ? 'Edit Notes' : '+ Add Notes'}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleCancelEditingNotes}
                              className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>

                        {editingWorkoutId === w.id ? (
                          <div className="space-y-2 bg-neutral-900 p-3 border border-[#FFFF00]/40">
                            <label className="text-[10px] font-bold uppercase text-neutral-300 block">
                              Personal Notes & Reflections Text Area:
                            </label>
                            <textarea
                              rows={3}
                              value={editingNotesText}
                              onChange={(e) => setEditingNotesText(e.target.value)}
                              placeholder="Write your post-workout reflections, pump, fatigue level, or coach cues..."
                              className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white text-xs leading-relaxed focus:border-[#FFFF00] focus:outline-none"
                            />
                            {/* Reflection quick tags */}
                            <div className="flex flex-wrap gap-1">
                              {REFLECTION_TAGS.map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => handleAppendInlineReflectionTag(tag)}
                                  className="text-[9px] px-1.5 py-0.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {editingNotesText.length} characters
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={handleCancelEditingNotes}
                                  className="px-2 py-1 text-[10px] uppercase font-bold text-neutral-400 hover:text-white bg-neutral-800 cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={savingInlineNotes}
                                  onClick={() => handleSaveInlineNotes(w.id)}
                                  className="px-3 py-1 text-[10px] uppercase font-bold text-black bg-[#FFFF00] hover:bg-yellow-400 flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Save className="w-3 h-3" />
                                  <span>{savingInlineNotes ? 'Saving...' : 'Save Reflection'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : w.notes ? (
                          <div className="bg-neutral-900/60 p-2.5 border-l-2 border-[#FFFF00] text-xs text-neutral-300 space-y-1">
                            <p className="italic leading-relaxed whitespace-pre-wrap">&ldquo;{w.notes}&rdquo;</p>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartEditingNotes(w)}
                            className="w-full py-2 px-3 border border-dashed border-neutral-800 hover:border-neutral-700 text-left text-neutral-500 hover:text-neutral-300 text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>No reflections logged yet. Click to record personal post-workout reflections.</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Motivational Tag */}
          <div className="bg-neutral-950 border border-neutral-800/80 p-3 flex items-center gap-3">
            <Zap className="w-5 h-5 text-[#FFFF00] shrink-0" />
            <p className="text-[11px] text-neutral-400 leading-tight">
              &ldquo;Consistent execution beats sporadic perfection. Every session logged compounds.&rdquo;
            </p>
          </div>
        </div>
      </div>
      ) : (
        /* Feed View: Chronological Log with Full Post-Workout Reflections & Notes */
        <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFFF00] mb-0.5">
                <MessageSquareText className="w-4 h-4" />
                <span>Post-Workout Reflections & Notes Feed</span>
              </div>
              <p className="text-xs text-neutral-400">
                A chronological journal of your physical reflections, session intensity, PRs, and recovery notes.
              </p>
            </div>

            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Search reflections, exercises, or tags..."
                value={feedSearch}
                onChange={(e) => setFeedSearch(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#FFFF00] focus:outline-none"
              />
            </div>
          </div>

          {filteredFeedWorkouts.length === 0 ? (
            <div className="py-12 text-center bg-neutral-950 border border-neutral-800/80 p-6 space-y-3">
              <FileText className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400 font-medium">
                No workouts or reflections match your search.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedWorkouts.map((w) => {
                const cfg = DISCIPLINE_CONFIG[w.discipline] || DISCIPLINE_CONFIG.other;
                return (
                  <div
                    key={w.id}
                    className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors p-5 sm:p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-900 pb-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-mono font-bold text-[#FFFF00] bg-neutral-900 border border-neutral-800 px-2 py-1">
                          {w.date}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          {cfg.label}
                        </span>
                        <h4 className="text-base font-extrabold uppercase text-white tracking-tight">
                          {w.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                        <span>{w.durationMinutes} min</span>
                        <span>•</span>
                        <span className="text-[#FFFF00] font-bold">RPE {w.intensityRpe}/10</span>
                        {w.caloriesBurned && (
                          <>
                            <span>•</span>
                            <span>{w.caloriesBurned} kcal</span>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteWorkout(w.id)}
                          className="text-neutral-500 hover:text-rose-400 transition-colors p-1 cursor-pointer ml-2"
                          title="Delete workout"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Exercises */}
                    {w.exercisesCompleted && w.exercisesCompleted.length > 0 && (
                      <div className="text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                          Movements:
                        </span>
                        <div className="flex flex-wrap gap-1.5 font-mono">
                          {w.exercisesCompleted.map((ex, idx) => (
                            <span key={idx} className="bg-neutral-900 px-2 py-0.5 border border-neutral-800 text-neutral-300">
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Post-Workout Reflections Text Area Block */}
                    <div className="bg-neutral-900/60 p-4 border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 text-[#FFFF00]">
                          <MessageSquareText className="w-3.5 h-3.5" />
                          <span>Personal Notes & Post-Workout Reflection</span>
                        </span>

                        {editingWorkoutId !== w.id ? (
                          <button
                            type="button"
                            onClick={() => handleStartEditingNotes(w)}
                            className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 text-xs cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{w.notes ? 'Edit Notes' : '+ Add Notes'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleCancelEditingNotes}
                            className="text-neutral-500 hover:text-neutral-300 transition-colors text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      {editingWorkoutId === w.id ? (
                        <div className="space-y-3 pt-2">
                          <label className="text-[10px] font-bold uppercase text-neutral-300 block">
                            Edit Reflection Text Area:
                          </label>
                          <textarea
                            rows={3}
                            value={editingNotesText}
                            onChange={(e) => setEditingNotesText(e.target.value)}
                            placeholder="Write your reflections on this session, fatigue, PRs, energy, pump, or cues..."
                            className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white text-xs leading-relaxed focus:border-[#FFFF00] focus:outline-none"
                          />
                          <div className="flex flex-wrap gap-1">
                            {REFLECTION_TAGS.map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleAppendInlineReflectionTag(tag)}
                                className="text-[9px] px-2 py-0.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-neutral-500 font-mono">
                              {editingNotesText.length} characters
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={handleCancelEditingNotes}
                                className="px-3 py-1 text-xs uppercase font-bold text-neutral-400 hover:text-white bg-neutral-800 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                disabled={savingInlineNotes}
                                onClick={() => handleSaveInlineNotes(w.id)}
                                className="px-4 py-1 text-xs uppercase font-bold text-black bg-[#FFFF00] hover:bg-yellow-400 flex items-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>{savingInlineNotes ? 'Saving...' : 'Save Reflection'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : w.notes ? (
                        <p className="text-xs text-neutral-300 italic leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-[#FFFF00]">
                          &ldquo;{w.notes}&rdquo;
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEditingNotes(w)}
                          className="w-full py-2.5 px-3 border border-dashed border-neutral-800 hover:border-neutral-700 text-left text-neutral-500 hover:text-neutral-300 text-xs transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>No reflections logged for this workout yet. Click to record personal post-workout reflections.</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal: Log New Workout */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-neutral-800 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFFF00]">
                FitFlex Workout Ledger
              </span>
              <h3 className="text-xl font-extrabold uppercase text-white">
                Log Training Session
              </h3>
            </div>

            <form onSubmit={handleSaveWorkout} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                    Discipline *
                  </label>
                  <select
                    value={formDiscipline}
                    onChange={(e) => setFormDiscipline(e.target.value as WorkoutSession['discipline'])}
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-xs focus:border-[#FFFF00] focus:outline-none"
                  >
                    <option value="strength">Strength & Hypertrophy</option>
                    <option value="cardio">Cardio & Conditioning</option>
                    <option value="hiit">HIIT & Metabolic Sprint</option>
                    <option value="yoga">Yoga & Mobility</option>
                    <option value="recovery">Active Recovery</option>
                    <option value="other">General Fitness</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Session Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavy Barbell Squats & Leg Press"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-xs focus:border-[#FFFF00] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                    Duration (Min)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                    Effort (RPE 1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formIntensity}
                    onChange={(e) => setFormIntensity(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                    Est. Calories
                  </label>
                  <input
                    type="number"
                    placeholder="450"
                    value={formCalories}
                    onChange={(e) => setFormCalories(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Exercises / Sets Completed (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={`Back Squat 4x6 @ 140kg\nBulgarian Split Squats 3x10\nStanding Calf Raises 4x15`}
                  value={formExercises}
                  onChange={(e) => setFormExercises(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase text-[#FFFF00] flex items-center gap-1.5">
                    <MessageSquareText className="w-3.5 h-3.5" />
                    <span>Personal Notes & Post-Workout Reflections</span>
                  </label>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {formNotes.length} / 800 chars
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Reflect on how this session went — perceived effort, muscle pump, mental focus, fatigue levels, personal records, or recovery reminders.
                </p>
                <textarea
                  rows={4}
                  maxLength={800}
                  placeholder="e.g. Hit clean depth on all squat sets. Quads were on fire by the end of the drop set. Pushed past perceived limits and feeling energized. Hydrate with 2L water and foam roll hamstrings before bed."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white text-xs leading-relaxed focus:border-[#FFFF00] focus:outline-none"
                />
                {/* Reflection Quick Prompt Tags */}
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 mr-1">Quick Reflection Tags:</span>
                  {REFLECTION_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAppendFormReflectionTag(tag)}
                      className="text-[9px] font-semibold px-2 py-0.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-[#FFFF00] transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold uppercase text-neutral-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#FFFF00] hover:bg-yellow-400 text-black text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Workout to Calendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
