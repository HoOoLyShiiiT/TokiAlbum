import React from 'react';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'indigo', onClick }) {
  const colorMap = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    pink: 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    purple: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:scale-[1.03] hover:shadow-md hover:border-indigo-400/60 dark:hover:border-indigo-500/60' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-2xl border ${colorMap[color] || colorMap.indigo}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] text-slate-900 dark:text-white tracking-tight">
        {value}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium truncate flex items-center justify-between">
          <span>{subtitle}</span>
          {onClick && <span className="text-[10px] text-indigo-500 font-bold ml-1">Ansehen ↗</span>}
        </p>
      )}
    </div>
  );
}
