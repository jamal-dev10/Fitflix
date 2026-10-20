import React, { useState } from 'react';
import { FAQS } from '../data/fitnessData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredFaqs = filterCategory === 'all'
    ? FAQS
    : FAQS.filter((f) => f.category === filterCategory);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-neutral-950 text-white border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Mark icon */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/assets/img/mark.png"
            alt="FitFlex Mark"
            className="w-7 h-7 object-contain"
          />
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <p className="text-neutral-400 text-sm sm:text-base max-w-3xl mb-10 leading-relaxed">
          Everything you need to know about joining FitFlex, accessing the facility, group workouts,
          and nutrition coaching.
        </p>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-neutral-800 pb-3">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'membership', label: 'Membership & 24/7' },
            { id: 'training', label: 'Classes & Training' },
            { id: 'facility', label: 'Facility & Amenities' },
            { id: 'nutrition', label: 'Nutrition Plans' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-[#FFFF00] text-black shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="max-w-4xl space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-neutral-900 border border-neutral-800 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-800/50 transition-colors"
                >
                  <span className="text-base sm:text-lg font-bold uppercase tracking-wide text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#FFFF00] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/80 pt-4 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
