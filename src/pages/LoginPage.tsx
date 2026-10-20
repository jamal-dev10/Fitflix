import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Phone, Target, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [goal, setGoal] = useState('Strength & Muscle Hypertrophy');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  if (user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-12 px-4 bg-black text-white">
        <div className="max-w-md w-full p-8 bg-neutral-900 border border-neutral-800 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-[#FFFF00] mx-auto" />
          <h2 className="text-2xl font-bold uppercase text-white">Already Signed In</h2>
          <p className="text-sm text-neutral-300">
            You are logged in as <strong className="text-white">{user.name}</strong> ({user.email}).
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 bg-[#FFFF00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#E6E600] cursor-pointer"
            >
              Go To Member Dashboard
            </button>
            <Link
              to="/"
              className="w-full py-2.5 border border-neutral-700 text-neutral-400 hover:text-white text-xs uppercase font-bold cursor-pointer"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (isRegisterMode) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Please complete all required fields.');
        setIsSubmitting(false);
        return;
      }
      const res = await register(name, email, password, phone, goal);
      setIsSubmitting(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setError('Please enter your email and password.');
        setIsSubmitting(false);
        return;
      }
      const res = await login(email, password);
      setIsSubmitting(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setError(null);
    setIsSubmitting(true);
    const res = await login(demoEmail, demoPass);
    setIsSubmitting(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-black text-white flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full bg-neutral-950 border border-neutral-800 p-8 shadow-2xl relative">
        {/* FitFlex Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <img
              src="/assets/img/FitFlex.png"
              alt="FitFlex"
              className="h-10 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
            {isRegisterMode ? 'Create Member Account' : 'Member Sign In'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {isRegisterMode
              ? 'Join FitFlex to reserve classes, schedule PT, and access nutrition plans.'
              : 'Sign in to access your digital pass, scheduled workouts, and training logs.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-900 border border-neutral-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setError(null);
            }}
            className={`py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              !isRegisterMode ? 'bg-[#FFFF00] text-black shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setError(null);
            }}
            className={`py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              isRegisterMode ? 'bg-[#FFFF00] text-black shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-5 bg-red-950/80 border border-red-700 text-red-200 text-xs">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Walker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 pl-10 pr-4 py-2.5 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 pl-10 pr-4 py-2.5 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 pl-10 pr-4 py-2.5 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none"
              />
            </div>
          </div>

          {isRegisterMode && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 pl-10 pr-4 py-2.5 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Primary Fitness Goal
                </label>
                <div className="relative">
                  <Target className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 pl-10 pr-4 py-2.5 text-white text-xs sm:text-sm focus:border-[#FFFF00] focus:outline-none"
                  >
                    <option value="Strength & Muscle Hypertrophy">Strength & Muscle Hypertrophy</option>
                    <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                    <option value="Athletic VO2 Max & Endurance">Athletic VO2 Max & Endurance</option>
                    <option value="Joint Mobility & Posture Rehab">Joint Mobility & Posture Rehab</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{isRegisterMode ? 'Complete Registration' : 'Log Into Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* 1-Click Demo Accounts */}
        <div className="mt-8 pt-6 border-t border-neutral-900">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-3 text-center">
            Instant 1-Click Demo Sign In:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('demo@fitflex.com', 'fitflex123')}
              className="p-2.5 bg-neutral-900 border border-neutral-800 hover:border-[#FFFF00] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFFF00]" />
                <span>Alex (Member)</span>
              </div>
              <span className="text-[10px] text-neutral-400 block mt-0.5">Black Card 24/7 Pass</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('marcus@fitflex.com', 'coach123')}
              className="p-2.5 bg-neutral-900 border border-neutral-800 hover:border-[#FFFF00] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFFF00]" />
                <span>Marcus (Coach)</span>
              </div>
              <span className="text-[10px] text-neutral-400 block mt-0.5">Head of Strength</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
