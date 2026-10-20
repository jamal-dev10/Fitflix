import React, { useState } from 'react';
import { MEMBERSHIP_PLANS } from '../data/fitnessData';
import { MembershipPlan } from '../types';
import { Check, Star, ShieldCheck, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (plan: MembershipPlan, isAnnual: boolean) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-black text-white border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Mark icon */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/assets/img/mark.png"
            alt="FitFlex Mark"
            className="w-7 h-7 object-contain"
          />
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Membership Plans
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Transparent pricing with zero hidden maintenance fees. Pick your tier and cancel or pause anytime.
          </p>

          {/* Monthly vs Annual Toggle */}
          <div className="flex items-center gap-3 bg-neutral-900 p-1.5 border border-neutral-800 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                !isAnnual ? 'bg-[#FFFF00] text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                isAnnual ? 'bg-[#FFFF00] text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded font-mono">SAVE 25%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {MEMBERSHIP_PLANS.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between p-8 border transition-all duration-300 ${
                  plan.isPopular
                    ? 'bg-neutral-900/90 border-[#FFFF00] shadow-2xl lg:-translate-y-2'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Popular Tag */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FFFF00] text-black font-extrabold text-[11px] uppercase tracking-widest px-4 py-1 flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div>
                  <div className="border-b border-neutral-800 pb-6 mb-6">
                    <h3 className="text-2xl font-black uppercase tracking-wider text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-neutral-400 min-h-[32px] leading-relaxed">
                      {plan.tagline}
                    </p>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-[#FFFF00] tabular-nums tracking-tight">
                        ${price}
                      </span>
                      <span className="text-sm text-neutral-400 uppercase font-medium">
                        / month {isAnnual ? '(billed annually)' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                      What&apos;s Included:
                    </span>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                        <Check className="w-4 h-4 text-[#FFFF00] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Perks */}
                  <div className="space-y-1.5 mb-8 pt-4 border-t border-neutral-800/80">
                    {plan.perks.map((perk, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onSelectPlan(plan, isAnnual)}
                  className={`w-full py-3.5 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    plan.isPopular
                      ? 'bg-[#FFFF00] text-black hover:bg-white shadow-lg'
                      : 'bg-neutral-800 hover:bg-[#FFFF00] text-white hover:text-black'
                  }`}
                >
                  <span>Select {plan.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
