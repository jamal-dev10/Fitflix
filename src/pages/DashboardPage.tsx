import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { QrCode, Calendar, Clock, User, Shield, CheckCircle2, Trash2, Dumbbell, Timer, ArrowRight, LogOut, Flame, Target } from 'lucide-react';
import { ProgressTracker } from '../components/ProgressTracker';
import { FitnessGoalsSection } from '../components/FitnessGoalsSection';

interface Reservation {
  id: string;
  classId: string;
  classTitle: string;
  day: string;
  time: string;
  trainer: string;
}

interface Consultation {
  id: string;
  name: string;
  trainerName?: string;
  programInterest: string;
  date: string;
  timeSlot: string;
  referenceCode: string;
}

export const DashboardPage: React.FC<{ onOpenTimer: () => void }> = ({ onOpenTimer }) => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !token) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const [resRes, conRes] = await Promise.all([
          fetch('/api/reservations', {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch('/api/consultations', {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        if (resRes.ok) {
          const resData = await resRes.json();
          setReservations(resData.reservations || []);
        }
        if (conRes.ok) {
          const conData = await conRes.json();
          setConsultations(conData.consultations || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, token, navigate]);

  const handleCancelReservation = async (resId: string) => {
    try {
      const res = await fetch(`/api/reservations/${resId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setReservations(reservations.filter((r) => r.id !== resId));
        setCancelFeedback('Class reservation canceled successfully.');
        setTimeout(() => setCancelFeedback(null), 3500);
      }
    } catch (err) {
      console.error('Failed to cancel reservation:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-black text-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-800 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFFF00] mb-1">
              <Shield className="w-4 h-4" />
              <span>FitFlex Member Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              Welcome Back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Member ID: <span className="font-mono text-white font-bold">{user.memberId}</span> · {user.membershipPlan}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenTimer}
              className="px-4 py-2.5 bg-neutral-900 border border-neutral-700 hover:border-[#FFFF00] text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Timer className="w-4 h-4 text-[#FFFF00]" />
              <span>Launch Gym Timer</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {cancelFeedback && (
          <div className="p-4 bg-neutral-900 border-l-4 border-[#FFFF00] text-white flex items-center gap-3 text-xs sm:text-sm animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#FFFF00]" />
            <span>{cancelFeedback}</span>
          </div>
        )}

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Pass Card */}
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border-2 border-[#FFFF00] p-6 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Facility Credential
              </span>
              <span className="bg-[#FFFF00] text-black text-[10px] font-extrabold uppercase px-2 py-0.5">
                {user.membershipExpiry}
              </span>
            </div>
            <h3 className="text-xl font-extrabold uppercase text-white mb-1">
              {user.membershipPlan}
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              24/7 Biometric Turnstile Access & Keyless Entry
            </p>
            <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
              <span className="font-mono text-xs text-neutral-300">{user.memberId}</span>
              <Link
                to="/pricing"
                className="text-xs text-[#FFFF00] font-bold uppercase hover:underline"
              >
                Upgrade Tier &rarr;
              </Link>
            </div>
          </div>

          {/* Fitness Goal */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
                Active Protocol
              </span>
              <h3 className="text-xl font-extrabold uppercase text-white mb-2">
                {user.fitnessGoal || 'Strength & Conditioning'}
              </h3>
              <p className="text-xs text-neutral-400">
                Daily Macro Caloric Target: <strong className="text-[#FFFF00] font-mono">{user.targetCalories || 2600} kcal</strong>
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-800/80">
              <Link
                to="/calculator"
                className="text-xs text-[#FFFF00] font-bold uppercase hover:underline flex items-center gap-1"
              >
                <span>Recalculate Biometrics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Schedule Booking */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
                Group Fitness
              </span>
              <h3 className="text-xl font-extrabold uppercase text-white mb-2">
                {reservations.length} Classes Reserved
              </h3>
              <p className="text-xs text-neutral-400">
                40+ high-tempo weekly workouts, barbell clubs, and yoga recovery sessions.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-800/80">
              <Link
                to="/schedule"
                className="text-xs text-[#FFFF00] font-bold uppercase hover:underline flex items-center gap-1"
              >
                <span>Browse This Week&apos;s Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Specific Fitness Goals with Attainment Progress Bars */}
        <FitnessGoalsSection token={token} />

        {/* Visual Biometric Progress Tracker (Recharts) */}
        <ProgressTracker token={token} targetWeight={80} />

        {/* 2-Column Split: Active Reservations vs Consultations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Class Bookings (7 cols) */}
          <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold uppercase text-white">
                  My Reserved Classes
                </h3>
                <span className="text-xs text-neutral-400">
                  Present your digital badge at class check-in
                </span>
              </div>
              <Link
                to="/schedule"
                className="text-xs font-bold uppercase text-[#FFFF00] hover:text-white transition-colors"
              >
                + Book Another Class
              </Link>
            </div>

            {loading ? (
              <div className="text-xs text-neutral-500 py-6">Loading reservations...</div>
            ) : reservations.length === 0 ? (
              <div className="p-8 text-center bg-neutral-900/50 border border-neutral-800/60 space-y-3">
                <Calendar className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-xs text-neutral-400">
                  You haven&apos;t reserved any group workout spots yet.
                </p>
                <Link
                  to="/schedule"
                  className="inline-block px-4 py-2 bg-[#FFFF00] text-black font-bold text-xs uppercase"
                >
                  View Schedule & Book
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#FFFF00] uppercase font-mono">
                          {res.day} · {res.time}
                        </span>
                      </div>
                      <h4 className="text-base font-bold uppercase text-white">
                        {res.classTitle}
                      </h4>
                      <span className="text-xs text-neutral-400">
                        Instructor: {res.trainer}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCancelReservation(res.id)}
                      className="px-3 py-1.5 border border-red-800 text-red-400 hover:bg-red-950 text-xs uppercase font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booked Consultations & Quick Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8">
              <div className="border-b border-neutral-800 pb-4 mb-6">
                <h3 className="text-xl font-bold uppercase text-white">
                  1-on-1 Consultations
                </h3>
                <span className="text-xs text-neutral-400">
                  Private coach assessments & diet check-ins
                </span>
              </div>

              {consultations.length === 0 ? (
                <div className="p-6 text-center bg-neutral-900/50 border border-neutral-800/60 space-y-2">
                  <User className="w-7 h-7 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400">
                    No private training sessions currently booked.
                  </p>
                  <Link
                    to="/training"
                    className="inline-block mt-2 text-xs font-bold uppercase text-[#FFFF00] hover:underline"
                  >
                    Book A Personal Trainer &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {consultations.map((con) => (
                    <div
                      key={con.id}
                      className="p-4 bg-neutral-900 border border-neutral-800 space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white uppercase text-sm">
                          {con.programInterest}
                        </h4>
                        <span className="font-mono text-[#FFFF00] font-bold">
                          {con.referenceCode}
                        </span>
                      </div>
                      <div className="text-neutral-400">
                        Date: <strong className="text-white">{con.date} at {con.timeSlot}</strong>
                      </div>
                      {con.trainerName && (
                        <div className="text-neutral-400">
                          Trainer: <strong className="text-white">{con.trainerName}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links Hub */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFFF00]">
                Gym Shortcuts
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase">
                <Link
                  to="/programs"
                  className="p-3 bg-neutral-950 border border-neutral-800 hover:border-[#FFFF00] text-neutral-300 hover:text-white transition-colors block text-center"
                >
                  Programs Catalog
                </Link>
                <Link
                  to="/nutrition"
                  className="p-3 bg-neutral-950 border border-neutral-800 hover:border-[#FFFF00] text-neutral-300 hover:text-white transition-colors block text-center"
                >
                  Macro Kitchen
                </Link>
                <Link
                  to="/facility"
                  className="p-3 bg-neutral-950 border border-neutral-800 hover:border-[#FFFF00] text-neutral-300 hover:text-white transition-colors block text-center"
                >
                  Facility Tour
                </Link>
                <Link
                  to="/contact"
                  className="p-3 bg-neutral-950 border border-neutral-800 hover:border-[#FFFF00] text-neutral-300 hover:text-white transition-colors block text-center"
                >
                  Support & Desk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
