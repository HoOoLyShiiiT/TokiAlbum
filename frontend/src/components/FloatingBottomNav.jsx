import React from 'react';
import { Camera, Image as ImageIcon, Target, BookOpen, Trophy } from 'lucide-react';

export default function FloatingBottomNav({
  onCameraClick,
  onGalleryClick,
  onMissionClick,
  onGuestbookClick,
  onRankingClick
}) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[95%] sm:w-[440px] bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border border-slate-200/90 dark:border-indigo-500/30 rounded-full px-2 sm:px-4 py-2 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_25px_rgba(99,102,241,0.15)] flex items-center justify-between transition-all duration-300 animate-fadeIn">
      
      {/* 1. Galerie Button */}
      <div className="flex-1 flex justify-center">
        <button
          type="button"
          onClick={onGalleryClick}
          className="flex flex-col items-center justify-center py-1 px-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 active:scale-90 group"
          title="Galerie öffnen"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-indigo-50 dark:bg-slate-800/60 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-600/30 border border-indigo-200/80 dark:border-slate-700/50 flex items-center justify-center transition-all duration-200 shadow-2xs">
            <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider mt-1 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white uppercase">
            Galerie
          </span>
        </button>
      </div>

      {/* 2. Mission Button */}
      <div className="flex-1 flex justify-center">
        <button
          type="button"
          onClick={onMissionClick}
          className="flex flex-col items-center justify-center py-1 px-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 active:scale-90 group"
          title="Foto-Mission ziehen"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-amber-50 dark:bg-slate-800/60 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 border border-amber-200/80 dark:border-slate-700/50 flex items-center justify-center transition-all duration-200 shadow-2xs">
            <Target className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider mt-1 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white uppercase">
            Mission
          </span>
        </button>
      </div>

      {/* 3. CENTER: Main Live Camera Pill */}
      <div className="flex-1 flex justify-center relative -mt-6">
        <div className="relative">
          {/* Subtle Ambient Pulse Ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-md opacity-40 dark:opacity-50 animate-pulse" />
          
          <button
            type="button"
            onClick={onCameraClick}
            className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-400 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 border-2 border-white dark:border-slate-800 transition-all duration-300 hover:scale-108 active:scale-95 group"
            title="Kamera öffnen"
          >
            <Camera className="w-6 h-6 text-white group-hover:rotate-6 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* 4. Gästebuch Button */}
      <div className="flex-1 flex justify-center">
        <button
          type="button"
          onClick={onGuestbookClick}
          className="flex flex-col items-center justify-center py-1 px-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 active:scale-90 group"
          title="Gästebuch öffnen"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-purple-50 dark:bg-slate-800/60 group-hover:bg-purple-100 dark:group-hover:bg-purple-600/30 border border-purple-200/80 dark:border-slate-700/50 flex items-center justify-center transition-all duration-200 shadow-2xs">
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider mt-1 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white uppercase">
            Gästebuch
          </span>
        </button>
      </div>

      {/* 5. Ranking Button */}
      <div className="flex-1 flex justify-center">
        <button
          type="button"
          onClick={onRankingClick}
          className="flex flex-col items-center justify-center py-1 px-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 active:scale-90 group"
          title="Rangliste öffnen"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-rose-50 dark:bg-slate-800/60 group-hover:bg-rose-100 dark:group-hover:bg-rose-600/30 border border-rose-200/80 dark:border-slate-700/50 flex items-center justify-center transition-all duration-200 shadow-2xs">
            <Trophy className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider mt-1 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white uppercase">
            Ranking
          </span>
        </button>
      </div>

    </div>
  );
}
