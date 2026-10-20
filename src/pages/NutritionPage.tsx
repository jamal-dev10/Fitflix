import React from 'react';
import { NutritionSection } from '../components/NutritionSection';
import { Utensils, Flame, Sparkles, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NutritionPage: React.FC = () => {
  return (
    <div className="pt-20 bg-black min-h-screen text-white">
      {/* Page Hero Banner */}
      <div className="relative py-16 bg-neutral-950 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFFF00] mb-3">
            <Utensils className="w-4 h-4" />
            <span>Sports Dietetics & Fueling</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Nutrition & Macro Science
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Exercise sparks the stimulus; nutrition drives the adaptation. Explore customized meal plans,
            bi-weekly diet coaching, and our curated chef recipe database.
          </p>
        </div>
      </div>

      {/* Main Nutrition Section with 3 Pillars and Recipe DB */}
      <NutritionSection />

      {/* Calculator Cross-Link Strip */}
      <section className="py-16 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#FFFF00]">
              <Sparkles className="w-4 h-4" />
              <span>Know Your Exact Numbers</span>
            </div>
            <h3 className="text-2xl font-bold uppercase text-white">
              Haven&apos;t Calculated Your Daily Macro Targets Yet?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              Use our interactive BMR and TDEE calculator to pinpoint your exact daily grams of protein,
              carbohydrates, and healthy fats based on your current weight and goal.
            </p>
          </div>
          <Link
            to="/calculator"
            className="px-6 py-3.5 bg-[#FFFF00] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#E6E600] transition-colors whitespace-nowrap shrink-0"
          >
            Launch Macro Calculator &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};
