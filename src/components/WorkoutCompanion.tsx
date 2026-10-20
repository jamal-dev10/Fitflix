import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Timer, X, Flame } from 'lucide-react';

interface WorkoutCompanionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkoutCompanion: React.FC<WorkoutCompanionProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'work' | 'rest' | 'idle' | 'complete'>('idle');
  const [workDuration, setWorkDuration] = useState(30);
  const [restDuration, setRestDuration] = useState(15);
  const [totalRounds, setTotalRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play synthetic beep
  const playBeep = (freq = 880, duration = 0.15) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  };

  // Timer Tick effect
  useEffect(() => {
    let timer: number | null = null;
    if (isRunning && mode !== 'idle' && mode !== 'complete') {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 4 && prev > 1) {
            playBeep(440, 0.1); // Countdown tick
          }
          if (prev <= 1) {
            // State transition
            if (mode === 'work') {
              playBeep(600, 0.3);
              if (currentRound >= totalRounds) {
                setMode('complete');
                setIsRunning(false);
                playBeep(1200, 0.5);
                return 0;
              } else {
                setMode('rest');
                return restDuration;
              }
            } else if (mode === 'rest') {
              playBeep(880, 0.3);
              setCurrentRound((r) => r + 1);
              setMode('work');
              return workDuration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, mode, currentRound, totalRounds, workDuration, restDuration]);

  if (!isOpen) return null;

  const handleStart = () => {
    if (mode === 'idle' || mode === 'complete') {
      setMode('work');
      setCurrentRound(1);
      setTimeLeft(workDuration);
    }
    setIsRunning(true);
    playBeep(880, 0.2);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMode('idle');
    setCurrentRound(1);
    setTimeLeft(workDuration);
  };

  const applyPreset = (work: number, rest: number, rounds: number) => {
    setIsRunning(false);
    setWorkDuration(work);
    setRestDuration(rest);
    setTotalRounds(rounds);
    setMode('idle');
    setCurrentRound(1);
    setTimeLeft(work);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 text-white shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Timer className="w-5 h-5 text-[#FFFF00]" />
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">
              FitFlex Interval Timer
            </h3>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 text-neutral-400 hover:text-white cursor-pointer mr-6"
            title={soundEnabled ? 'Mute buzzer' : 'Enable buzzer'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#FFFF00]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => applyPreset(20, 10, 8)}
            className="px-3 py-1.5 text-xs font-bold uppercase bg-neutral-900 border border-neutral-700 hover:border-[#FFFF00] text-neutral-300 hover:text-white transition-colors shrink-0 cursor-pointer"
          >
            Tabata (20/10s · 8R)
          </button>
          <button
            onClick={() => applyPreset(45, 15, 6)}
            className="px-3 py-1.5 text-xs font-bold uppercase bg-neutral-900 border border-neutral-700 hover:border-[#FFFF00] text-neutral-300 hover:text-white transition-colors shrink-0 cursor-pointer"
          >
            HIIT (45/15s · 6R)
          </button>
          <button
            onClick={() => applyPreset(60, 30, 5)}
            className="px-3 py-1.5 text-xs font-bold uppercase bg-neutral-900 border border-neutral-700 hover:border-[#FFFF00] text-neutral-300 hover:text-white transition-colors shrink-0 cursor-pointer"
          >
            Heavy Lifting Rest (60s)
          </button>
        </div>

        {/* Main Countdown Screen */}
        <div
          className={`p-8 text-center border-2 mb-6 transition-colors duration-300 ${
            mode === 'work'
              ? 'bg-neutral-950 border-[#FFFF00]'
              : mode === 'rest'
              ? 'bg-neutral-950 border-emerald-500'
              : mode === 'complete'
              ? 'bg-neutral-950 border-blue-500'
              : 'bg-neutral-950 border-neutral-800'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
            <span>
              Round {mode === 'idle' ? 1 : currentRound} of {totalRounds}
            </span>
            <span
              className={`px-2 py-0.5 font-bold ${
                mode === 'work'
                  ? 'bg-[#FFFF00] text-black'
                  : mode === 'rest'
                  ? 'bg-emerald-500 text-black'
                  : mode === 'complete'
                  ? 'bg-blue-500 text-white'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {mode === 'idle'
                ? 'Ready'
                : mode === 'work'
                ? 'WORK / BURST'
                : mode === 'rest'
                ? 'REST / RECOVER'
                : 'SESSION FINISHED'}
            </span>
          </div>

          <div
            className={`text-7xl sm:text-8xl font-black tabular-nums tracking-tighter my-4 ${
              mode === 'work'
                ? 'text-[#FFFF00]'
                : mode === 'rest'
                ? 'text-emerald-400'
                : mode === 'complete'
                ? 'text-blue-400'
                : 'text-white'
            }`}
          >
            {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </div>

          <div className="text-xs text-neutral-400">
            {mode === 'work'
              ? 'Keep maximum intensity! Full muscle activation.'
              : mode === 'rest'
              ? 'Deep diaphragmatic breathing. Lower heart rate.'
              : mode === 'complete'
              ? 'Great job crushing this session!'
              : 'Press Start to begin your interval set'}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {isRunning ? (
            <button
              onClick={handlePause}
              className="py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>Pause Timer</span>
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="py-3.5 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>{mode === 'idle' ? 'Start Workout' : 'Resume'}</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="py-3.5 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Custom interval adjustments (when paused or idle) */}
        {!isRunning && (
          <div className="grid grid-cols-3 gap-3 p-3 bg-neutral-900 border border-neutral-800 text-center text-xs">
            <div>
              <span className="text-neutral-400 block mb-1">Work (sec)</span>
              <input
                type="number"
                min="5"
                max="300"
                value={workDuration}
                onChange={(e) => {
                  const val = Math.max(5, Number(e.target.value));
                  setWorkDuration(val);
                  if (mode === 'idle') setTimeLeft(val);
                }}
                className="w-full bg-neutral-950 border border-neutral-700 py-1 px-2 text-center text-white font-bold"
              />
            </div>
            <div>
              <span className="text-neutral-400 block mb-1">Rest (sec)</span>
              <input
                type="number"
                min="5"
                max="300"
                value={restDuration}
                onChange={(e) => setRestDuration(Math.max(5, Number(e.target.value)))}
                className="w-full bg-neutral-950 border border-neutral-700 py-1 px-2 text-center text-white font-bold"
              />
            </div>
            <div>
              <span className="text-neutral-400 block mb-1">Rounds</span>
              <input
                type="number"
                min="1"
                max="30"
                value={totalRounds}
                onChange={(e) => setTotalRounds(Math.max(1, Number(e.target.value)))}
                className="w-full bg-neutral-950 border border-neutral-700 py-1 px-2 text-center text-white font-bold"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
