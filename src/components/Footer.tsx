import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-neutral-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-neutral-900">
          {/* Logo & Contact Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/assets/img/FitFlex.png"
                alt="FitFlex"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <div className="pt-2">
              <span className="text-xs uppercase font-bold tracking-widest text-neutral-500 block mb-1">
                Official Email Address
              </span>
              <a
                href="mailto:Fitflex@contact.com"
                className="text-lg font-medium text-white hover:text-[#FFFF00] transition-colors"
              >
                Fitflex@contact.com
              </a>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Empowering athletes and fitness enthusiasts to achieve sustainable physical transformation through
              world-class facilities, personalized coaching, and elite sports nutrition.
            </p>
          </div>

          {/* Quick Nav (4 cols) */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFFF00] mb-4">
                Explore
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-400">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/programs" className="hover:text-white transition-colors">
                    Programs
                  </Link>
                </li>
                <li>
                  <Link to="/training" className="hover:text-white transition-colors">
                    Personal Training
                  </Link>
                </li>
                <li>
                  <Link to="/nutrition" className="hover:text-white transition-colors">
                    Nutrition Guides
                  </Link>
                </li>
                <li>
                  <Link to="/schedule" className="hover:text-white transition-colors">
                    Class Schedule
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFFF00] mb-4">
                Company & Portal
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-400">
                <li>
                  <Link to="/pricing" className="hover:text-white transition-colors">
                    Memberships & Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/facility" className="hover:text-white transition-colors">
                    Facility Tour
                  </Link>
                </li>
                <li>
                  <Link to="/calculator" className="hover:text-white transition-colors">
                    Macro Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About FitFlex
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#FFFF00] font-semibold transition-colors">
                    Member Sign In
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFFF00] mb-2">
              Join Our Community
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Follow our daily workout tips, nutrition recipes, and client transformation highlights.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.facebook.com/fitflexcommunity/"
                className="w-10 h-10 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-black hover:bg-[#FFFF00] hover:border-[#FFFF00] flex items-center justify-center transition-all duration-200"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.instagram.com/fitflex_gym/"
                className="w-10 h-10 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-black hover:bg-[#FFFF00] hover:border-[#FFFF00] flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {currentYear} FITFLEX GYM & FITNESS. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-neutral-400">About Facility</Link>
            <Link to="/contact" className="hover:text-neutral-400">Contact Support</Link>
            <Link to="/pricing" className="hover:text-neutral-400">Terms & Membership</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
