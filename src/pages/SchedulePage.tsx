import React from 'react';
import { ClassScheduleSection } from '../components/ClassScheduleSection';
import { Calendar, Clock, MapPin, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SchedulePage: React.FC = () => {
  return (
    <div className="pt-20 bg-black min-h-screen text-white">
      {/* Page Hero Banner */}
      <div className="relative py-16 bg-neutral-950 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFFF00] mb-3">
            <Calendar className="w-4 h-4" />
            <span>Live Facility Schedule</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Class Schedule & Booking
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Reserve your spot up to 7 days in advance. High-intensity group workouts, barbell clubs,
            and restorative mobility sessions with certified head instructors.
          </p>
        </div>
      </div>

      {/* Main Class Schedule Section */}
      <ClassScheduleSection />

      {/* Class Etiquette & Preparation */}
      <section className="py-20 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold uppercase text-white mb-8">
            Class Guidelines & What To Bring
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-neutral-900 border border-neutral-800 space-y-2">
              <Clock className="w-5 h-5 text-[#FFFF00]" />
              <h4 className="text-base font-bold uppercase text-white">Arrive 10 Minutes Early</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Check in at the turnstile using your digital member pass or reception barcode scanner to confirm your spot.
              </p>
            </div>
            <div className="p-6 bg-neutral-900 border border-neutral-800 space-y-2">
              <Users className="w-5 h-5 text-[#FFFF00]" />
              <h4 className="text-base font-bold uppercase text-white">Towels & Hydration Provided</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Fresh workout towels and chilled filtered water stations are complimentary for all group class attendees.
              </p>
            </div>
            <div className="p-6 bg-neutral-900 border border-neutral-800 space-y-2">
              <Award className="w-5 h-5 text-[#FFFF00]" />
              <h4 className="text-base font-bold uppercase text-white">Modifications On Request</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Tell your instructor prior to class if you are managing past injuries or joint restrictions for regressions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
