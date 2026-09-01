import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md py-4 text-center transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <span>Erstellt mit</span>
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20 inline" />
        <span>von</span>
        <strong className="text-slate-800 dark:text-slate-200 font-bold">Soner Çetin</strong>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span className="font-semibold font-['Outfit'] text-slate-700 dark:text-slate-300">TokiAlbum</span>
      </div>
    </footer>
  );
}
