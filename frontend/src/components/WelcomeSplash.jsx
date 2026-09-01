import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function WelcomeSplash({ eventName, onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleFinish = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 600); // 600ms smooth fade out
  };

  useEffect(() => {
    // Auto-transition after 5 seconds
    const timer = setTimeout(() => {
      handleFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={handleFinish}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between py-6 px-4 bg-slate-950 text-white cursor-pointer select-none overflow-hidden transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Soft Gold Ambient Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/15 via-slate-950/80 to-slate-950 z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Animated Welcome Card Container - Significantly Larger */}
      <div className="relative z-20 max-w-md sm:max-w-lg w-full mx-auto my-auto flex flex-col items-center space-y-5 animate-fadeIn">
        <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_30px_70px_-15px_rgba(245,158,11,0.3)] border-2 border-amber-300/60 bg-slate-900 group">
          
          {/* Large Couple Welcome Image Frame */}
          <div className="relative h-[62vh] sm:h-[68vh] w-full overflow-hidden bg-slate-950">
            <img
              src="/welcome.jpg"
              alt="Herzlich Willkommen"
              className="w-full h-full object-cover object-top transform scale-105 transition-transform duration-10000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          </div>

          {/* Shimmer Overlay Card Text */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-center space-y-2.5">
            <div className="inline-flex items-center justify-center space-x-1.5 px-4 py-1.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-300/40 text-xs font-extrabold uppercase tracking-widest backdrop-blur-md shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Herzlich Willkommen</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-white drop-shadow-md tracking-tight pt-1">
              {eventName || 'Unsere Hochzeit'}
            </h2>
            
            <p className="text-xs sm:text-sm text-amber-100/90 font-medium max-w-sm mx-auto">
              Schön, dass du diesen besonderen Tag mit uns feierst! 💖
            </p>
          </div>
        </div>

        {/* Tap to Continue Button */}
        <div className="w-full space-y-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-base shadow-xl flex items-center justify-center space-x-2 transition active:scale-95 border border-amber-200"
          >
            <span>Weiter zum Fotoalbum</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-[11px] text-amber-200/70 font-semibold tracking-wide text-center">
            Tippe auf den Bildschirm zum Überspringen
          </p>
        </div>
      </div>
    </div>
  );
}
