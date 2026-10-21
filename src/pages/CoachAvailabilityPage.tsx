import React, { useState, useMemo } from 'react';
import {
  Shield,
  Star,
  Calendar,
  Clock,
  CheckCircle2,
  Award,
  Zap,
  Filter,
  Search,
  User,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  X,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { COACH_AVAILABILITIES } from '../data/fitnessData';
import { CoachAvailability } from '../types';
import { useAuth } from '../context/AuthContext';

export const CoachAvailabilityPage: React.FC = () => {
  const { user, token } = useAuth();

  // Filters state
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState<boolean>(false);

  // Booking Modal State
  const [selectedCoach, setSelectedCoach] = useState<CoachAvailability | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedBookingDate, setSelectedBookingDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingName, setBookingName] = useState<string>(user?.name || '');
  const [bookingEmail, setBookingEmail] = useState<string>(user?.email || '');
  const [bookingPhone, setBookingPhone] = useState<string>(user?.phone || '');
  const [bookingGoals, setBookingGoals] = useState<string>('Strength & Biomechanics');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const daysOfWeek = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const specialties = [
    'All',
    'Strength & Biomechanics',
    'Yoga Master & Mobility Specialist',
    'Metabolic Conditioning & Combat Agility',
    'Olympic Weightlifting & Explosive Speed',
    'Post-Rehab & Biomechanical Restoration',
    'Female Hypertrophy & Pre/Post-Natal Fitness',
  ];

  // Today's day name (e.g. "Monday")
  const todayDayName = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  }, []);

  // Filter coaches
  const filteredCoaches = useMemo(() => {
    return COACH_AVAILABILITIES.filter((coach) => {
      // Day filter
      if (selectedDay !== 'All' && !coach.availableDays.includes(selectedDay)) {
        return false;
      }

      // Today filter
      if (onlyAvailableToday && !coach.availableDays.includes(todayDayName)) {
        return false;
      }

      // Specialty filter
      if (selectedSpecialty !== 'All' && coach.role !== selectedSpecialty) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = coach.trainerName.toLowerCase().includes(q);
        const matchesRole = coach.role.toLowerCase().includes(q);
        const matchesCerts = coach.certifications.some((c) => c.toLowerCase().includes(q));
        const matchesBio = coach.bio.toLowerCase().includes(q);
        if (!matchesName && !matchesRole && !matchesCerts && !matchesBio) {
          return false;
        }
      }

      return true;
    });
  }, [selectedDay, onlyAvailableToday, todayDayName, selectedSpecialty, searchQuery]);

  // Open booking modal
  const handleOpenBooking = (coach: CoachAvailability, slot?: string) => {
    setSelectedCoach(coach);
    setSelectedSlot(slot || coach.timeSlots[0] || '10:00 AM');
    setBookingName(user?.name || '');
    setBookingEmail(user?.email || '');
    setBookingPhone(user?.phone || '');
    setBookingSuccess(false);
    setConfirmationCode(null);
  };

  // Submit booking
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoach || !bookingName || !bookingEmail) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: bookingName,
          email: bookingEmail,
          phone: bookingPhone,
          trainerName: selectedCoach.trainerName,
          programInterest: `${selectedCoach.role} (${selectedCoach.trainerName})`,
          date: selectedBookingDate,
          timeSlot: selectedSlot,
          notes: bookingNotes || `Booked via FitFlex Mark Portal. Focus: ${bookingGoals}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConfirmationCode(data.referenceCode || `FF-${Math.floor(100000 + Math.random() * 900000)}`);
        setBookingSuccess(true);
      }
    } catch (err) {
      console.error('Failed to book coach:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-black text-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* ========================================================= */}
        {/* HERO SECTION: THE FITFLEX MARK OF EXCELLENCE */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden bg-neutral-950 border border-neutral-800 p-8 sm:p-12 lg:p-16">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#FFFF00]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Brand Mark Story */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 p-1.5 bg-neutral-900 border border-[#FFFF00]/40 flex items-center justify-center">
                  <img
                    src="/assets/img/mark.png"
                    alt="The FitFlex Mark Emblem"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#FFFF00] uppercase">
                  <Shield className="w-4 h-4" />
                  <span>The FitFlex Mark • Accredited Coaching Roster</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white leading-none">
                Personal Training <br />
                <span className="text-[#FFFF00]">The Coach Available</span>
              </h1>

              <p className="text-neutral-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                The <strong>FitFlex Mark</strong> is our uncompromising seal of master certification.
                Every coach listed below is actively in the facility, verified for elite biomechanical assessment,
                and bookable for private 1-on-1 performance sessions. Check live schedules, choose your time slot,
                and accelerate your physique goals.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-800/80">
                <div>
                  <div className="text-2xl font-black font-mono text-[#FFFF00]">100%</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    CSCS & DPT Certified
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-white">4.97 ★</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Average Member Rating
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-white">6,800+</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Coached Sessions
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-[#FFFF00]">
                    {COACH_AVAILABILITIES.filter((c) => c.availableDays.includes(todayDayName)).length} Coaches
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    On Duty Today ({todayDayName})
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Mark Emblem Highlight */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 sm:p-8 bg-neutral-900/80 border border-neutral-800 relative group">
              <div className="relative mb-4">
                <img
                  src="/assets/img/mark.png"
                  alt="FitFlex Mark"
                  className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-[0_0_25px_rgba(255,255,0,0.35)] transition-transform group-hover:scale-105 duration-300"
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-[#FFFF00] text-black font-black text-[10px] uppercase tracking-wider">
                  Verified Seal
                </span>
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-sm font-extrabold uppercase text-white tracking-widest">
                  FitFlex Mark Guarantee
                </h3>
                <p className="text-xs text-neutral-400">
                  Zero apprentice trainers. Only vetted, senior specialists on the gym floor.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* FILTER & SEARCH CONTROL CONSOLE */}
        {/* ========================================================= */}
        <div className="bg-neutral-950 border border-neutral-800 p-6 space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search coach, certification, specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-[#FFFF00] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Toggle: Available Today */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOnlyAvailableToday(!onlyAvailableToday)}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border transition-colors flex items-center gap-2 cursor-pointer ${
                  onlyAvailableToday
                    ? 'bg-[#FFFF00] text-black border-[#FFFF00]'
                    : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Available Today ({todayDayName})</span>
              </button>

              <span className="text-xs text-neutral-500 font-mono hidden sm:inline">
                {filteredCoaches.length} {filteredCoaches.length === 1 ? 'Coach' : 'Coaches'} Found
              </span>
            </div>
          </div>

          {/* Days Filter Pills */}
          <div className="space-y-2 pt-2 border-t border-neutral-900">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">
              Filter By Day Availability:
            </span>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => {
                const isSelected = selectedDay === day;
                const isToday = day === todayDayName;
                return (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                      if (day !== 'All') setOnlyAvailableToday(false);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#FFFF00] text-black border-[#FFFF00]'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {day}
                    {isToday && day !== 'All' && (
                      <span className="ml-1.5 text-[9px] opacity-75 font-mono">(Today)</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specialty Dropdown */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">
              Filter By Specialty Discipline:
            </span>
            <div className="flex flex-wrap gap-2">
              {specialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                    selectedSpecialty === spec
                      ? 'bg-white text-black border-white'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {spec === 'All' ? 'All Disciplines' : spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COACH AVAILABILITY GRID */}
        {/* ========================================================= */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold uppercase text-white tracking-tight">
                Accredited Personal Trainers On Deck
              </h2>
              <p className="text-xs text-neutral-400">
                Select an hourly slot below to lock in your 1-on-1 private coaching session.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase text-emerald-400">
                Live Deck Status
              </span>
            </div>
          </div>

          {filteredCoaches.length === 0 ? (
            <div className="py-16 text-center bg-neutral-950 border border-neutral-800 p-8 space-y-4">
              <User className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="text-lg font-bold uppercase text-white">
                No Coaches Match Your Active Filters
              </h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Try selecting &ldquo;All Days&rdquo; or clearing your search query to see the complete coaching roster.
              </p>
              <button
                onClick={() => {
                  setSelectedDay('All');
                  setSelectedSpecialty('All');
                  setSearchQuery('');
                  setOnlyAvailableToday(false);
                }}
                className="px-4 py-2 bg-[#FFFF00] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredCoaches.map((coach) => {
                const isAvailableToday = coach.availableDays.includes(todayDayName);

                return (
                  <div
                    key={coach.id}
                    className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all p-6 sm:p-8 flex flex-col justify-between space-y-6 relative group"
                  >
                    {/* Top Row: Avatar + Info */}
                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* Coach Avatar + FitFlex Mark Seal */}
                      <div className="relative shrink-0 w-28 h-36 sm:w-32 sm:h-40 bg-neutral-900 border border-neutral-800 overflow-hidden">
                        <img
                          src={coach.avatar}
                          alt={coach.trainerName}
                          className="w-full h-full object-cover object-top filter grayscale contrast-110 group-hover:grayscale-0 transition-all duration-300"
                        />
                        {/* Overlay Mark Badge */}
                        <div className="absolute top-1.5 left-1.5 p-1 bg-black/80 backdrop-blur-sm border border-[#FFFF00]/40 flex items-center gap-1">
                          <img
                            src="/assets/img/mark.png"
                            alt="Mark"
                            className="w-3.5 h-3.5 object-contain"
                          />
                          <span className="text-[8px] font-mono font-bold text-[#FFFF00]">
                            MARK
                          </span>
                        </div>

                        {/* Status chip */}
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 text-center">
                          <span
                            className={`block text-[9px] font-extrabold uppercase py-0.5 px-1 border backdrop-blur-md ${
                              isAvailableToday
                                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                                : 'bg-neutral-900/90 text-neutral-300 border-neutral-700'
                            }`}
                          >
                            {isAvailableToday ? 'On Deck Today' : 'Scheduled Shift'}
                          </span>
                        </div>
                      </div>

                      {/* Coach Credentials */}
                      <div className="space-y-2 flex-grow">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FFFF00] block">
                              FitFlex Mark Accredited
                            </span>
                            <h3 className="text-xl sm:text-2xl font-extrabold uppercase text-white tracking-tight">
                              {coach.trainerName}
                            </h3>
                            <p className="text-xs text-neutral-300 font-semibold">
                              {coach.role}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="flex items-center gap-1 text-xs font-mono font-bold text-white">
                              <Star className="w-3.5 h-3.5 fill-[#FFFF00] text-[#FFFF00]" />
                              <span>{coach.rating}</span>
                            </div>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              ({coach.reviewsCount} reviews)
                            </span>
                          </div>
                        </div>

                        {/* Certifications Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {coach.certifications.map((cert) => (
                            <span
                              key={cert}
                              className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>

                        {/* Bio */}
                        <p className="text-xs text-neutral-400 line-clamp-3 pt-1">
                          {coach.bio}
                        </p>
                      </div>
                    </div>

                    {/* Zone & Rate Bar */}
                    <div className="grid grid-cols-2 gap-3 bg-neutral-900/80 p-3 border border-neutral-800/80 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 block">
                          Floor Station
                        </span>
                        <span className="font-semibold text-neutral-200 truncate block">
                          {coach.location}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 block">
                          Session Rate
                        </span>
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-base font-extrabold text-[#FFFF00] font-mono">
                            ${coach.pricePerSession}
                          </span>
                          <span className="text-[10px] text-neutral-400">/ 60min</span>
                        </div>
                      </div>
                    </div>

                    {/* Available Days and Time Slots */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Available Days:
                        </span>
                        <span className="text-neutral-300 font-mono text-[11px]">
                          {coach.availableDays.join(' • ')}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFFF00] block">
                          Available Time Slots (Click to Select & Book):
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                          {coach.timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => handleOpenBooking(coach, slot)}
                              className="py-1.5 px-1 bg-neutral-900 hover:bg-[#FFFF00] hover:text-black border border-neutral-800 hover:border-[#FFFF00] text-[11px] font-mono font-bold text-center text-neutral-200 transition-colors cursor-pointer"
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-4">
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#FFFF00]" />
                        <span>Included for Black Card Elite</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenBooking(coach)}
                        className="px-4 py-2.5 bg-[#FFFF00] hover:bg-yellow-400 text-black text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Book Session</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* THE 4 PILLARS OF FITFLEX MARK ACCREDITATION */}
        {/* ========================================================= */}
        <div className="bg-neutral-950 border border-neutral-800 p-8 sm:p-12 space-y-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#FFFF00] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Rigorous Accreditation Standards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight">
              Why Train With A FitFlex Mark Coach?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Ordinary gyms hire anyone with a weekend certificate. At FitFlex, every coach is evaluated
              under 4 strict criteria before receiving the FitFlex Mark accreditation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-3">
              <div className="w-10 h-10 bg-neutral-950 border border-[#FFFF00]/40 flex items-center justify-center text-[#FFFF00] font-mono font-bold">
                01
              </div>
              <h4 className="text-sm font-extrabold uppercase text-white">
                Biomechanical Screening
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Pre-movement kinematic analysis for ankle dorsiflexion, hip internal rotation, and thoracic extension
                before ever loading heavy bars.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-3">
              <div className="w-10 h-10 bg-neutral-950 border border-[#FFFF00]/40 flex items-center justify-center text-[#FFFF00] font-mono font-bold">
                02
              </div>
              <h4 className="text-sm font-extrabold uppercase text-white">
                Velocity & Autoregulation
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Programming tailored to daily central nervous system readiness, bar speed measurement, and RPE effort
                scaling to eliminate overtraining.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-3">
              <div className="w-10 h-10 bg-neutral-950 border border-[#FFFF00]/40 flex items-center justify-center text-[#FFFF00] font-mono font-bold">
                03
              </div>
              <h4 className="text-sm font-extrabold uppercase text-white">
                Metabolic Nutrition Sync
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Certified Precision Nutrition guidance synchronized with your resistance volume for rapid glycogen
                replenishment and lean muscle protein synthesis.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-3">
              <div className="w-10 h-10 bg-neutral-950 border border-[#FFFF00]/40 flex items-center justify-center text-[#FFFF00] font-mono font-bold">
                04
              </div>
              <h4 className="text-sm font-extrabold uppercase text-white">
                Digital Accountability
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Direct integration with your member dashboard, visual workout calendar, and biometric weight logs
                for visible week-over-week progress.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOOKING MODAL */}
        {/* ========================================================= */}
        {selectedCoach && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="bg-neutral-900 border border-neutral-700 w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setSelectedCoach(null)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {bookingSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                      Session Reserved
                    </span>
                    <h3 className="text-2xl font-extrabold uppercase text-white">
                      Appointment Confirmed
                    </h3>
                  </div>
                  <div className="p-4 bg-neutral-950 border border-neutral-800 text-xs space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Coach:</span>
                      <strong className="text-white">{selectedCoach.trainerName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Date & Slot:</span>
                      <strong className="text-[#FFFF00]">{selectedBookingDate} at {selectedSlot}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Confirmation Code:</span>
                      <strong className="font-mono text-white font-bold">{confirmationCode}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Location:</span>
                      <span className="text-neutral-300">{selectedCoach.location}</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400">
                    This appointment has been saved to your dashboard. Please arrive 10 minutes prior to warm up.
                  </p>
                  <button
                    onClick={() => setSelectedCoach(null)}
                    className="w-full py-3 bg-[#FFFF00] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors cursor-pointer"
                  >
                    Done & Return to Roster
                  </button>
                </div>
              ) : (
                <>
                  <div className="border-b border-neutral-800 pb-3 flex items-center gap-3">
                    <div className="w-8 h-8 p-1 bg-neutral-950 border border-[#FFFF00]/40 flex items-center justify-center">
                      <img src="/assets/img/mark.png" alt="Mark" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFFF00]">
                        FitFlex Mark 1-on-1 Booking
                      </span>
                      <h3 className="text-xl font-extrabold uppercase text-white">
                        Book Coach {selectedCoach.trainerName}
                      </h3>
                    </div>
                  </div>

                  <form onSubmit={handleConfirmBooking} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                          Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={selectedBookingDate}
                          onChange={(e) => setSelectedBookingDate(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                          Time Slot *
                        </label>
                        <select
                          value={selectedSlot}
                          onChange={(e) => setSelectedSlot(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-xs focus:border-[#FFFF00] focus:outline-none"
                        >
                          {selectedCoach.timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          placeholder="e.g. Alex Walker"
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-xs focus:border-[#FFFF00] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={bookingEmail}
                          onChange={(e) => setBookingEmail(e.target.value)}
                          placeholder="alex@fitflex.com"
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-xs focus:border-[#FFFF00] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-xs font-mono focus:border-[#FFFF00] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                          Primary Training Focus
                        </label>
                        <select
                          value={bookingGoals}
                          onChange={(e) => setBookingGoals(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-xs focus:border-[#FFFF00] focus:outline-none"
                        >
                          <option value="Strength & Biomechanics">Strength & Biomechanics</option>
                          <option value="Hypertrophy & Body Recomp">Hypertrophy & Body Recomp</option>
                          <option value="Olympic Weightlifting Technique">Olympic Weightlifting Technique</option>
                          <option value="Mobility & Joint Rehab">Mobility & Joint Rehab</option>
                          <option value="Combat & VO2 Max Sprints">Combat & VO2 Max Sprints</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                        Specific Questions or Injuries
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Past shoulder impingement, looking to fix bench press arch"
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-xs focus:border-[#FFFF00] focus:outline-none"
                      />
                    </div>

                    <div className="p-3 bg-neutral-950 border border-neutral-800 text-xs flex items-center justify-between">
                      <span className="text-neutral-400">Total Investment:</span>
                      <div className="text-right">
                        <span className="font-extrabold text-[#FFFF00] font-mono text-sm">
                          ${selectedCoach.pricePerSession}
                        </span>
                        <span className="text-[10px] text-neutral-500 block">
                          Included for Black Card members
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                      <button
                        type="button"
                        onClick={() => setSelectedCoach(null)}
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold uppercase text-neutral-300 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2 bg-[#FFFF00] hover:bg-yellow-400 text-black text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        {isSubmitting ? 'Reserving...' : 'Confirm Session Booking'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
