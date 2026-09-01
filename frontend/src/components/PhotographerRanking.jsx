import React from 'react';
import { Trophy, ChevronRight, Sparkles } from 'lucide-react';

export default function PhotographerRanking({ mediaList = [], onOpenRanking }) {
  // Group uploads by guest name
  const counts = {};
  mediaList.forEach((item) => {
    const rawName = item.guestName ? item.guestName.trim() : 'Gast';
    counts[rawName] = (counts[rawName] || 0) + 1;
  });

  // Convert to sorted array
  const leaderboard = Object.keys(counts)
    .map((name) => ({ name, count: counts[name] }))
    .sort((a, b) => b.count - a.count)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  if (leaderboard.length === 0) return null;

  const top3 = leaderboard.slice(0, 3);
  const rankBadges = ['🥇', '🥈', '🥉'];

  return (
    <div
      onClick={onOpenRanking}
      className="w-full bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl rounded-2xl p-4 border border-amber-300/50 dark:border-amber-500/30 shadow-[0_8px_25px_-8px_rgba(245,158,11,0.18)] dark:shadow-[0_8px_25px_-8px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-[1.01] hover:border-amber-400 dark:hover:border-amber-400 transition-all duration-300 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700">
            <Trophy className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-['Outfit'] flex items-center space-x-1.5">
            <span>Top Fotografen</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </h3>
        </div>

        <div className="flex items-center text-xs font-bold text-amber-700 dark:text-amber-300 hover:text-amber-800 transition">
          <span>Alle anzeigen ({leaderboard.length})</span>
          <ChevronRight className="w-4 h-4 ml-0.5" />
        </div>
      </div>

      {/* Top 3 Cards Grid */}
      <div className="grid grid-cols-3 gap-2">
        {top3.map((item, index) => (
          <div
            key={index}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
              index === 0
                ? 'bg-gradient-to-b from-amber-100/70 to-amber-50/50 dark:from-amber-950/60 dark:to-slate-900 border-amber-300 dark:border-amber-700 shadow-2xs'
                : index === 1
                ? 'bg-gradient-to-b from-slate-100/70 to-slate-50/50 dark:from-slate-800/60 dark:to-slate-900 border-slate-300 dark:border-slate-700'
                : 'bg-gradient-to-b from-amber-900/10 to-transparent dark:from-amber-900/30 dark:to-slate-900 border-amber-900/30 dark:border-amber-800/40'
            }`}
          >
            <span className="text-base sm:text-lg mb-0.5">{rankBadges[index]}</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-full">
              {item.name}
            </span>
            <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 font-mono mt-0.5">
              {item.count} {item.count === 1 ? 'Foto' : 'Fotos'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
