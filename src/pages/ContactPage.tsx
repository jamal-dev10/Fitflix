import React from 'react';
import { ContactSection } from '../components/ContactSection';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="pt-20 bg-black min-h-screen text-white">
      {/* Page Hero Banner */}
      <div className="relative py-16 bg-neutral-950 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFFF00] mb-3">
            <MessageSquare className="w-4 h-4" />
            <span>Direct Front Desk & Support</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Contact & Location
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Have questions about memberships, private trainer availability, corporate wellness, or class bookings?
            Send us a message or visit our front desk reception.
          </p>
        </div>
      </div>

      {/* Main Contact Section */}
      <ContactSection />
    </div>
  );
};
