import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Dumbbell,
  Flame,
  Clock,
  Calendar,
  Search,
  Filter,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Database,
  Quote,
  X,
  ArrowUpDown,
  Zap,
} from 'lucide-react';
import { auth } from '../lib/firebase';
import {
  getFirestoreWorkouts,
  saveFirestoreWorkout,
  deleteFirestoreWorkout,
  subscribeFirestoreWorkouts,
  FirestoreWorkout,
} from '../lib/firestoreService';

interface ActivityLogsProps {
  token: string | null;
  userEmail: string;
  userId: string;
}

const DISCIPLINE_STYLES: Record<
  string,
  { label: string; badgeBg: string; text: string; border: string }
> = {
  strength: {
    label: 'Strength',
    badgeBg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  hiit: {
    label: 'HIIT',
    badgeBg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  cardio: {
    label: 'Cardio',
    badgeBg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
  mobility: {
    label: 'Mobility',
    badgeBg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  recovery: {
    label: 'Recovery',
    badgeBg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  powerlifting: {
    label: 'Powerlifting',
    badgeBg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
  },
  boxing: {
    label: 'Boxing',
    badgeBg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
  },
  yoga: {
    label: 'Yoga',
    badgeBg: 'bg-teal-500/10',
    text: 'text-teal-400',
    border: 'border-teal-500/30',
  },
  other: {
    label: 'Fitness',
    badgeBg: 'bg-neutral-800',
    text: 'text-neutral-300',
    border: 'border-neutral-700',
  },
};

export const ActivityLogs: React.FC<ActivityLogsProps> = ({ token, userEmail, userId }) => {
  const [workouts, setWorkouts] = useState<FirestoreWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'firestore' | 'api-sync'>('firestore');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'duration' | 'calories'>('date-desc');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Workout Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<FirestoreWorkout['type']>('strength');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newDuration, setNewDuration] = useState('60');
  const [newCalories, setNewCalories] = useState('450');
  const [newRpe, setNewRpe] = useState('8');
  const [newNotes, setNewNotes] = useState('');

  // Target UID: Firebase Auth UID or passed userId
  const effectiveUid = auth.currentUser?.uid || userId;

  // Load workouts: Attempt Firestore first; fallback to server API if unauthenticated with Firebase
  const fetchWorkouts = async () => {
    setLoading(true);
    setErrorMsg(null);

    // 1. If Firebase Auth is authenticated, query Firestore directly
    if (auth.currentUser) {
      try {
        const firestoreList = await getFirestoreWorkouts(auth.currentUser.uid);
        if (firestoreList && firestoreList.length > 0) {
          setWorkouts(firestoreList);
          setSource('firestore');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Direct Firestore fetch encountered issue:', err);
      }
    }

    // 2. Fetch from backend /api/workouts as synchronized source
    try {
      const res = await fetch('/api/workouts', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        const serverWorkouts = (data.workouts || []).map((w: any) => ({
          id: String(w.id || `wk-${Date.now()}`),
          userId: effectiveUid,
          userEmail: w.userEmail || userEmail,
          date: w.date || new Date().toISOString().split('T')[0],
          type: (w.discipline || w.type || 'strength') as FirestoreWorkout['type'],
          title: w.title || 'Workout Session',
          duration: Number(w.durationMinutes || w.duration || 45),
          calories: Number(w.caloriesBurned || w.calories || 350),
          rpe: Number(w.intensityRpe || w.rpe || 8),
          notes: w.notes || '',
          createdAt: w.createdAt || new Date().toISOString(),
        }));

        setWorkouts(serverWorkouts);
        setSource(auth.currentUser ? 'firestore' : 'api-sync');
      }
    } catch (err) {
      console.error('Failed to load workouts:', err);
      setErrorMsg('Unable to retrieve workout logs at this time.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();

    // Subscribe to realtime updates if signed in to Firebase Auth
    if (auth.currentUser) {
      const unsubscribe = subscribeFirestoreWorkouts(
        auth.currentUser.uid,
        (updatedList) => {
          if (updatedList && updatedList.length > 0) {
            setWorkouts(updatedList);
            setSource('firestore');
          }
        },
        (err) => {
          console.warn('Realtime subscription listener warning:', err);
        }
      );
      return () => unsubscribe();
    }
  }, [effectiveUid, token]);

  // Sync to Firestore button: writes current workouts to user's Firestore collection
  const handleSyncToFirestore = async () => {
    if (!auth.currentUser) {
      setFeedback('Tip: Sign in with Google to enable instant biometric cloud synchronization directly to your Firestore database.');
      setTimeout(() => setFeedback(null), 5000);
      return;
    }

    try {
      setLoading(true);
      for (const w of workouts) {
        await saveFirestoreWorkout({
          ...w,
          userId: auth.currentUser.uid,
        });
      }
      setSource('firestore');
      setFeedback('Successfully synchronized all activity logs to Cloud Firestore!');
      setTimeout(() => setFeedback(null), 4000);
      await fetchWorkouts();
    } catch (err) {
      console.error('Failed to sync to Firestore:', err);
      setErrorMsg('Failed to sync workouts to Firestore. Check permissions.');
    } finally {
      setLoading(false);
    }
  };

  // Add new workout directly to Firestore
  const handleCreateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    const newId = `wk-${Date.now()}`;
    const newWorkout: FirestoreWorkout = {
      id: newId,
      userId: auth.currentUser?.uid || effectiveUid,
      userEmail,
      date: newDate,
      type: newType,
      title: newTitle.trim(),
      duration: Math.max(1, parseInt(newDuration, 10) || 45),
      calories: Math.max(0, parseInt(newCalories, 10) || 300),
      rpe: Math.min(10, Math.max(1, parseInt(newRpe, 10) || 7)),
      notes: newNotes.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. If signed in with Firebase, save directly to Firestore
      if (auth.currentUser) {
        await saveFirestoreWorkout(newWorkout);
      }

      // 2. Also record in local state and API for consistency
      try {
        await fetch('/api/workouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            date: newWorkout.date,
            title: newWorkout.title,
            discipline: newWorkout.type,
            durationMinutes: newWorkout.duration,
            intensityRpe: newWorkout.rpe,
            caloriesBurned: newWorkout.calories,
            notes: newWorkout.notes,
          }),
        });
      } catch {
        // Non-blocking if API sync is secondary
      }

      setWorkouts((prev) => [newWorkout, ...prev]);
      setShowAddModal(false);
      setNewTitle('');
      setNewNotes('');
      setFeedback('Workout session saved to Cloud Firestore activity logs.');
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      console.error('Failed to save workout:', err);
      setErrorMsg(err?.message || 'Failed to persist workout to Firestore.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete workout
  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      if (auth.currentUser) {
        await deleteFirestoreWorkout(workoutId);
      }

      try {
        await fetch(`/api/workouts/${workoutId}`, {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      } catch {
        // continue
      }

      setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
      setFeedback('Workout removed from activity logs.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Failed to delete workout:', err);
      setErrorMsg('Failed to delete workout from Firestore.');
    }
  };

  // Filtered and Sorted list
  const filteredWorkouts = useMemo(() => {
    let result = [...workouts];

    if (filterDiscipline !== 'all') {
      result = result.filter(
        (w) => w.type.toLowerCase() === filterDiscipline.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          (w.notes && w.notes.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'duration') return b.duration - a.duration;
      if (sortBy === 'calories') return (b.calories || 0) - (a.calories || 0);
      return 0;
    });

    return result;
  }, [workouts, filterDiscipline, searchQuery, sortBy]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalSessions = workouts.length;
    const totalMinutes = workouts.reduce((acc, w) => acc + (w.duration || 0), 0);
    const totalCalories = workouts.reduce((acc, w) => acc + (w.calories || 0), 0);
    const avgRpe = totalSessions > 0
      ? (workouts.reduce((acc, w) => acc + (w.rpe || 0), 0) / totalSessions).toFixed(1)
      : '0.0';

    return { totalSessions, totalMinutes, totalCalories, avgRpe };
  }, [workouts]);

  return (
    <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 space-y-6">
      {/* Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFFF00]">
              Cloud Activity Ledger
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firestore: ai-studio-fitflix-f78a35f8-8bef-46af-92f1-b22d2bc4b483</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight flex items-center gap-3">
            <Activity className="w-7 h-7 text-[#FFFF00]" />
            <span>Activity Logs & Workout History</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Live workout history synced directly with Google Cloud Firestore. Track sets, intensity RPE,
            active caloric burn, and post-training reflections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={fetchWorkouts}
            className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh from Firestore"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#FFFF00]' : ''}`} />
          </button>

          {source !== 'firestore' && auth.currentUser && (
            <button
              type="button"
              onClick={handleSyncToFirestore}
              className="px-3.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-[#FFFF00] text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[#FFFF00]" />
              <span>Sync to Firestore</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#FFFF00] hover:bg-yellow-400 text-black text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Log Workout</span>
          </button>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {feedback && (
        <div className="p-3 bg-neutral-900 border-l-4 border-[#FFFF00] text-white flex items-center gap-2.5 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#FFFF00] shrink-0" />
          <span>{feedback}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-red-950/80 border-l-4 border-red-500 text-red-200 flex items-center gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 4-Stat Metric Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900/80 border border-neutral-800 p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider">Total Sessions</span>
            <Dumbbell className="w-4 h-4 text-[#FFFF00]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stats.totalSessions} <span className="text-xs text-neutral-500 font-sans font-normal">logged</span>
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider">Total Training</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stats.totalMinutes} <span className="text-xs text-neutral-500 font-sans font-normal">mins</span>
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider">Calories Burned</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stats.totalCalories.toLocaleString()} <span className="text-xs text-neutral-500 font-sans font-normal">kcal</span>
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider">Average RPE</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-[#FFFF00] font-mono">
            {stats.avgRpe} <span className="text-xs text-neutral-500 font-sans font-normal">/ 10</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/50 border border-neutral-800 p-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search workouts by name or personal notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFFF00]"
          />
        </div>

        {/* Filter by Discipline */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <select
            value={filterDiscipline}
            onChange={(e) => setFilterDiscipline(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-1.5 focus:outline-none focus:border-[#FFFF00] cursor-pointer"
          >
            <option value="all">All Disciplines</option>
            <option value="strength">Strength</option>
            <option value="hiit">HIIT</option>
            <option value="cardio">Cardio</option>
            <option value="mobility">Mobility</option>
            <option value="recovery">Recovery</option>
            <option value="powerlifting">Powerlifting</option>
            <option value="boxing">Boxing</option>
            <option value="yoga">Yoga</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-1.5 focus:outline-none focus:border-[#FFFF00] cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="duration">Longest Duration</option>
            <option value="calories">Highest Calories</option>
          </select>
        </div>
      </div>

      {/* Activity Logs Table / Cards */}
      {loading ? (
        <div className="py-16 text-center text-neutral-400 space-y-3">
          <RefreshCw className="w-8 h-8 mx-auto text-[#FFFF00] animate-spin" />
          <p className="text-xs uppercase font-mono tracking-wider">Querying Firestore Activity Records...</p>
        </div>
      ) : filteredWorkouts.length === 0 ? (
        <div className="py-16 text-center bg-neutral-950 border border-neutral-800/80 p-8 space-y-3">
          <Dumbbell className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-bold uppercase text-white tracking-wide">No Activity Logs Found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searchQuery || filterDiscipline !== 'all'
              ? 'No workout logs match your filter criteria. Clear filters to see all sessions.'
              : 'Start logging your workouts to build your Firestore-persisted training ledger.'}
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="mt-2 px-4 py-2 bg-[#FFFF00] text-black text-xs font-bold uppercase tracking-wider hover:bg-yellow-400 cursor-pointer"
          >
            Log First Session
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredWorkouts.map((workout) => {
            const discipline = DISCIPLINE_STYLES[workout.type.toLowerCase()] || DISCIPLINE_STYLES.other;
            const rpeScore = workout.rpe || 7;
            const rpeBadgeColor =
              rpeScore >= 9
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : rpeScore >= 7
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

            return (
              <div
                key={workout.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 p-5 transition-all space-y-3"
              >
                {/* Top Row: Date, Discipline Badge, Title, Delete Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs text-neutral-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#FFFF00]" />
                      <span>{workout.date}</span>
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${discipline.badgeBg} ${discipline.text} ${discipline.border}`}
                    >
                      {discipline.label}
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold uppercase text-white tracking-wide">
                      {workout.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-[10px] font-mono text-neutral-500">ID: {workout.id.slice(-8)}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                      title="Delete log from Firestore"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metrics Matrix */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-800/60 text-xs">
                  <div className="bg-neutral-950 p-2.5 border border-neutral-800/80">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block">Duration</span>
                    <strong className="text-white font-mono text-sm">{workout.duration}</strong>{' '}
                    <span className="text-neutral-400 text-[10px]">mins</span>
                  </div>

                  <div className="bg-neutral-950 p-2.5 border border-neutral-800/80">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block">Burn</span>
                    <strong className="text-[#FFFF00] font-mono text-sm">{workout.calories || 0}</strong>{' '}
                    <span className="text-neutral-400 text-[10px]">kcal</span>
                  </div>

                  <div className="bg-neutral-950 p-2.5 border border-neutral-800/80">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block">Effort</span>
                    <span className={`inline-block px-1.5 py-0.5 text-[11px] font-mono font-bold border ${rpeBadgeColor}`}>
                      RPE {workout.rpe || 7}/10
                    </span>
                  </div>

                  <div className="hidden sm:block bg-neutral-950 p-2.5 border border-neutral-800/80">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block">Storage</span>
                    <span className="text-[10px] font-mono text-neutral-300">Firestore Cloud</span>
                  </div>
                </div>

                {/* Post-Workout Reflection / Notes */}
                {workout.notes && (
                  <div className="bg-neutral-950/70 border-l-2 border-[#FFFF00] p-3 text-xs text-neutral-300 flex items-start gap-2.5">
                    <Quote className="w-3.5 h-3.5 text-[#FFFF00] shrink-0 mt-0.5" />
                    <p className="italic leading-relaxed">
                      &ldquo;{workout.notes}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Log New Workout to Firestore */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-700 w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFFF00]">
                  Cloud Firestore Input
                </span>
                <h3 className="text-xl font-extrabold uppercase text-white">Log Workout Session</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkout} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                  Workout Headline / Target Routine *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavy Barbell Squats & Core Hypertrophy"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 p-2.5 text-white focus:outline-none focus:border-[#FFFF00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                    Discipline *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-700 p-2.5 text-white focus:outline-none focus:border-[#FFFF00]"
                  >
                    <option value="strength">Strength</option>
                    <option value="hiit">HIIT</option>
                    <option value="cardio">Cardio</option>
                    <option value="mobility">Mobility</option>
                    <option value="recovery">Recovery</option>
                    <option value="powerlifting">Powerlifting</option>
                    <option value="boxing">Boxing</option>
                    <option value="yoga">Yoga</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 p-2.5 text-white focus:outline-none focus:border-[#FFFF00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="360"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 p-2.5 text-white font-mono focus:outline-none focus:border-[#FFFF00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                    Burn (kcal)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="4000"
                    value={newCalories}
                    onChange={(e) => setNewCalories(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 p-2.5 text-white font-mono focus:outline-none focus:border-[#FFFF00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                    Effort (RPE 1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newRpe}
                    onChange={(e) => setNewRpe(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 p-2.5 text-white font-mono focus:outline-none focus:border-[#FFFF00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                  Post-Workout Reflection & Personal Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Record PRs hit, fatigue levels, hydration observations, or form cues..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 p-2.5 text-white focus:outline-none focus:border-[#FFFF00]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#FFFF00] hover:bg-yellow-400 text-black font-extrabold uppercase text-xs tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving to Cloud...' : 'Commit to Firestore'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
