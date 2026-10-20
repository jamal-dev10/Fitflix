import React from 'react';
import { Program } from '../types';
import { X, Clock, Award, Calendar, Check, Dumbbell } from 'lucide-react';

interface ProgramModalProps {
  program: Program | null;
  onClose: () => void;
  onBookProgram: (programName: string) => void;
}

export const ProgramModal: React.FC<ProgramModalProps> = ({ program, onClose, onBookProgram }) => {
  if (!program) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-950 border border-neutral-800 text-white shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 p-2 flex items-center justify-center shrink-0">
            <img src={program.icon} alt="" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#FFFF00]">
              {program.category} Program Routine
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              {program.title}
            </h3>
          </div>
        </div>

        {/* Quick Specs */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-neutral-900 border border-neutral-800 mb-6 text-center text-xs">
          <div>
            <span className="text-neutral-500 block uppercase">Duration</span>
            <span className="font-bold text-white flex items-center justify-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-[#FFFF00]" />
              {program.duration}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block uppercase">Intensity</span>
            <span className="font-bold text-white flex items-center justify-center gap-1 mt-0.5">
              <Award className="w-3.5 h-3.5 text-[#FFFF00]" />
              {program.intensity}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block uppercase">Schedule</span>
            <span className="font-bold text-white flex items-center justify-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-[#FFFF00]" />
              {program.schedule}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-300 leading-relaxed mb-6">
          {program.longDescription}
        </p>

        {/* Workout Routine Exercises */}
        <div className="mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFF00] mb-3 flex items-center gap-2">
            <Dumbbell className="w-4 h-4" />
            <span>Core Session Exercises & Progression</span>
          </h4>

          <div className="space-y-2.5">
            {program.exercises.map((ex, i) => (
              <div
                key={i}
                className="p-3.5 bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#FFFF00] text-black font-bold text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-bold text-sm text-white">{ex.name}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 pl-7">{ex.notes}</p>
                </div>

                <div className="pl-7 sm:pl-0 flex items-center gap-4 text-xs font-medium text-neutral-300 shrink-0">
                  <span className="bg-neutral-950 px-2.5 py-1 border border-neutral-800">
                    Sets: <strong className="text-white">{ex.sets}</strong>
                  </span>
                  <span className="bg-neutral-950 px-2.5 py-1 border border-neutral-800">
                    Reps: <strong className="text-[#FFFF00]">{ex.reps}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onBookProgram(program.title);
            }}
            className="w-full py-3.5 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
          >
            Book Free Trial For This Program
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3.5 border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};
