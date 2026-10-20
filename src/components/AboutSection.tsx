import React from 'react';
import { Shield, Target, Users, Zap } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Science-Backed Protocols',
      description: 'Every program is built upon exercise physiology and progressive overload to eliminate plateauing.'
    },
    {
      icon: Shield,
      title: 'Elite Certified Staff',
      description: 'CSCS, NASM, and Olympic lifting accredited coaches dedicated to your biomechanics and form safety.'
    },
    {
      icon: Users,
      title: 'Uncompromising Community',
      description: 'Train alongside motivated individuals in an atmosphere completely free of ego and distractions.'
    },
    {
      icon: Zap,
      title: 'Holistic Transformation',
      description: 'We address strength, mobility, recovery, and precision macronutrient fueling simultaneously.'
    }
  ];

  return (
    <section id="aboutus" className="py-24 bg-black text-white border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Mark icon */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/assets/img/mark.png"
            alt="FitFlex Mark"
            className="w-7 h-7 object-contain"
          />
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            About Us
          </h2>
        </div>

        {/* Lead statement from original FitFlex */}
        <p className="text-neutral-300 text-lg sm:text-2xl font-medium max-w-4xl leading-relaxed mb-16">
          We are dedicated to helping individuals achieve their fitness goals through expert advice,
          effective workouts, and personalized nutrition plans. Our team of certified trainers and
          nutritionists are committed to providing you with the tools and support you need to transform
          your health and wellness.
        </p>

        {/* 2-Column Split with Graphic Assets from Original */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FFFF00] block">
              The FitFlex Philosophy
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white leading-tight">
              No Excuses. Just Unrelenting Progress.
            </h3>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Founded with a singular mission: to strip away the fluff and gimmicks of commercial fitness.
              At FitFlex, we equip you with competition-grade Olympic barbells, Eleiko plates, calibrated dumbbell
              clusters, high-speed treadmills, and dedicated functional turf lanes.
            </p>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Whether your objective is shattering personal squat records, shedding 15kg of stubborn fat, or
              restoring shoulder mobility after years of desk posture, our coaches engineer the exact pathway
              to get you there.
            </p>

            <div className="pt-4 flex items-center gap-6">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/img/morocco.svg"
                  alt="FitFlex Origin"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xs uppercase tracking-wider text-neutral-300 font-bold">
                  Flagship Facility & Global Standards
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFFF00]/10 rounded-full blur-3xl pointer-events-none" />
              <img
                src="/assets/img/Noexcuses-01.png"
                alt="No Excuses"
                className="w-full h-auto object-contain mx-auto mb-6 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="text-center border-t border-neutral-800 pt-6">
                <span className="text-xs uppercase font-bold tracking-widest text-neutral-400 block mb-1">
                  Our Motto
                </span>
                <span className="text-xl font-bold uppercase tracking-wider text-[#FFFF00]">
                  Consistency Outperforms Motivation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="bg-neutral-900/60 border border-neutral-800 p-6 hover:border-[#FFFF00] transition-colors"
              >
                <div className="w-10 h-10 bg-neutral-800 text-[#FFFF00] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold uppercase tracking-wide text-white mb-2">
                  {val.title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {val.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
