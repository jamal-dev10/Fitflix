import React, { useState } from 'react';
import { ProgramsSection } from '../components/ProgramsSection';
import { ProgramModal } from '../components/ProgramModal';
import { Program } from '../types';
import { Link } from 'react-router-dom';
import { Dumbbell, Shield, ArrowRight, Zap, Target } from 'lucide-react';

interface ProgramsPageProps {
  onOpenBooking: (programTitle?: string) => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ onOpenBooking }) => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  return (
    <div className="pt-20 bg-black min-h-screen text-white">
      {/* Page Hero Banner */}
      <div className="relative py-16 bg-neutral-950 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFFF00] mb-3">
            <Dumbbell className="w-4 h-4" />
            <span>FitFlex Training Systems</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Workout Programs
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Every routine is built upon progressive overload, biomechanical efficiency, and functional power.
            Choose your focus discipline, review the exercise schedule, and start training.
          </p>
        </div>
      </div>

      {/* Main Interactive Programs Section */}
      <ProgramsSection onSelectProgram={(p) => setSelectedProgram(p)} />

      {/* Routine Detail Modal */}
      <ProgramModal
        program={selectedProgram}
        onClose={() => setSelectedProgram(null)}
        onBookProgram={(name) => onOpenBooking(name)}
      />

      {/* Custom Coaching Callout */}
      <section className="py-16 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold uppercase text-white">
              Need A 100% Customized Routine?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              Our certified personal trainers evaluate your injury history, mobility restrictions, and exact goals
              to engineer an exclusive 12-week blueprint tailored specifically to your body.
            </p>
          </div>
          <Link
            to="/training"
            className="px-6 py-3.5 bg-[#FFFF00] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#E6E600] transition-colors whitespace-nowrap shrink-0"
          >
            Schedule Coach Assessment
          </Link>
        </div>
      </section>
    </div>
  );
};
