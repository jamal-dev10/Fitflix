import React, { useState } from 'react';
import { PricingSection } from '../components/PricingSection';
import { MembershipCheckoutModal } from '../components/MembershipCheckoutModal';
import { DigitalPassModal } from '../components/DigitalPassModal';
import { MembershipPlan } from '../types';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Check, Sparkles } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { user, updateUserMembership } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [activeMemberName, setActiveMemberName] = useState(user?.name || 'Jordan Hayes');
  const [activePlanName, setActivePlanName] = useState('Black Card Elite 24/7');

  const handleSelectPlan = (plan: MembershipPlan, annual: boolean) => {
    setSelectedPlan(plan);
    setIsAnnual(annual);
  };

  const handleCheckoutSuccess = async (name: string, planName: string) => {
    setActiveMemberName(name);
    setActivePlanName(planName);
    await updateUserMembership(planName, isAnnual);
    setSelectedPlan(null);
    setIsPassOpen(true);
  };

  return (
    <div className="pt-20 bg-black min-h-screen text-white">
      {/* Page Hero Banner */}
      <div className="relative py-16 bg-neutral-950 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFFF00] mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Honest Fitness Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Membership Plans & Access
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Zero surprise enrollment charges. Pick between flexible monthly commitments and annual plans
            with 25% savings. Includes 24/7 keyless facility entry.
          </p>
        </div>
      </div>

      {/* Main Pricing Section */}
      <PricingSection onSelectPlan={handleSelectPlan} />

      {/* Feature Comparison Matrix */}
      <section className="py-20 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold uppercase text-white mb-8 text-center">
            Detailed Tier Feature Comparison
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-bold uppercase text-[11px]">
                  <th className="py-4 px-4">Amenity / Feature</th>
                  <th className="py-4 px-4">Day / Starter</th>
                  <th className="py-4 px-4 text-[#FFFF00]">Black Card Elite</th>
                  <th className="py-4 px-4">Pro Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">24/7 Keyless Biometric Access</td>
                  <td className="py-3.5 px-4 text-neutral-500">Staffed Hours Only</td>
                  <td className="py-3.5 px-4 text-[#FFFF00] font-bold">Included (24/7/365)</td>
                  <td className="py-3.5 px-4 text-white font-bold">Included (24/7/365)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Unlimited Group Fitness & HIIT Classes</td>
                  <td className="py-3.5 px-4 text-neutral-500">—</td>
                  <td className="py-3.5 px-4 text-[#FFFF00] font-bold">Included</td>
                  <td className="py-3.5 px-4 text-white font-bold">Included</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Sauna & Cold Plunge Contrast Suite</td>
                  <td className="py-3.5 px-4 text-neutral-500">—</td>
                  <td className="py-3.5 px-4 text-[#FFFF00] font-bold">Included</td>
                  <td className="py-3.5 px-4 text-white font-bold">Included</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Monthly Guest Pass Privileges</td>
                  <td className="py-3.5 px-4 text-neutral-500">—</td>
                  <td className="py-3.5 px-4 text-white">1 Pass / Month</td>
                  <td className="py-3.5 px-4 text-white font-bold">Unlimited Guest Access</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">1-on-1 Personal Training Included</td>
                  <td className="py-3.5 px-4 text-neutral-500">—</td>
                  <td className="py-3.5 px-4 text-neutral-500">—</td>
                  <td className="py-3.5 px-4 text-white font-bold">2 Sessions / Month</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Tailored Macronutrient Meal Plan</td>
                  <td className="py-3.5 px-4 text-neutral-500">—</td>
                  <td className="py-3.5 px-4 text-neutral-500">—</td>
                  <td className="py-3.5 px-4 text-white font-bold">Full Custom Blueprint</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      <MembershipCheckoutModal
        plan={selectedPlan}
        isAnnual={isAnnual}
        onClose={() => setSelectedPlan(null)}
        onSuccess={handleCheckoutSuccess}
      />

      {/* Digital Pass Modal */}
      <DigitalPassModal
        isOpen={isPassOpen}
        onClose={() => setIsPassOpen(false)}
        memberName={activeMemberName}
        planName={activePlanName}
      />
    </div>
  );
};
