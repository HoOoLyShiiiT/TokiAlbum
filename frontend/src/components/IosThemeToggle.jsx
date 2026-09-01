import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function IosThemeToggle({ darkMode, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative w-12 h-6.5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none shadow-2xs ${
        darkMode ? 'bg-indigo-600' : 'bg-slate-300/90'
      }`}
      aria-label="Toggle Dark Mode"
    >
      <div
        className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          darkMode ? 'translate-x-5.5' : 'translate-x-0'
        }`}
      >
        {darkMode ? (
          <Moon className="w-3 h-3 text-indigo-600" />
        ) : (
          <Sun className="w-3 h-3 text-amber-500" />
        )}
      </div>
    </button>
  );
}
