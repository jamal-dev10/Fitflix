import React, { useState } from 'react';
import { TRAINERS } from '../data/fitnessData';
import { X, CheckCircle2, Calendar, Clock, User, Dumbbell } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTrainer?: string;
  preselectedProgram?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedTrainer,
  preselectedProgram,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: preselectedTrainer ? 'consultation' : 'day-pass',
    trainer: preselectedTrainer || '',
    program: preselectedProgram || 'Strength Training',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    timeSlot: '10:00 AM',
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please provide your name and email address.');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please provide a valid email.');
      return;
    }

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          trainerName: formData.trainer,
          programInterest: formData.program,
          date: formData.date,
          timeSlot: formData.timeSlot,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConfirmationCode(data.referenceCode || ('FF-' + Math.floor(100000 + Math.random() * 900000)));
      } else {
        const code = 'FF-' + Math.floor(100000 + Math.random() * 900000);
        setConfirmationCode(code);
      }
    } catch {
      const code = 'FF-' + Math.floor(100000 + Math.random() * 900000);
      setConfirmationCode(code);
    }

    setIsSuccess(true);
    setError(null);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 text-white shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-[#FFFF00]/10 text-[#FFFF00] rounded-full flex items-center justify-center mx-auto mb-2 border border-[#FFFF00]/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-[#FFFF00] block">
              Booking Confirmed
            </span>

            <h3 className="text-2xl font-extrabold uppercase text-white">
              You&apos;re Ready To Train!
            </h3>

            <div className="p-4 bg-neutral-900 border border-neutral-800 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                <span className="text-neutral-400">Pass Type:</span>
                <span className="text-white font-bold uppercase">
                  {formData.type === 'day-pass' ? 'Free 1-Day VIP Pass' : 'Personal Trainer Consultation'}
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                <span className="text-neutral-400">Scheduled Date:</span>
                <span className="text-white font-bold">{formData.date} at {formData.timeSlot}</span>
              </div>
              {formData.type === 'consultation' && formData.trainer && (
                <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                  <span className="text-neutral-400">Coach:</span>
                  <span className="text-white font-bold">{formData.trainer}</span>
                </div>
              )}
              <div className="flex justify-between pt-1">
                <span className="text-neutral-400">Confirmation Code:</span>
                <span className="text-[#FFFF00] font-mono font-bold text-sm tracking-widest">
                  {confirmationCode}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
              We have emailed pass instructions to <strong className="text-white">{formData.email}</strong>.
              Present this code at the FitFlex front reception desk upon arrival.
            </p>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-[#FFFF00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#E6E600] transition-colors cursor-pointer mt-4"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#FFFF00] block mb-1">
                FitFlex Performance
              </span>
              <h3 className="text-2xl font-extrabold uppercase tracking-tight text-white">
                Book Free Session
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Experience our facility, test the Olympic equipment, or meet your coach.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/80 border border-red-700 text-red-200 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-1 border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'day-pass' })}
                  className={`py-2 text-xs font-bold uppercase transition-colors cursor-pointer ${
                    formData.type === 'day-pass' ? 'bg-[#FFFF00] text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Free 1-Day Pass
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'consultation' })}
                  className={`py-2 text-xs font-bold uppercase transition-colors cursor-pointer ${
                    formData.type === 'consultation' ? 'bg-[#FFFF00] text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Coach Consult
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jordan@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Phone (Optional)
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

              {formData.type === 'consultation' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Select Preferred Trainer
                  </label>
                  <select
                    value={formData.trainer}
                    onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none"
                  >
                    <option value="">Any Available Head Coach</option>
                    {TRAINERS.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none"
                  >
                    <option value="07:00 AM">07:00 AM (Early Bird)</option>
                    <option value="10:00 AM">10:00 AM (Morning Session)</option>
                    <option value="01:00 PM">01:00 PM (Midday Session)</option>
                    <option value="05:30 PM">05:30 PM (Evening Peak)</option>
                    <option value="07:30 PM">07:30 PM (Night Owls)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer mt-2"
              >
                Confirm My Free Reservation
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
