import React, { useState } from 'react';
import { X, Users, Search, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function GuestsModal({ isOpen, onClose, guestNames = [], mediaList = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Calculate uploads count per guest name
  const guestUploadCounts = {};
  mediaList.forEach((item) => {
    const name = item.guestName ? item.guestName.trim() : 'Gast';
    guestUploadCounts[name] = (guestUploadCounts[name] || 0) + 1;
  });

  // Filter guests by search term
  const filteredGuests = guestNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="p-3 rounded-2xl bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              Aktive Gäste ({guestNames.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Alle Gäste, die bereits Fotos im Album hochgeladen haben.
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
            placeholder="Name suchen..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Guest List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredGuests.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
              Keine Gäste gefunden.
            </div>
          ) : (
            filteredGuests.map((name, index) => {
              const count = guestUploadCounts[name] || 0;
              const initials = name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <div
                  key={index}
                  className="pt-2.5 first:pt-0 flex items-center justify-between transition hover:bg-slate-50 dark:hover:bg-slate-950/40 p-2 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs border border-indigo-300/30">
                      {initials || 'G'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {name}
                      </h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Teilnehmer #{index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold flex items-center space-x-1">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{count} {count === 1 ? 'Foto' : 'Fotos'}</span>
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
