import React, { useState, useEffect } from 'react';
import { CLASS_SCHEDULE } from '../data/fitnessData';
import { ClassSession } from '../types';
import { Calendar, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';

export const ClassScheduleSection: React.FC = () => {
  const days: ClassSession['day'][] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const [activeDay, setActiveDay] = useState<ClassSession['day']>('Monday');
  const [reservedClassIds, setReservedClassIds] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('fitflex_token');
    if (!token) return;

    fetch('/api/reservations', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.reservations) {
          setReservedClassIds(data.reservations.map((r: { classId: string }) => r.classId));
        }
      })
      .catch((err) => console.error('Failed to load reservations:', err));
  }, []);

  const classesForDay = CLASS_SCHEDULE.filter((c) => c.day === activeDay);

  const handleToggleReserve = async (cls: ClassSession) => {
    const token = localStorage.getItem('fitflex_token');
    const isReserved = reservedClassIds.includes(cls.id);

    if (isReserved) {
      setReservedClassIds(reservedClassIds.filter((id) => id !== cls.id));
      setNotification(`Reservation canceled for ${cls.title}`);
    } else {
      setReservedClassIds([...reservedClassIds, cls.id]);
      setNotification(`Spot successfully reserved for ${cls.title} on ${cls.day} at ${cls.time}! Added to your Member Portal.`);

      // Post to backend
      try {
        await fetch('/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            classId: cls.id,
            classTitle: cls.title,
            day: cls.day,
            time: cls.time,
            trainer: cls.trainer,
          }),
        });
      } catch (err) {
        console.error('Reservation API error:', err);
      }
    }

    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  return (
    <section id="schedule" className="py-24 bg-neutral-950 text-white border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Mark icon */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/assets/img/mark.png"
            alt="FitFlex Mark"
            className="w-7 h-7 object-contain"
          />
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Weekly Class Schedule
          </h2>
        </div>

        <p className="text-neutral-400 text-sm sm:text-base max-w-3xl mb-10 leading-relaxed">
          Book your spot in advance. High-intensity group workouts, barbell clubs, and restorative mobility
          sessions run 7 days a week with certified instructors.
        </p>

        {/* Toast Alert */}
        {notification && (
          <div className="mb-6 p-4 bg-neutral-900 border-l-4 border-[#FFFF00] text-white flex items-center justify-between text-xs sm:text-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#FFFF00] shrink-0" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-neutral-400 hover:text-white uppercase font-bold text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Days selector */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-neutral-800 pb-3">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeDay === day
                  ? 'bg-[#FFFF00] text-black shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Classes Table / Cards */}
        {classesForDay.length === 0 ? (
          <div className="p-12 text-center bg-neutral-900 border border-neutral-800 text-neutral-400">
            No group sessions scheduled for this day. Open gym access is available 24/7.
          </div>
        ) : (
          <div className="space-y-4">
            {classesForDay.map((cls) => {
              const isReserved = reservedClassIds.includes(cls.id);
              const spotsTaken = isReserved ? cls.enrolled + 1 : cls.enrolled;
              const spotsLeft = Math.max(0, cls.capacity - spotsTaken);

              return (
                <div
                  key={cls.id}
                  className={`p-6 border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    isReserved
                      ? 'bg-neutral-900/90 border-[#FFFF00]'
                      : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xl sm:text-2xl font-black text-[#FFFF00] tabular-nums tracking-wide">
                        {cls.time}
                      </span>
                      <span className="text-xs text-neutral-400 flex items-center gap-1 bg-black px-2.5 py-0.5 border border-neutral-800">
                        <Clock className="w-3.5 h-3.5 text-[#FFFF00]" />
                        <span>{cls.duration}</span>
                      </span>
                      <span className="text-xs text-neutral-400 flex items-center gap-1 bg-black px-2.5 py-0.5 border border-neutral-800">
                        <MapPin className="w-3.5 h-3.5 text-[#FFFF00]" />
                        <span>{cls.location}</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                      {cls.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <User className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Led by: <span className="text-white font-medium">{cls.trainer}</span></span>
                    </div>
                  </div>

                  {/* Booking / Capacity Status */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:border-l md:border-neutral-800 md:pl-8">
                    <div className="w-40">
                      <div className="flex justify-between text-xs text-neutral-400 mb-1">
                        <span>Capacity</span>
                        <span className="text-white font-bold tabular-nums">
                          {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Class Full'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full bg-[#FFFF00] transition-all duration-300"
                          style={{ width: `${Math.min(100, (spotsTaken / cls.capacity) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleReserve(cls)}
                      disabled={spotsLeft === 0 && !isReserved}
                      className={`w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        isReserved
                          ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                          : spotsLeft === 0
                          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          : 'bg-[#FFFF00] text-black hover:bg-white'
                      }`}
                    >
                      {isReserved ? 'Spot Reserved (Cancel)' : spotsLeft === 0 ? 'Full' : 'Reserve Spot'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
