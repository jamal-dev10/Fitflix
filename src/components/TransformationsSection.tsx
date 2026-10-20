import React from 'react';
import { TRANSFORMATIONS } from '../data/fitnessData';
import { Quote, Trophy, TrendingUp } from 'lucide-react';

export const TransformationsSection: React.FC = () => {
  return (
    <section id="transformations" className="py-24 bg-neutral-950 text-white border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Mark icon */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/assets/img/mark.png"
            alt="FitFlex Mark"
            className="w-7 h-7 object-contain"
          />
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Client Proof & Transformations
          </h2>
        </div>

        <p className="text-neutral-400 text-sm sm:text-base max-w-3xl mb-12 leading-relaxed">
          No airbrushed models or fabricated vanity stats. Real members who executed the FitFlex progressive
          overload system and macro nutrition guides.
        </p>

        {/* 3 Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRANSFORMATIONS.map((story) => (
            <div
              key={story.id}
              className="bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between hover:border-neutral-700 transition-all duration-300 group"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden mb-5 bg-black">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FFFF00] border border-neutral-800 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-[#FFFF00]" />
                    <span>{story.timeframe} Protocol</span>
                  </div>
                </div>

                <div className="p-3 bg-neutral-950 border border-neutral-800 mb-4">
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">
                    Verified Metric Outcome
                  </span>
                  <span className="text-base font-extrabold text-[#FFFF00] flex items-center gap-1.5 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-[#FFFF00]" />
                    <span>{story.achievement}</span>
                  </span>
                </div>

                <div className="relative mb-4">
                  <Quote className="w-6 h-6 text-neutral-700 mb-1" />
                  <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white uppercase">{story.name}</h4>
                  <span className="text-neutral-500">{story.program}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 block">Coach</span>
                  <span className="text-neutral-300 font-medium">{story.trainer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
