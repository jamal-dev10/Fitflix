import React from 'react';
import { Hero } from '../components/Hero';
import { ServicesSection } from '../components/ServicesSection';
import { TransformationsSection } from '../components/TransformationsSection';
import { FacilityTourSection } from '../components/FacilityTourSection';
import { FaqSection } from '../components/FaqSection';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Trophy, Flame, Shield, Check } from 'lucide-react';
import { PROGRAMS, MEMBERSHIP_PLANS } from '../data/fitnessData';

interface HomePageProps {
  onOpenBooking: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenBooking }) => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <Hero
        onExploreClick={() => {
          const el = document.getElementById('services');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onBookClick={onOpenBooking}
      />

      {/* Services Matrix (Programs, Personal Training, Nutrition) */}
      <ServicesSection
        onNavigate={(sectionId) => {
          if (sectionId === 'programs') navigate('/programs');
          else if (sectionId === 'personalt') navigate('/training');
          else if (sectionId === 'nutrition') navigate('/nutrition');
        }}
      />

      {/* Featured Programs Teaser */}
      <section className="py-20 bg-neutral-950 text-white border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFFF00] mb-2">
                <Flame className="w-4 h-4" />
                <span>Engineered For Results</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                Featured Training Disciplines
              </h2>
            </div>
            <Link
              to="/programs"
              className="text-xs font-bold uppercase tracking-wider text-[#FFFF00] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Explore All Programs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROGRAMS.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between hover:border-neutral-700 transition-all duration-300 group"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden mb-4 bg-black">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 px-2 py-0.5 text-[10px] font-bold uppercase text-[#FFFF00]">
                      {p.intensity}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold uppercase text-white mb-2 group-hover:text-[#FFFF00] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    {p.description}
                  </p>
                </div>
                <Link
                  to="/programs"
                  className="w-full py-2.5 bg-neutral-800 hover:bg-[#FFFF00] text-white hover:text-black font-bold text-xs uppercase tracking-wider transition-colors text-center block"
                >
                  View Details & Routine
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Highlights Tour */}
      <FacilityTourSection />

      {/* Verified Transformations */}
      <TransformationsSection />

      {/* Membership Tiers Preview */}
      <section className="py-20 bg-black text-white border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFFF00] mb-2 block">
                Simple Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                Choose Your Membership Tier
              </h2>
            </div>
            <Link
              to="/pricing"
              className="text-xs font-bold uppercase tracking-wider text-[#FFFF00] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>View Full Membership Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MEMBERSHIP_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`p-6 border flex flex-col justify-between ${
                  plan.isPopular ? 'bg-neutral-900 border-[#FFFF00]' : 'bg-neutral-950 border-neutral-800'
                }`}
              >
                <div>
                  <h3 className="text-xl font-bold uppercase text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-neutral-400 mb-4">{plan.tagline}</p>
                  <div className="text-3xl font-black text-[#FFFF00] mb-4">${plan.priceMonthly} <span className="text-xs text-neutral-400 font-normal">/ mo</span></div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="text-xs text-neutral-300 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#FFFF00] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to="/pricing"
                  className={`w-full py-2.5 text-center text-xs font-bold uppercase transition-colors ${
                    plan.isPopular ? 'bg-[#FFFF00] text-black hover:bg-white' : 'bg-neutral-800 text-white hover:bg-neutral-700'
                  }`}
                >
                  Select Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* CTA Banner */}
      <section className="py-20 bg-neutral-950 border-t border-neutral-900 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white">
            Ready To Redefine Your Strength?
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Claim your complimentary 1-day full access pass or meet one of our certified strength coaches for a personalized fitness consultation.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenBooking}
              className="px-8 py-3.5 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Claim Free Day Pass
            </button>
            <Link
              to="/schedule"
              className="px-8 py-3.5 border border-neutral-700 hover:border-white text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Browse Classes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
