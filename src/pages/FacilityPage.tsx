import React from 'react';
import { FacilityTourSection } from '../components/FacilityTourSection';
import { MapPin, Shield, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FacilityPage: React.FC = () => {
  return (
    <div className="pt-20 bg-black min-h-screen text-white">
      {/* Page Hero Banner */}
      <div className="relative py-16 bg-neutral-950 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFFF00] mb-3">
            <MapPin className="w-4 h-4" />
            <span>Facility Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Facility & Equipment Tour
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Constructed for athletes who demand the highest standards in biomechanics. Calibrated IPF-spec iron,
            shock-absorbing deadlift drop platforms, and Finnish recovery saunas.
          </p>
        </div>
      </div>

      {/* Main Facility Tour */}
      <FacilityTourSection />

      {/* Facility Specs & Hygiene */}
      <section className="py-20 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-neutral-900 border border-neutral-800 space-y-3">
              <Shield className="w-6 h-6 text-[#FFFF00]" />
              <h3 className="text-lg font-bold uppercase text-white">Hospital-Grade Air Filtration</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Dual HEPA-14 ventilation units continuously cycle 100% fresh atmospheric air, maintaining ideal humidity and oxygenation for heavy training.
              </p>
            </div>
            <div className="p-6 bg-neutral-900 border border-neutral-800 space-y-3">
              <Zap className="w-6 h-6 text-[#FFFF00]" />
              <h3 className="text-lg font-bold uppercase text-white">Acoustic & Vibration Damping</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                60mm high-density vulcanized rubber subflooring absorbs maximum barbell drop kinetic shock without rattling adjacent zones.
              </p>
            </div>
            <div className="p-6 bg-neutral-900 border border-neutral-800 space-y-3">
              <Sparkles className="w-6 h-6 text-[#FFFF00]" />
              <h3 className="text-lg font-bold uppercase text-white">Luxury Locker Suites</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Keypad lockers, rainfall high-pressure showers, Dyson Supersonic hair grooming stations, and Malin+Goetz apothecary washes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
