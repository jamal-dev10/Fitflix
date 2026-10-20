import React from 'react';
import { ArrowDown, Flame, CheckCircle2, Trophy, Clock } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onBookClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onBookClick }) => {
  return (
    <section id="home" className="relative min-h-[92vh] flex flex-col justify-between pt-24 pb-8 overflow-hidden bg-black">
      {/* Background Video / Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover opacity-35"
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/img/img1.jpg"
        >
          <source src="/assets/video/livecoaching.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,0,0.06),transparent_50%)]" />
      </div>

      {/* Hero Core Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto py-12 flex flex-col items-center text-center">
        {/* Subtle kicker */}
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-widest text-[#FFFF00]">
          <Flame className="w-4 h-4" />
          <span>Premier Gym & Performance Center</span>
          <span className="text-neutral-500">·</span>
          <span className="text-neutral-400">Since 2020</span>
        </div>

        {/* Main Display Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white uppercase max-w-4xl text-balance leading-none mb-6">
          Unleash Your <span className="text-[#FFFF00]">Potential</span> · Elevate Your Strength
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-neutral-300 font-normal leading-relaxed mb-9">
          Our programs are tailored to meet your specific goals. With expert guidance from certified coaches,
          cutting-edge strength rigs, and personalized macro nutrition guides.
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onBookClick}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#FFFF00] text-black font-bold text-sm uppercase tracking-wider hover:bg-[#E6E600] active:scale-95 transition-all duration-200 cursor-pointer shadow-lg shadow-yellow-500/10"
          >
            Claim 1-Day Free Pass
          </button>
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-3.5 border border-neutral-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-black hover:border-white active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Explore Programs
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 hidden md:flex flex-col items-center">
          <button
            onClick={onExploreClick}
            className="text-neutral-400 hover:text-[#FFFF00] transition-colors flex flex-col items-center gap-1 cursor-pointer"
          >
            <span className="text-xs uppercase tracking-widest font-semibold">Explore FitFlex</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-[#FFFF00]" />
          </button>
        </div>
      </div>

      {/* KPI Proof Strip Below Hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-neutral-900/80 border border-neutral-800 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Trophy className="w-7 h-7 text-[#FFFF00] shrink-0" />
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">15+</div>
              <div className="text-xs text-neutral-400 uppercase tracking-wide">Certified Coaches</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-7 h-7 text-[#FFFF00] shrink-0" />
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">40+</div>
              <div className="text-xs text-neutral-400 uppercase tracking-wide">Weekly Classes</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-[#FFFF00] shrink-0" />
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">98%</div>
              <div className="text-xs text-neutral-400 uppercase tracking-wide">Goal Success Rate</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Flame className="w-7 h-7 text-[#FFFF00] shrink-0" />
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">100%</div>
              <div className="text-xs text-neutral-400 uppercase tracking-wide">Tailored Nutrition</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
