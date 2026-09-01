import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export default function CountdownTimer({ revealDate, lang, onExpire }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false
  });

  useEffect(() => {
    if (!revealDate) return;

    function calculateTime() {
      const targetTime = new Date(revealDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [revealDate, onExpire]);

  if (timeLeft.expired) {
    return null;
  }

  return (
    <div className="w-full bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl rounded-2xl py-3.5 px-4 border border-amber-300/40 dark:border-amber-500/30 shadow-[0_8px_30px_-8px_rgba(245,158,11,0.18)] dark:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.5)] text-center space-y-2.5 transition-all duration-300">
      
      {/* Header Pill with Champagner-Gold Glow */}
      <div className="flex items-center justify-center space-x-1.5">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 dark:from-amber-950/60 dark:via-slate-900 dark:to-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-extrabold shadow-2xs border border-amber-300/60 dark:border-amber-700/50">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>Fotoalbum-Freischaltung 🔒</span>
        </div>
      </div>

      {/* Balanced 4-box Countdown Grid */}
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {[
          { value: timeLeft.days, label: getTranslation(lang, 'days') },
          { value: timeLeft.hours, label: getTranslation(lang, 'hours') },
          { value: timeLeft.minutes, label: getTranslation(lang, 'minutes') },
          { value: timeLeft.seconds, label: getTranslation(lang, 'seconds') }
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white/90 dark:bg-slate-950/90 border border-amber-200/60 dark:border-amber-900/40 rounded-xl py-1.5 px-1 flex flex-col items-center justify-center shadow-2xs hover:border-amber-400 dark:hover:border-amber-600 transition hover:scale-102"
          >
            <span className="text-base sm:text-lg font-extrabold font-['Outfit'] text-slate-900 dark:text-amber-100 tabular-nums leading-tight">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-bold text-amber-700/70 dark:text-amber-400/70 uppercase tracking-wider mt-0.5">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
