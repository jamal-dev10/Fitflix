import React, { useState, useRef } from 'react';
import { TRAINERS } from '../data/fitnessData';
import { Trainer } from '../types';
import { Play, Pause, Volume2, VolumeX, ShieldCheck, Calendar, UserCheck } from 'lucide-react';

interface PersonalTrainingSectionProps {
  onBookTrainer: (trainer: Trainer) => void;
}

export const PersonalTrainingSection: React.FC<PersonalTrainingSectionProps> = ({ onBookTrainer }) => {
  const [activeTab, setActiveTab] = useState<'one-on-one' | 'live-coaching'>('one-on-one');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section id="personalt" className="py-24 bg-black text-white border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Mark icon */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/assets/img/mark.png"
            alt="FitFlex Mark"
            className="w-7 h-7 object-contain"
          />
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Personal Training
          </h2>
        </div>

        <p className="text-neutral-400 text-sm sm:text-base max-w-3xl mb-12 leading-relaxed">
          You and your dedicated personal trainer will create a plan that&apos;s tailored to your goals—and
          together, you&apos;ll work to unlock the results you want.
        </p>

        {/* Training Modes Interactive Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <button
            onClick={() => setActiveTab('one-on-one')}
            className={`p-6 text-left border transition-all duration-200 cursor-pointer ${
              activeTab === 'one-on-one'
                ? 'bg-neutral-900 border-[#FFFF00] text-white'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold uppercase tracking-wider text-white">
                One On One Training
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 font-bold uppercase ${
                  activeTab === 'one-on-one' ? 'bg-[#FFFF00] text-black' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                In-Gym Private
              </span>
            </div>
            <p className="text-sm text-neutral-300">
              One-on-one personalized workouts with your coach are designed to make you stronger from the inside out with hands-on form correction and real-time intensity adjustments.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('live-coaching')}
            className={`p-6 text-left border transition-all duration-200 cursor-pointer ${
              activeTab === 'live-coaching'
                ? 'bg-neutral-900 border-[#FFFF00] text-white'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold uppercase tracking-wider text-white">
                Live Coaching
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 font-bold uppercase ${
                  activeTab === 'live-coaching' ? 'bg-[#FFFF00] text-black' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                Anywhere / Anytime
              </span>
            </div>
            <p className="text-sm text-neutral-300">
              Receive live virtual coaching from anywhere at any time, with a level of flexibility that fits your busy lifestyle, including weekly video calls and nutrition audits.
            </p>
          </button>
        </div>

        {/* Video Player Display */}
        <div className="relative w-full aspect-video md:aspect-[21/9] max-h-[500px] overflow-hidden bg-neutral-950 border border-neutral-800 mb-16 shadow-2xl">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="/assets/img/img2.jpg"
          >
            <source src="/assets/video/livecoaching.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          {/* Video Controls and Overlay Tag */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
            <div className="max-w-xl">
              <span className="text-xs uppercase font-bold tracking-widest text-[#FFFF00] mb-1 block">
                {activeTab === 'one-on-one' ? 'In-Gym Coaching Demonstration' : 'Remote Live Session Demonstration'}
              </span>
              <h4 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
                {activeTab === 'one-on-one' ? 'Form Perfection & Kinetic Overload' : 'Interactive Biometric Tracking'}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-10 h-10 bg-black/70 hover:bg-[#FFFF00] hover:text-black border border-neutral-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button
                onClick={toggleMute}
                className="w-10 h-10 bg-black/70 hover:bg-[#FFFF00] hover:text-black border border-neutral-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Coaches Roster */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-extrabold uppercase tracking-tight text-white">
                Meet Your Master Trainers
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400">
                Nationally accredited strength coaches, physical therapists, and sports dietitians.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRAINERS.map((trainer) => (
              <div
                key={trainer.id}
                className="bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between hover:border-neutral-700 transition-all duration-300 group"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden mb-5 bg-neutral-950">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-black/80 px-2.5 py-1 text-xs text-[#FFFF00] font-semibold border border-neutral-800">
                      {trainer.experience}
                    </div>
                  </div>

                  <h4 className="text-xl font-bold uppercase tracking-wide text-white group-hover:text-[#FFFF00] transition-colors">
                    {trainer.name}
                  </h4>
                  <div className="text-xs text-neutral-400 font-medium mb-3">
                    {trainer.role}
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                    {trainer.bio}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                      Specialties:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {trainer.specialty.map((spec) => (
                        <span
                          key={spec}
                          className="text-[11px] text-neutral-300 bg-neutral-800/80 px-2 py-0.5 border border-neutral-700/60"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onBookTrainer(trainer)}
                  className="w-full py-2.5 bg-neutral-800 hover:bg-[#FFFF00] text-white hover:text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Consultation</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
