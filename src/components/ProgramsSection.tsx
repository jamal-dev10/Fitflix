import React, { useState } from 'react';
import { Program, ProgramCategory } from '../types';
import { PROGRAMS } from '../data/fitnessData';
import { ChevronRight, Clock, Award } from 'lucide-react';

interface ProgramsSectionProps {
  onSelectProgram: (program: Program) => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ onSelectProgram }) => {
  const [activeCategory, setActiveCategory] = useState<ProgramCategory>('all');

  const filteredPrograms = activeCategory === 'all'
    ? PROGRAMS
    : PROGRAMS.filter((p) => p.category === activeCategory);

  const categories: { label: string; value: ProgramCategory }[] = [
    { label: 'All Programs', value: 'all' },
    { label: 'Strength', value: 'strength' },
    { label: 'Yoga & Mobility', value: 'yoga' },
    { label: 'Cardio & HIIT', value: 'cardio' },
    { label: 'Functional', value: 'functional' },
  ];

  return (
    <section id="programs" className="py-24 bg-neutral-950 text-white border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Mark icon */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/assets/img/mark.png"
            alt="FitFlex Mark"
            className="w-7 h-7 object-contain"
          />
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Programs
          </h2>
        </div>

        <p className="text-neutral-400 text-sm sm:text-base max-w-3xl mb-10 leading-relaxed">
          Take your fitness routine to the next level by exploring our ever-expanding library of workout options,
          expertly led by our world-class trainers.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-12 border-b border-neutral-800 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeCategory === cat.value
                  ? 'bg-[#FFFF00] text-black shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="group relative w-full max-w-[370px] h-[480px] bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl flex flex-col justify-between"
            >
              {/* Image with zoom on hover */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 group-hover:via-black/70 transition-all duration-300" />
              </div>

              {/* Top metadata tags */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-neutral-300 bg-black/60 px-2.5 py-1 backdrop-blur-sm border border-neutral-800">
                  <Clock className="w-3.5 h-3.5 text-[#FFFF00]" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300 bg-black/60 px-2.5 py-1 backdrop-blur-sm border border-neutral-800">
                  <Award className="w-3.5 h-3.5 text-[#FFFF00]" />
                  <span>{program.intensity}</span>
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 p-6 flex flex-col justify-end">
                {/* Dumbbell / Yoga / Muscle Icon */}
                <div className="mb-3 w-12 h-12 rounded-full bg-neutral-900/90 border border-neutral-700 flex items-center justify-center p-2.5 shadow-md group-hover:border-[#FFFF00] transition-colors">
                  <img
                    src={program.icon}
                    alt=""
                    className="w-full h-full object-contain filter brightness-110"
                  />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white mb-2 group-hover:text-[#FFFF00] transition-colors">
                  {program.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 line-clamp-3 leading-relaxed mb-4">
                  {program.description}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-neutral-800/80">
                  <span className="text-xs text-neutral-400">
                    Coach: <span className="text-white font-medium">{program.trainer}</span>
                  </span>
                  <button
                    onClick={() => onSelectProgram(program)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FFFF00] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>View Routine</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
