import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Dumbbell, Timer, QrCode, User, LogOut } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenTimer: () => void;
  onOpenPass: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenTimer, onOpenPass }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const navLinks = [
    { name: 'Programs', path: '/programs' },
    { name: 'Training', path: '/training' },
    { name: 'Nutrition', path: '/nutrition' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Facility', path: '/facility' },
    { name: 'Calculator', path: '/calculator' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-neutral-800 py-3 shadow-xl'
          : 'bg-black/85 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark / Logo */}
          <Link to="/" className="flex items-center gap-2 group whitespace-nowrap shrink-0">
            <img
              src="/assets/img/FitFlex.png"
              alt="FitFlex Logo"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-xs sm:text-sm font-medium text-neutral-300">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative py-1 transition-colors whitespace-nowrap shrink-0 group ${
                  isActive(link.path) ? 'text-[#FFFF00] font-bold' : 'text-neutral-300 hover:text-white'
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-[#FFFF00] transition-all duration-200 ${
                    isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Zone 3: Auth + Quick Tools + CTA Action */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Quick Gym Tools */}
            <button
              onClick={onOpenTimer}
              className="p-2 text-neutral-400 hover:text-[#FFFF00] hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors cursor-pointer"
              title="Interval Workout Timer"
              aria-label="Open workout timer"
            >
              <Timer className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenPass}
              className="p-2 text-neutral-400 hover:text-[#FFFF00] hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors cursor-pointer"
              title="Digital Member Pass"
              aria-label="Open member pass"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Auth Button */}
            {user ? (
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-colors ${
                  isActive('/dashboard')
                    ? 'border-[#FFFF00] text-[#FFFF00] bg-neutral-900'
                    : 'border-neutral-700 text-white hover:border-[#FFFF00]'
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#FFFF00]" />
                <span className="truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Primary Action Button */}
            <button
              onClick={onOpenBooking}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-[#FFFF00] hover:bg-[#E6E600] active:scale-95 transition-all duration-200 flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Free Pass</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={onOpenTimer}
              className="p-1.5 text-neutral-400 hover:text-[#FFFF00]"
              aria-label="Timer"
            >
              <Timer className="w-5 h-5" />
            </button>

            {user ? (
              <Link
                to="/dashboard"
                className="p-1.5 text-[#FFFF00]"
                aria-label="Dashboard"
              >
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-xs uppercase font-bold text-[#FFFF00] px-2 py-1"
              >
                Login
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-400 hover:text-white focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-neutral-950/98 border-b border-neutral-800 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              className={`text-sm font-semibold uppercase py-2 border-b border-neutral-900 ${
                isActive('/') ? 'text-[#FFFF00]' : 'text-neutral-300'
              }`}
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold uppercase py-2 border-b border-neutral-900 ${
                  isActive(link.path) ? 'text-[#FFFF00]' : 'text-neutral-300 hover:text-[#FFFF00]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <Link
                to="/dashboard"
                className="text-sm font-bold uppercase text-[#FFFF00] py-2 border-b border-neutral-900 flex items-center justify-between"
              >
                <span>Member Portal ({user.name})</span>
                <User className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-sm font-bold uppercase text-[#FFFF00] py-2 border-b border-neutral-900"
              >
                Member Sign In / Register
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTimer();
              }}
              className="py-2.5 text-center text-xs font-bold uppercase bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center gap-1.5"
            >
              <Timer className="w-3.5 h-3.5 text-[#FFFF00]" />
              <span>Gym Timer</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPass();
              }}
              className="py-2.5 text-center text-xs font-bold uppercase bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-[#FFFF00]" />
              <span>Digital Pass</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-black bg-[#FFFF00] hover:bg-[#E6E600] transition-colors cursor-pointer"
            >
              Claim 1-Day Free Pass
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
