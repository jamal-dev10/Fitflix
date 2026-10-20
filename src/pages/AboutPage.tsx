import React from 'react';
import { AboutSection } from '../components/AboutSection';
import { Trophy, Shield, Users, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-20 bg-black min-h-screen text-white">
      {/* Page Hero Banner */}
      <div className="relative py-16 bg-neutral-950 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFFF00] mb-3">
            <Globe className="w-4 h-4" />
            <span>FitFlex Story & Heritage</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
            About FitFlex
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Founded with a commitment to pure athletic discipline and science-backed progressive overload.
            Learn about our facility standards, coaching creed, and community values.
          </p>
        </div>
      </div>

      {/* Main About Section */}
      <AboutSection />

      {/* Leadership & Standards Statement */}
      <section className="py-20 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-900 border border-neutral-800 p-8 sm:p-12">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFFF00]">
                Headquarters Message
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-white">
                Built For Those Who Reject Average
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Commercial gym culture often focuses on superficial amenities while letting the iron and coaching
                standards decay. At FitFlex, every single barbell, squat cage, kettlebell, and turf strip was chosen
                to maximize athletic transfer and longevity.
              </p>
              <p className="text-sm text-neutral-300 leading-relaxed">
                We believe that physical mastery breeds mental resilience. When you step through our biometric
                turnstiles, you enter an environment completely focused on honest work, progressive adaptation,
                and mutual encouragement.
              </p>
              <div className="pt-4">
                <Link
                  to="/pricing"
                  className="inline-block px-6 py-3 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-extrabold text-xs uppercase tracking-wider transition-colors"
                >
                  Join The FitFlex Family
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
