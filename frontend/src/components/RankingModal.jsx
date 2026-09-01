import React, { useState } from 'react';
import { X, Trophy, Search, Camera } from 'lucide-react';

export default function RankingModal({ isOpen, onClose, leaderboard = [], mediaList = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Compute leaderboard from mediaList if not explicitly passed
  let effectiveLeaderboard = leaderboard;
  if (!effectiveLeaderboard || effectiveLeaderboard.length === 0) {
    const counts = {};
    mediaList.forEach((item) => {
      const rawName = item.guestName ? item.guestName.trim() : 'Gast';
      counts[rawName] = (counts[rawName] || 0) + 1;
    });

    effectiveLeaderboard = Object.keys(counts)
      .map((name) => ({ name, count: counts[name] }))
      .sort((a, b) => b.count - a.count)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  }

  const maxPhotos = effectiveLeaderboard.length > 0 ? effectiveLeaderboard[0].count : 1;

  const filteredLeaderboard = effectiveLeaderboard.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankBadge = (rank) => {
    if (rank === 1) return { label: '🥇 1. Platz', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700' };
    if (rank === 2) return { label: '🥈 2. Platz', color: 'bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700' };
    if (rank === 3) return { label: '🥉 3. Platz', color: 'bg-amber-900/10 text-amber-900 border-amber-900/30 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50' };
    return { label: `#${rank}`, color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700">
            <Trophy className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] flex items-center space-x-2">
              <span>Fotografen-Ranking</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800 font-extrabold">
                Top {effectiveLeaderboard.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Wer hat die meisten Schnappschüsse im Fotoalbum geteilt?
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Fotograf suchen..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {filteredLeaderboard.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
              Noch keine Aufnahmen vorhanden.
            </div>
          ) : (
            filteredLeaderboard.map((item, index) => {
              const rank = item.rank;
              const badge = getRankBadge(rank);
              const percentage = Math.round((item.count / maxPhotos) * 100);

              return (
                <div
                  key={index}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                    rank === 1
                      ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-300/60 dark:border-amber-600/40 shadow-xs'
                      : rank === 2
                      ? 'bg-gradient-to-r from-slate-500/10 to-transparent border-slate-300/60 dark:border-slate-700/60'
                      : rank === 3
                      ? 'bg-gradient-to-r from-amber-800/10 to-transparent border-amber-800/30 dark:border-amber-800/40'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-1 text-xs font-black text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-indigo-100 dark:border-slate-800 shadow-2xs">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{item.count} {item.count === 1 ? 'Foto' : 'Fotos'}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-200/70 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        rank === 1
                          ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                          : rank === 2
                          ? 'bg-gradient-to-r from-slate-400 to-slate-600'
                          : rank === 3
                          ? 'bg-gradient-to-r from-amber-700 to-amber-900'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
          >
            Schließen
          </button>
        </div>

      </div>
    </div>
  );
}
