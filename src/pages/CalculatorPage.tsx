import React from 'react';
import { FitnessCalculator } from '../components/FitnessCalculator';
import { Calculator, Target, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CalculatorPage: React.FC = () => {
  return (
    <div className="pt-20 bg-black min-h-screen text-white">
      {/* Page Hero Banner */}
      <div className="relative py-16 bg-neutral-950 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFFF00] mb-3">
            <Calculator className="w-4 h-4" />
            <span>Biometric Analytics Engine</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Performance Calculator
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Eliminate nutrition guesswork. Calculate your Basal Metabolic Rate (BMR), Total Daily Energy
            Expenditure (TDEE), and daily macro distribution tailored to your target body composition.
          </p>
        </div>
      </div>

      {/* Main Interactive Calculator */}
      <FitnessCalculator />

      {/* Explanatory Science Section */}
      <section className="py-20 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold uppercase text-white mb-8">
            How The Equations Work
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-neutral-900 border border-neutral-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFFF00]">Mifflin-St Jeor BMR</span>
              <h4 className="text-base font-bold text-white">Baseline Caloric Burn</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Calculates the exact baseline energy your organs, brain, and autonomic nervous system require to survive at rest for 24 hours.
              </p>
            </div>
            <div className="p-6 bg-neutral-900 border border-neutral-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFFF00]">TDEE Factor</span>
              <h4 className="text-base font-bold text-white">Exercise & Non-Exercise Energy</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Factors your physical job activity, gym lifting volume, and NEAT (fidgeting, walking) to calculate total daily energy turnover.
              </p>
            </div>
            <div className="p-6 bg-neutral-900 border border-neutral-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFFF00]">Protein Allocation</span>
              <h4 className="text-base font-bold text-white">Muscle Protein Synthesis (MPS)</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Calibrates optimal dietary protein at 2.2g per kilogram of lean body weight to guarantee positive nitrogen balance and recovery.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
