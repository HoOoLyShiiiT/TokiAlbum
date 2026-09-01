import React from 'react';
import { Camera, Lock, LockOpen, QrCode, Globe, Shield, Moon, Sun } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export default function Header({
  eventName,
  isRevealed,
  isAdmin,
  lang,
  darkMode,
  onToggleDarkMode,
  onLanguageChange,
  onOpenQr
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Title */}
        <div className="flex items-center space-x-3">
          <a href="/" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xl tracking-tight hover:opacity-90 transition">
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline font-['Outfit'] font-bold text-slate-900 dark:text-white text-2xl tracking-tight">
              TokiAlbum
            </span>
          </a>

          {eventName && (
            <div className="flex items-center space-x-2 pl-3 border-l border-slate-200 dark:border-slate-800">
              <h1 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[150px] sm:max-w-[280px]">
                {eventName}
              </h1>
              {isAdmin ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </span>
              ) : isRevealed ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50">
                  <LockOpen className="w-3 h-3 mr-1" />
                  Offen
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <Lock className="w-3 h-3 mr-1" />
                  Verschlossen
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {onOpenQr && (
            <button
              onClick={onOpenQr}
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition"
              title="QR-Code anzeigen"
            >
              <QrCode className="w-4 h-4 sm:mr-1 text-slate-600 dark:text-slate-300" />
              <span className="hidden sm:inline">QR-Code</span>
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
            title={darkMode ? 'Heller Modus' : 'Dunkler Modus'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => onLanguageChange(lang === 'de' ? 'en' : 'de')}
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition"
            title={getTranslation(lang, 'language')}
          >
            <Globe className="w-3.5 h-3.5 mr-1 text-slate-500" />
            <span className="uppercase">{lang}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
