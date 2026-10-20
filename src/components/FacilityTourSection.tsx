import React, { useState } from 'react';
import { FACILITY_ZONES } from '../data/fitnessData';
import { Check, Shield } from 'lucide-react';

export const FacilityTourSection: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string>(FACILITY_ZONES[0].id);
  const current = FACILITY_ZONES.find((z) => z.id === selectedZone) || FACILITY_ZONES[0];

  return (
    <section id="facility" className="py-24 bg-black text-white border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Mark icon */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/assets/img/mark.png"
            alt="FitFlex Mark"
            className="w-7 h-7 object-contain"
          />
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Facility & Equipment Tour
          </h2>
        </div>

        <p className="text-neutral-400 text-sm sm:text-base max-w-3xl mb-12 leading-relaxed">
          Over 25,000 square feet of state-of-the-art training space. Calibrated competition equipment,
          dedicated Olympic platforms, and high-recovery contrast therapy suites.
        </p>

        {/* Zone Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {FACILITY_ZONES.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone.id)}
              className={`p-4 text-left border transition-all duration-200 cursor-pointer ${
                selectedZone === zone.id
                  ? 'bg-neutral-900 border-[#FFFF00] text-white shadow-lg'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                Zone 0{FACILITY_ZONES.indexOf(zone) + 1}
              </span>
              <span className="text-base font-bold uppercase tracking-wide text-white block mt-0.5">
                {zone.name}
              </span>
              <span className="text-xs text-[#FFFF00] block mt-1">
                {zone.tagline}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Zone Deep Dive */}
        <div className="bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 relative min-h-[360px] sm:min-h-[420px] overflow-hidden bg-black">
              <img
                src={current.image}
                alt={current.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 lg:from-transparent via-transparent to-transparent" />
            </div>

            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFFF00] mb-2 block">
                {current.tagline}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mb-4">
                {current.name}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                {current.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#FFFF00]" />
                  <span>Equipped With:</span>
                </h4>
                <div className="space-y-2">
                  {current.equipment.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-300">
                      <Check className="w-4 h-4 text-[#FFFF00] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
