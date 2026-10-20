import React, { useState, useEffect } from 'react';
import { FitnessGoalItem } from '../types';
import { Target, Plus, CheckCircle2, Trophy, Flame, Dumbbell, Calendar, Trash2, Edit2, ArrowUpRight, Sparkles } from 'lucide-react';

interface FitnessGoalsSectionProps {
  token: string | null;
}

export const FitnessGoalsSection: React.FC<FitnessGoalsSectionProps> = ({ token }) => {
  const [goals, setGoals] = useState<FitnessGoalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickUpdateOpen, setIsQuickUpdateOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoalItem | null>(null);
  const [quickValue, setQuickValue] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State for creating new goal
  const [formData, setFormData] = useState({
    title: '',
    category: 'weight_loss' as FitnessGoalItem['category'],
    startValue: '85.0',
    currentValue: '83.0',
    targetValue: '78.0',
    unit: 'kg',
    deadline: '',
    notes: '',
  });

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/goals', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setGoals(data.goals || []);
      }
    } catch (err) {
      console.error('Failed to load goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [token]);

  // Calculate percentage progress toward goal
  const calculateProgress = (goal: FitnessGoalItem) => {
    const { startValue, currentValue, targetValue, category } = goal;

    if (category === 'weight_loss') {
      const totalSpan = startValue - targetValue;
      if (totalSpan <= 0) return 100;
      const progressMade = startValue - currentValue;
      const pct = (progressMade / totalSpan) * 100;
      return Math.min(100, Math.max(0, Math.round(pct * 10) / 10));
    } else {
      // Gain / Frequency / Nutrition
      const totalSpan = targetValue - startValue;
      if (totalSpan <= 0) {
        if (targetValue > 0) {
          const pct = (currentValue / targetValue) * 100;
          return Math.min(100, Math.max(0, Math.round(pct * 10) / 10));
        }
        return 100;
      }
      const progressMade = currentValue - startValue;
      const pct = (progressMade / totalSpan) * 100;
      return Math.min(100, Math.max(0, Math.round(pct * 10) / 10));
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.targetValue) return;

    const payload = {
      title: formData.title,
      category: formData.category,
      startValue: parseFloat(formData.startValue) || 0,
      currentValue: parseFloat(formData.currentValue) || 0,
      targetValue: parseFloat(formData.targetValue) || 0,
      unit: formData.unit || 'kg',
      deadline: formData.deadline,
      notes: formData.notes,
    };

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchGoals();
        setIsModalOpen(false);
        setFeedback('New fitness goal established successfully!');
        setTimeout(() => setFeedback(null), 3500);

        setFormData({
          title: '',
          category: 'weight_loss',
          startValue: '',
          currentValue: '',
          targetValue: '',
          unit: 'kg',
          deadline: '',
          notes: '',
        });
      }
    } catch (err) {
      console.error('Failed to create goal:', err);
    }
  };

  const handleQuickUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || quickValue === '') return;

    try {
      const res = await fetch(`/api/goals/${selectedGoal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currentValue: parseFloat(quickValue),
        }),
      });

      if (res.ok) {
        await fetchGoals();
        setIsQuickUpdateOpen(false);
        setSelectedGoal(null);
        setFeedback('Goal progress updated!');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update goal:', err);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        setGoals(goals.filter((g) => g.id !== id));
        setFeedback('Goal removed.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  const getCategoryLabel = (cat: FitnessGoalItem['category']) => {
    switch (cat) {
      case 'weight_loss':
        return 'Fat Loss & Recomp';
      case 'muscle_gain':
        return 'Hypertrophy Mass';
      case 'workout_frequency':
        return 'Training Consistency';
      case 'nutrition':
        return 'Macro Fueling';
      default:
        return 'Fitness Target';
    }
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFFF00] mb-1">
            <Target className="w-4 h-4" />
            <span>Target Attainment & Milestones</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
            Specific Fitness Goals
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Set quantifiable targets for body weight, muscular hypertrophy, weekly gym attendance, and nutrition.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Set New Target</span>
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

      {/* Goals Grid */}
      {loading ? (
        <div className="text-xs text-neutral-500 py-8 text-center">Loading fitness targets...</div>
      ) : goals.length === 0 ? (
        <div className="p-10 text-center bg-neutral-900/50 border border-neutral-800 space-y-3">
          <Target className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="text-base font-bold uppercase text-white">No Fitness Goals Set Yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Establish your target weight, weekly training frequency, or muscle gain milestones to see your live progress bar.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 px-4 py-2 bg-[#FFFF00] text-black font-bold text-xs uppercase tracking-wider mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progressPct = calculateProgress(goal);
            const isCompleted = progressPct >= 100;
            const remaining = Math.abs(Number((goal.targetValue - goal.currentValue).toFixed(1)));

            return (
              <div
                key={goal.id}
                className={`p-6 border transition-all duration-300 flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-neutral-900/90 border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFFF00]">
                      {getCategoryLabel(goal.category)}
                    </span>
                    {isCompleted ? (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-black px-2 py-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Goal Smashed!</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-neutral-400">
                        {goal.deadline ? `Target: ${goal.deadline}` : 'Continuous Target'}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold uppercase text-white mb-4 tracking-wide">
                    {goal.title}
                  </h3>

                  {/* Attainment Percentage & Progress Bar */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-neutral-400 font-medium">Attainment Progress:</span>
                      <span
                        className={`text-base font-black font-mono tabular-nums ${
                          isCompleted ? 'text-emerald-400' : 'text-[#FFFF00]'
                        }`}
                      >
                        {progressPct}%
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-3 bg-neutral-950 overflow-hidden border border-neutral-800 p-0.5">
                      <div
                        className={`h-full transition-all duration-700 ease-out ${
                          isCompleted ? 'bg-emerald-500' : 'bg-[#FFFF00]'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-neutral-400 font-mono pt-1">
                      <span>Start: {goal.startValue} {goal.unit}</span>
                      <span className="text-white font-bold">Now: {goal.currentValue} {goal.unit}</span>
                      <span className="text-[#FFFF00] font-bold">Goal: {goal.targetValue} {goal.unit}</span>
                    </div>
                  </div>

                  {/* Notes / remaining indicator */}
                  <div className="p-3 bg-neutral-950 border border-neutral-800/80 mb-5 text-xs text-neutral-300">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-neutral-400 font-bold uppercase text-[10px]">Delta Remaining:</span>
                      <span className="text-white font-mono font-bold">
                        {isCompleted ? '0.0' : remaining} {goal.unit}
                      </span>
                    </div>
                    {goal.notes && (
                      <p className="text-[11px] text-neutral-400 italic border-t border-neutral-900 pt-1 mt-1">
                        &ldquo;{goal.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions: Update Progress & Delete */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs">
                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setQuickValue(goal.currentValue.toString());
                      setIsQuickUpdateOpen(true);
                    }}
                    className="text-[#FFFF00] hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Update Current Log</span>
                  </button>

                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Remove goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Set New Goal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 text-white shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white"
            >
              &times;
            </button>

            <div className="mb-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#FFFF00] block mb-1">
                Goal Setting Protocol
              </span>
              <h3 className="text-2xl font-extrabold uppercase tracking-tight text-white">
                Define Fitness Target
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Establish clear starting and target benchmarks to generate an attainment progress bar.
              </p>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cut to 78kg & Reveal Abs"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Goal Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const cat = e.target.value as FitnessGoalItem['category'];
                      let defaultUnit = 'kg';
                      if (cat === 'workout_frequency') defaultUnit = 'days/week';
                      if (cat === 'nutrition') defaultUnit = 'g/day';
                      setFormData({ ...formData, category: cat, unit: defaultUnit });
                    }}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs focus:border-[#FFFF00] focus:outline-none"
                  >
                    <option value="weight_loss">Fat Shred / Weight Loss</option>
                    <option value="muscle_gain">Lean Muscle Mass Gain</option>
                    <option value="workout_frequency">Weekly Workout Frequency</option>
                    <option value="nutrition">Daily Protein / Macro Target</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Measurement Unit
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="kg, lbs, days/week, g/day"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Starting Value *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="86.4"
                    value={formData.startValue}
                    onChange={(e) => setFormData({ ...formData, startValue: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Current Value *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="81.2"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Target Goal *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="78.0"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Strategy Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500 kcal deficit + HIIT"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Confirm & Track Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Update Current Value */}
      {isQuickUpdateOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-neutral-950 border border-neutral-800 text-white shadow-2xl p-6">
            <button
              onClick={() => {
                setIsQuickUpdateOpen(false);
                setSelectedGoal(null);
              }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              &times;
            </button>

            <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFFF00] block mb-1">
              Log Goal Progress
            </span>
            <h3 className="text-lg font-bold uppercase text-white mb-2">
              {selectedGoal.title}
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Enter your latest reading. Target is <strong className="text-white">{selectedGoal.targetValue} {selectedGoal.unit}</strong>.
            </p>

            <form onSubmit={handleQuickUpdate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  New Current Value ({selectedGoal.unit}) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  autoFocus
                  value={quickValue}
                  onChange={(e) => setQuickValue(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2.5 text-white text-sm font-mono focus:border-[#FFFF00] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Save New Progress
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
