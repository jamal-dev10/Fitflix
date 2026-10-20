import React, { useState } from 'react';
import { MembershipPlan } from '../types';
import { X, CheckCircle2, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';

interface MembershipCheckoutModalProps {
  plan: MembershipPlan | null;
  isAnnual: boolean;
  onClose: () => void;
  onSuccess: (memberName: string, planName: string) => void;
}

export const MembershipCheckoutModal: React.FC<MembershipCheckoutModalProps> = ({
  plan,
  isAnnual,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '•••• •••• •••• 4242',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!plan) return null;

  const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please provide your full legal name and email.');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(formData.name, plan.name);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 text-white shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs uppercase font-bold tracking-widest text-[#FFFF00] block mb-1">
            Membership Enrollment
          </span>
          <h3 className="text-2xl font-extrabold uppercase tracking-tight text-white">
            {plan.name}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {plan.tagline}
          </p>
        </div>

        {/* Order Summary */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-2 text-xs mb-6">
          <div className="flex justify-between">
            <span className="text-neutral-400">Membership Tier:</span>
            <span className="text-white font-bold uppercase">{plan.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Billing Term:</span>
            <span className="text-white font-medium">{isAnnual ? 'Annual Contract (Save 25%)' : 'Monthly Flexible'}</span>
          </div>
          <div className="flex justify-between border-t border-neutral-800 pt-2 text-sm">
            <span className="font-bold text-white">Total Due Today:</span>
            <span className="font-black text-[#FFFF00] text-base tabular-nums">${price} USD</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-700 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Michael Thorne"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="michael@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Mobile Phone
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Payment Method (Encrypted Demo)
            </label>
            <div className="flex items-center gap-2 p-2.5 bg-neutral-900 border border-neutral-700 text-xs text-neutral-300">
              <CreditCard className="w-4 h-4 text-[#FFFF00]" />
              <span className="font-mono">Demo Checkout Mode · No Real Card Charged</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-[#FFFF00] hover:bg-[#E6E600] active:scale-[0.99] text-black font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              {isProcessing ? (
                <span>Activating Membership...</span>
              ) : (
                <>
                  <span>Activate Membership & Issue Digital Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-neutral-500 text-center leading-normal">
            By activating, you agree to the FitFlex member etiquette code. You can cancel or pause anytime.
          </p>
        </form>
      </div>
    </div>
  );
};
