import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Dedicated Pages
import { HomePage } from './pages/HomePage';
import { ProgramsPage } from './pages/ProgramsPage';
import { TrainingPage } from './pages/TrainingPage';
import { NutritionPage } from './pages/NutritionPage';
import { SchedulePage } from './pages/SchedulePage';
import { PricingPage } from './pages/PricingPage';
import { FacilityPage } from './pages/FacilityPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoachAvailabilityPage } from './pages/CoachAvailabilityPage';

// Modals & Tools
import { BookingModal } from './components/BookingModal';
import { DigitalPassModal } from './components/DigitalPassModal';
import { WorkoutCompanion } from './components/WorkoutCompanion';

import { Timer, QrCode } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingProgram, setBookingProgram] = useState<string | undefined>(undefined);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);

  const handleOpenBooking = (programTitle?: string) => {
    setBookingProgram(programTitle);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FFFF00] selection:text-black flex flex-col justify-between">
      {/* Top Fixed Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenTimer={() => setIsTimerOpen(true)}
        onOpenPass={() => setIsPassOpen(true)}
      />

      {/* Main Multi-Page Route Switcher */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage onOpenBooking={() => handleOpenBooking()} />} />
          <Route path="/programs" element={<ProgramsPage onOpenBooking={handleOpenBooking} />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/coaches" element={<CoachAvailabilityPage />} />
          <Route path="/mark" element={<CoachAvailabilityPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/facility" element={<FacilityPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage onOpenTimer={() => setIsTimerOpen(true)} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating Quick Gym Tools Toolbar */}
      <aside aria-label="Gym tools" className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5">
        <button
          onClick={() => setIsTimerOpen(true)}
          className="w-12 h-12 bg-neutral-900/90 hover:bg-[#FFFF00] hover:text-black border border-neutral-700 hover:border-[#FFFF00] text-white flex items-center justify-center shadow-xl transition-all duration-200 cursor-pointer backdrop-blur-sm group"
          title="Open Interval Workout Timer"
          aria-label="Open interval workout timer"
        >
          <Timer className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => setIsPassOpen(true)}
          className="w-12 h-12 bg-neutral-900/90 hover:bg-[#FFFF00] hover:text-black border border-neutral-700 hover:border-[#FFFF00] text-white flex items-center justify-center shadow-xl transition-all duration-200 cursor-pointer backdrop-blur-sm group"
          title="View Digital Member Pass"
          aria-label="View digital member pass"
        >
          <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </aside>

      {/* Reusable Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedProgram={bookingProgram}
      />

      <DigitalPassModal
        isOpen={isPassOpen}
        onClose={() => setIsPassOpen(false)}
        memberName="Alex Walker"
        planName="Black Card Elite 24/7"
      />

      <WorkoutCompanion
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
