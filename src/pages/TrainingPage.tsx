import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PersonalTrainingSection } from '../components/PersonalTrainingSection';
import { BookingModal } from '../components/BookingModal';
import { Trainer } from '../types';
import { UserCheck, Shield, Clock, Video, Dumbbell, ArrowRight } from 'lucide-react';

export const TrainingPage: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<string | undefined>(undefined);

  const handleBookTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer.name);
    setIsBookingOpen(true);
  };

  return (
    <div className="pt-20 bg-black min-h-screen text-white">
      {/* Page Hero Banner */}
      <div className="relative py-16 bg-neutral-950 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFFF00] mb-3">
            <UserCheck className="w-4 h-4" />
            <span>Master Coach Department</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Personal Training & Coaching
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Personalized instruction designed to make you stronger from the inside out. Choose between
            in-gym 1-on-1 private lifting sessions and live remote virtual coaching.
          </p>

          {/* FitFlex Mark Coach Availability Banner */}
          <div className="mt-8 p-4 sm:p-5 bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 p-1.5 bg-neutral-950 border border-[#FFFF00]/40 flex items-center justify-center shrink-0">
                <img src="/assets/img/mark.png" alt="FitFlex Mark" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FFFF00] block">
                  The FitFlex Mark • Master Roster
                </span>
                <p className="text-xs text-white font-bold">
                  View Live Coach Availability, Shift Slots & Book 1-on-1 Sessions
                </p>
              </div>
            </div>
            <Link
              to="/coaches"
              className="px-4 py-2 bg-[#FFFF00] hover:bg-yellow-400 text-black text-xs font-extrabold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Coach Availability Deck</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Personal Training Section with Video & Coaches */}
      <PersonalTrainingSection onBookTrainer={handleBookTrainer} />

      {/* Coaching Protocol Methodology */}
      <section className="py-20 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FFFF00] block mb-2">
              The FitFlex Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white">
              How Our 1-on-1 Coaching Delivers Results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-neutral-900 border border-neutral-800 space-y-3">
              <span className="text-2xl font-black text-[#FFFF00] font-mono">01</span>
              <h3 className="text-lg font-bold uppercase text-white">Biomechanical Assessment</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Full orthopedic and kinetic chain screen identifying hip asymmetries, ankle dorsiflexion, and core stability.
              </p>
            </div>
            <div className="p-6 bg-neutral-900 border border-neutral-800 space-y-3">
              <span className="text-2xl font-black text-[#FFFF00] font-mono">02</span>
              <h3 className="text-lg font-bold uppercase text-white">Bespoke Periodization</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Weekly progressive overload charts targeting your strength, hypertrophy, or speed goals with zero wasted volume.
              </p>
            </div>
            <div className="p-6 bg-neutral-900 border border-neutral-800 space-y-3">
              <span className="text-2xl font-black text-[#FFFF00] font-mono">03</span>
              <h3 className="text-lg font-bold uppercase text-white">Real-Time Form Correction</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Rep-by-rep cues on breathing, bar speed, and joint positioning ensuring maximum recruitment with zero injury risk.
              </p>
            </div>
            <div className="p-6 bg-neutral-900 border border-neutral-800 space-y-3">
              <span className="text-2xl font-black text-[#FFFF00] font-mono">04</span>
              <h3 className="text-lg font-bold uppercase text-white">Lifestyle & Macro Sync</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Sleep tracking, protein intake audits, and stress management so your recovery matches your hard gym effort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedTrainer={selectedTrainer}
      />
    </div>
  );
};
