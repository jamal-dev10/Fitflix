import React, { useState } from 'react';
import { Calculator, Activity, ArrowRight, Zap, Target, RefreshCw } from 'lucide-react';

export const FitnessCalculator: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(26);
  const [weight, setWeight] = useState<number>(75); // kg or lbs
  const [height, setHeight] = useState<number>(178); // cm or inches
  const [activity, setActivity] = useState<number>(1.55); // moderate
  const [goal, setGoal] = useState<'loss' | 'maintain' | 'gain'>('gain');

  // Calculations
  const weightKg = unit === 'metric' ? weight : weight * 0.453592;
  const heightCm = unit === 'metric' ? height : height * 2.54;

  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? Number((weightKg / (heightM * heightM)).toFixed(1)) : 0;

  // Mifflin-St Jeor Formula
  const bmr =
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = Math.round(bmr * activity);

  let targetCalories = tdee;
  if (goal === 'loss') targetCalories = Math.round(tdee * 0.8); // 20% deficit
  if (goal === 'gain') targetCalories = Math.round(tdee * 1.15); // 15% surplus

  // Macro distribution: ~2g protein per kg of bodyweight, 25% fats, remainder carbs
  const proteinGrams = Math.round(weightKg * 2.2);
  const fatCalories = targetCalories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);
  const proteinCalories = proteinGrams * 4;
  const carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
  const carbGrams = Math.round(carbCalories / 4);

  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (val < 25) return { label: 'Optimal / Healthy', color: 'text-emerald-400' };
    if (val < 30) return { label: 'Overweight', color: 'text-yellow-400' };
    return { label: 'High Body Composition', color: 'text-red-400' };
  };

  const bmiInfo = getBmiCategory(bmi);

  return (
    <section id="calculator" className="py-24 bg-black text-white border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Mark icon */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/assets/img/mark.png"
            alt="FitFlex Mark"
            className="w-7 h-7 object-contain"
          />
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            FitFlex Precision Calculator
          </h2>
        </div>

        <p className="text-neutral-400 text-sm sm:text-base max-w-3xl mb-12 leading-relaxed">
          Input your biometrics to compute your exact Basal Metabolic Rate (BMR), Daily Energy Expenditure (TDEE),
          and scientifically balanced macronutrient targets tailored to your fitness objective.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Form (7 cols) */}
          <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 p-6 sm:p-8 space-y-6">
            {/* Unit & Gender Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-1 bg-neutral-900 p-1 border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setUnit('metric')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer ${
                    unit === 'metric' ? 'bg-[#FFFF00] text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Metric (kg / cm)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('imperial')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer ${
                    unit === 'imperial' ? 'bg-[#FFFF00] text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Imperial (lbs / in)
                </button>
              </div>

              <div className="flex items-center gap-1 bg-neutral-900 p-1 border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer ${
                    gender === 'male' ? 'bg-[#FFFF00] text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer ${
                    gender === 'female' ? 'bg-[#FFFF00] text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Age, Weight, Height Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min="14"
                  max="90"
                  value={age}
                  onChange={(e) => setAge(Math.max(14, Number(e.target.value)))}
                  className="w-full bg-neutral-900 border border-neutral-700 px-4 py-2.5 text-white font-medium focus:border-[#FFFF00] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(30, Number(e.target.value)))}
                  className="w-full bg-neutral-900 border border-neutral-700 px-4 py-2.5 text-white font-medium focus:border-[#FFFF00] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Height ({unit === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={height}
                  onChange={(e) => setHeight(Math.max(100, Number(e.target.value)))}
                  className="w-full bg-neutral-900 border border-neutral-700 px-4 py-2.5 text-white font-medium focus:border-[#FFFF00] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Activity Level Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Daily Physical Activity Level
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(Number(e.target.value))}
                className="w-full bg-neutral-900 border border-neutral-700 px-4 py-3 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none transition-colors"
              >
                <option value={1.2}>Sedentary (Desk job, minimal exercise)</option>
                <option value={1.375}>Lightly Active (1-3 gym workouts/week)</option>
                <option value={1.55}>Moderately Active (3-5 intense sessions/week)</option>
                <option value={1.725}>Very Active (6-7 hard lifting/cardio sessions)</option>
                <option value={1.9}>Elite Athlete / Physical Labor + 2x Daily Training</option>
              </select>
            </div>

            {/* Fitness Goal Tabs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Primary Transformation Goal
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setGoal('loss')}
                  className={`p-3 text-center border text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    goal === 'loss'
                      ? 'bg-neutral-800 border-[#FFFF00] text-[#FFFF00]'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  Fat Shred (-20%)
                </button>
                <button
                  type="button"
                  onClick={() => setGoal('maintain')}
                  className={`p-3 text-center border text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    goal === 'maintain'
                      ? 'bg-neutral-800 border-[#FFFF00] text-[#FFFF00]'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  Maintenance
                </button>
                <button
                  type="button"
                  onClick={() => setGoal('gain')}
                  className={`p-3 text-center border text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    goal === 'gain'
                      ? 'bg-neutral-800 border-[#FFFF00] text-[#FFFF00]'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  Lean Bulk (+15%)
                </button>
              </div>
            </div>
          </div>

          {/* Results Display Panel (5 cols) */}
          <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 p-6 sm:p-8 space-y-6">
            <div className="border-b border-neutral-800 pb-4">
              <span className="text-xs uppercase font-bold tracking-widest text-[#FFFF00] block mb-1">
                Biometric Analysis
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold uppercase text-white">
                Calculated Targets
              </h3>
            </div>

            {/* BMI & Status */}
            <div className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800">
              <div>
                <span className="text-xs text-neutral-400 uppercase tracking-wide block">Body Mass Index (BMI)</span>
                <span className="text-2xl font-extrabold text-white tabular-nums">{bmi}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 uppercase tracking-wide block">Health Range</span>
                <span className={`text-sm font-bold uppercase ${bmiInfo.color}`}>{bmiInfo.label}</span>
              </div>
            </div>

            {/* Daily Caloric Target */}
            <div className="p-6 bg-neutral-950 border-2 border-[#FFFF00] text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                Recommended Daily Energy Intake
              </span>
              <div className="text-4xl sm:text-5xl font-black text-[#FFFF00] tabular-nums tracking-tight">
                {targetCalories.toLocaleString()}{' '}
                <span className="text-lg text-white font-medium uppercase">kcal / day</span>
              </div>
              <div className="mt-2 text-xs text-neutral-400 flex items-center justify-center gap-3">
                <span>BMR: {Math.round(bmr)} kcal</span>
                <span>·</span>
                <span>TDEE: {tdee} kcal</span>
              </div>
            </div>

            {/* Macro Breakdown */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-3">
                Daily Macronutrient Targets:
              </span>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-neutral-950 border border-neutral-800">
                  <span className="text-xs text-neutral-400 block uppercase">Protein</span>
                  <span className="text-xl font-bold text-[#FFFF00] tabular-nums">{proteinGrams}g</span>
                  <span className="text-[10px] text-neutral-500 block">4 kcal/g</span>
                </div>
                <div className="p-3 bg-neutral-950 border border-neutral-800">
                  <span className="text-xs text-neutral-400 block uppercase">Carbohydrates</span>
                  <span className="text-xl font-bold text-white tabular-nums">{carbGrams}g</span>
                  <span className="text-[10px] text-neutral-500 block">4 kcal/g</span>
                </div>
                <div className="p-3 bg-neutral-950 border border-neutral-800">
                  <span className="text-xs text-neutral-400 block uppercase">Fats</span>
                  <span className="text-xl font-bold text-neutral-300 tabular-nums">{fatGrams}g</span>
                  <span className="text-[10px] text-neutral-500 block">9 kcal/g</span>
                </div>
              </div>
            </div>

            {/* Personalized Advice */}
            <div className="p-4 bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-300 leading-relaxed">
              <span className="font-bold text-[#FFFF00] uppercase block mb-1">Coach Note:</span>
              {goal === 'loss' &&
                'Maintain high protein intake to preserve lean muscle tissue while operating in this 20% deficit. Drink 3-4 liters of water daily.'}
              {goal === 'maintain' &&
                'Your caloric intake balances baseline metabolic burn and training output. Ideal for progressive strength and recomp.'}
              {goal === 'gain' &&
                'Ensure 80% of surplus calories come from whole grains, lean poultry/beef, and healthy fats to minimize unwanted adipose gain.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
