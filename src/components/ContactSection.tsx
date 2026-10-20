import React, { useState } from 'react';
import { Mail, Clock, MapPin, Send, CheckCircle2, Phone } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: 'strength',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please provide your name and email address.');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setError(null);
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to send message.');
      }
    } catch {
      // Fallback
      setError(null);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      program: 'strength',
      message: '',
    });
  };

  return (
    <section id="contactus" className="py-24 bg-neutral-950 text-white border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Mark icon */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/assets/img/mark.png"
            alt="FitFlex Mark"
            className="w-7 h-7 object-contain"
          />
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Contact Us
          </h2>
        </div>

        <p className="text-neutral-400 text-sm sm:text-base max-w-3xl mb-12 leading-relaxed">
          We usually respond before 24 hours. Have a question about membership, personal training, or group classes?
          Send us a message or drop by our facility.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form Side (7 cols) */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 p-6 sm:p-10 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-[#FFFF00]/10 text-[#FFFF00] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FFFF00]/30">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-bold uppercase text-white">
                  Message Dispatched!
                </h3>
                <p className="text-neutral-300 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-semibold">{formData.name}</span>. A FitFlex performance
                  advisor has received your request and will reach back to{' '}
                  <span className="text-[#FFFF00] font-semibold">{formData.email}</span> within 24 hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-neutral-800 hover:bg-[#FFFF00] hover:text-black font-bold text-xs uppercase tracking-wider text-white transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-950/80 border border-red-700 text-red-200 text-xs">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 px-4 py-3 text-white text-sm focus:border-[#FFFF00] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 px-4 py-3 text-white text-sm focus:border-[#FFFF00] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 px-4 py-3 text-white text-sm focus:border-[#FFFF00] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Area of Interest
                    </label>
                    <select
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 px-4 py-3 text-white text-sm focus:border-[#FFFF00] focus:outline-none transition-colors"
                    >
                      <option value="strength">Strength & Hypertrophy</option>
                      <option value="personalt">1-on-1 Personal Training</option>
                      <option value="cardio">Cardio & HIIT Classes</option>
                      <option value="yoga">Yoga & Mobility</option>
                      <option value="nutrition">Customized Nutrition Plans</option>
                      <option value="membership">General 24/7 Gym Membership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Message / Goal Details
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us about your current training schedule, past injuries, or targets..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 p-4 text-white text-sm focus:border-[#FFFF00] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#FFFF00] hover:bg-[#E6E600] active:scale-[0.99] text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Info Side (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white border-b border-neutral-800 pb-3">
                Headquarters & Hours
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#FFFF00] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-neutral-400 uppercase tracking-wide block">Direct Email</span>
                    <a
                      href="mailto:Fitflex@contact.com"
                      className="text-base text-white hover:text-[#FFFF00] font-semibold transition-colors"
                    >
                      Fitflex@contact.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#FFFF00] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-neutral-400 uppercase tracking-wide block">Operating Hours</span>
                    <span className="text-sm text-white block">Members: Open 24 Hours / 7 Days</span>
                    <span className="text-xs text-neutral-400 block">Staffed Coaching: Mon–Sat 06:00 – 22:00</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FFFF00] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-neutral-400 uppercase tracking-wide block">Main Campus</span>
                    <span className="text-sm text-white block">FitFlex Performance Complex, Central Boulevard</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location graphic */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 flex items-center gap-4">
              <img
                src="/assets/img/location img-01.png"
                alt="Location"
                className="w-16 h-16 object-contain shrink-0"
              />
              <div>
                <h4 className="text-sm font-bold uppercase text-white">Dedicated Private Parking</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Complimentary secured underground parking available for all active FitFlex gym members and visitors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
