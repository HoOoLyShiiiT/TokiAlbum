import React, { useState } from 'react';
import { Download, Image as ImageIcon, User, Trash2, Eye, Lock, Heart, Mic, Clock, LayoutGrid } from 'lucide-react';
import { getTranslation } from '../utils/i18n';
import { likeMedia, incrementMediaView } from '../utils/api';

// Pseudo-random deterministic generator for unique realistic photo rotation & tape accents
function getPhotoStyle(itemId, index) {
  let hash = 0;
  const str = String(itemId || index);
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);

  // Unique angle between -6.5deg and +6.5deg
  const rot = (((posHash % 130) - 65) / 10).toFixed(1);

  // Unique vertical offset between -5px and +5px
  const offY = ((posHash % 11) - 5);

  // Random Tape (approx 45% chance)
  const hasTape = (posHash % 7) === 0 || (posHash % 7) === 2 || (posHash % 7) === 4;
  const tapeRot = (((posHash % 20) - 10) / 2).toFixed(1);
  const tapePosIndex = posHash % 3;
  const tapePositionClass = tapePosIndex === 0 ? '-top-3 left-4' : tapePosIndex === 1 ? '-top-3 left-1/2 -translate-x-1/2' : '-top-3 right-4';

  return { rot, offY, hasTape, tapeRot, tapePositionClass };
}

export default function GalleryGrid({
  media = [],
  eventId,
  lang,
  isAdmin,
  isRevealed = true,
  onItemClick,
  onDeleteItem,
  adminToken,
  guestName = '',
  myUploadedIds = []
}) {
  const [likedMap, setLikedMap] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'timeline'

  const currentSessionId = typeof localStorage !== 'undefined' ? localStorage.getItem('knipsen_session_id') : null;

  const handleLike = async (e, item) => {
    e.stopPropagation();
    if (likedMap[item.id]) return;

    try {
      setLikedMap((prev) => ({ ...prev, [item.id]: true }));
      const res = await likeMedia(eventId, item.id);
      item.likesCount = res.likesCount;
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleItemClick = async (item, index) => {
    if (!isRevealed && !isAdmin && !myUploadedIds.includes(item.id)) return;

    try {
      const res = await incrementMediaView(eventId, item.id);
      if (res && res.viewsCount !== undefined) {
        item.viewsCount = res.viewsCount;
      }
    } catch (err) {
      console.warn('View count error:', err);
    }

    if (onItemClick) {
      onItemClick(item, index);
    }
  };

  const downloadAllUrl = `/api/events/${eventId}/download-all${adminToken ? `?token=${encodeURIComponent(adminToken)}` : ''}`;

  // Group media chronologically by hour for Timeline view
  const timelineGroups = {};
  if (viewMode === 'timeline') {
    const chronologicalMedia = [...media].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    chronologicalMedia.forEach((item) => {
      const date = new Date(item.createdAt);
      const hourStr = `${date.getHours().toString().padStart(2, '0')}:00 Uhr`;
      if (!timelineGroups[hourStr]) {
        timelineGroups[hourStr] = [];
      }
      timelineGroups[hourStr].push(item);
    });
  }

  return (
    <div className="w-full space-y-4">
      {/* Gallery View Control Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800 flex-wrap gap-2">
        
        {/* Toggle Pills: Grid / Timeline */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Galerie</span>
          </button>

          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition ${
              viewMode === 'timeline'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Zeitleiste</span>
          </button>
        </div>

        {/* Download ZIP */}
        {(isRevealed || isAdmin) && media.length > 0 && (
          <a
            href={downloadAllUrl}
            className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
            <span>{getTranslation(lang, 'downloadAllZip')}</span>
          </a>
        )}
      </div>

      {/* Empty State */}
      {media.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto mb-3">
            <ImageIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
            {getTranslation(lang, 'noMediaYet')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {getTranslation(lang, 'beTheFirst')}
          </p>
        </div>
      ) : viewMode === 'timeline' ? (
        
        /* CHRONOLOGICAL TIMELINE STORY VIEW */
        <div className="space-y-8 py-2 relative before:absolute before:left-4 sm:before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-indigo-200 dark:before:bg-indigo-900/40">
          {Object.keys(timelineGroups).map((hourLabel, groupIdx) => {
            const groupItems = timelineGroups[hourLabel];

            return (
              <div key={groupIdx} className="relative pl-10 sm:pl-14 space-y-4">
                
                {/* Hour Timeline Node Badge */}
                <div className="absolute left-1.5 sm:left-3.5 top-0 -translate-x-1/2 w-6 h-6 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900 shadow-md flex items-center justify-center text-white">
                  <Clock className="w-3.5 h-3.5" />
                </div>

                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                    {hourLabel}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200 dark:border-indigo-800">
                    {groupItems.length} {groupItems.length === 1 ? 'Foto' : 'Fotos'}
                  </span>
                </div>

                {/* Photo Grid for this Hour */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {groupItems.map((item, index) => {
                    const isOwnPhoto = Boolean(
                      (item.sessionId && currentSessionId && item.sessionId === currentSessionId) ||
                      (myUploadedIds && myUploadedIds.includes(item.id)) ||
                      (item.guestName && guestName && item.guestName.trim().toLowerCase() === guestName.trim().toLowerCase())
                    );
                    const shouldBlur = !isRevealed && !isAdmin && !isOwnPhoto;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item, index)}
                        className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950">
                          <img
                            src={item.thumbnailUrl}
                            alt={item.originalName}
                            loading="lazy"
                            className={`w-full h-full object-cover transition-all duration-300 ${
                              shouldBlur ? 'blur-md scale-110 select-none' : 'group-hover:scale-105'
                            }`}
                          />

                          {/* Heart Like Pill */}
                          {!shouldBlur && (
                            <button
                              onClick={(e) => handleLike(e, item)}
                              className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[11px] font-bold text-rose-500 flex items-center space-x-1 border border-slate-200 dark:border-slate-800 shadow-2xs"
                            >
                              <Heart className={`w-3 h-3 ${likedMap[item.id] || item.likesCount > 0 ? 'fill-rose-500' : ''}`} />
                              <span>{item.likesCount || 0}</span>
                            </button>
                          )}
                        </div>

                        <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 px-0.5">
                          <span className="truncate">{item.guestName || 'Gast'}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        
        /* REALISTIC ORGANIC POLAROID GRID (RANDOM UNIQUE ROTATIONS & TAPE ACCENTS) */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-3 sm:gap-x-5 sm:gap-y-9 p-2 pt-3 pb-6">
          {media.map((item, index) => {
            const isOwnPhoto = Boolean(
              (item.sessionId && currentSessionId && item.sessionId === currentSessionId) ||
              (myUploadedIds && myUploadedIds.includes(item.id)) ||
              (item.guestName && guestName && item.guestName.trim().toLowerCase() === guestName.trim().toLowerCase())
            );
            const shouldBlur = !isRevealed && !isAdmin && !isOwnPhoto;

            // Compute unique per-item style
            const style = getPhotoStyle(item.id, index);
            const baseZIndex = (index % 7) + 1;

            return (
              <div
                key={item.id}
                style={{
                  transform: `rotate(${style.rot}deg) translateY(${style.offY}px)`,
                  zIndex: baseZIndex
                }}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.14),0_6px_8px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out hover:rotate-0 hover:translate-y-[-8px] hover:scale-108 hover:z-50 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.3)] flex flex-col justify-between"
              >
                {/* Washi / Tesa Tape Accent */}
                {style.hasTape && (
                  <div
                    style={{ transform: `rotate(${style.tapeRot}deg)` }}
                    className={`absolute ${style.tapePositionClass} w-11 sm:w-13 h-4 bg-amber-100/90 dark:bg-amber-200/25 border border-amber-300/60 dark:border-amber-200/20 backdrop-blur-xs shadow-2xs z-30 pointer-events-none rounded-xs opacity-90 group-hover:opacity-100 transition-opacity`}
                  />
                )}

                {/* Photo Image Frame */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 shadow-inner">
                  {/* Thumbnail Image */}
                  <img
                    src={item.thumbnailUrl}
                    alt={item.originalName}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      shouldBlur ? 'blur-md scale-110 select-none pointer-events-none' : 'group-hover:scale-105'
                    }`}
                  />

                  {/* 'Dein Foto' Badge */}
                  {!isRevealed && !isAdmin && isOwnPhoto && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-indigo-600/90 text-white backdrop-blur-md text-[10px] font-extrabold shadow-md z-10 border border-indigo-400/40">
                      Dein Foto 📸
                    </div>
                  )}

                  {/* Audio Badge */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1.5 z-10">
                    {item.hasAudio && (
                      <div className="p-1.5 rounded-lg bg-pink-600 text-white shadow-xs" title="Sprachnachricht vorhanden">
                        <Mic className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Top Left Stats Bar: Heart Like Button & View Counter */}
                  {!shouldBlur && (
                    <div className="absolute top-2 left-2 flex items-center space-x-1 z-10">
                      <button
                        onClick={(e) => handleLike(e, item)}
                        className="px-2 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold text-rose-500 flex items-center space-x-1 border border-slate-200 dark:border-slate-800 shadow-2xs hover:scale-105 transition active:scale-90"
                        title="Herzen"
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedMap[item.id] || item.likesCount > 0 ? 'fill-rose-500' : ''}`} />
                        <span>{item.likesCount || 0}</span>
                      </button>

                      <div
                        className="px-2 py-1 rounded-xl bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-slate-200 flex items-center space-x-1 border border-slate-700/80 shadow-2xs"
                        title="Aufrufe"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{item.viewsCount || 0}</span>
                      </div>
                    </div>
                  )}

                  {/* Lock Overlay when blurred */}
                  {shouldBlur && (
                    <div
                      onClick={() => alert('Die Fotos schalten sich am Enthüllungsdatum frei! 🔒')}
                      className="absolute inset-0 bg-slate-900/20 dark:bg-slate-950/40 flex flex-col items-center justify-center cursor-pointer z-20"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center shadow-md">
                        <Lock className="w-5 h-5" />
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay with Actions */}
                  {!shouldBlur && (
                    <div
                      onClick={() => handleItemClick(item, index)}
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 cursor-pointer z-20"
                    >
                      <div className="flex justify-end space-x-2">
                        {(isAdmin || isOwnPhoto) && onDeleteItem && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteItem(item.id);
                            }}
                            className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition shadow-md"
                            title={getTranslation(lang, 'delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg">
                          <Eye className="w-5 h-5" />
                        </div>
                        {item.caption && (
                          <p className="text-xs text-white line-clamp-2 mt-2 font-semibold px-1">
                            "{item.caption}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-300 font-semibold">
                        <span>👁️ {item.viewsCount || 0} Aufrufe</span>
                        <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Polaroid Printed Bottom Label */}
                <div className="mt-2 px-1 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center space-x-1 min-w-0 flex-1 pr-1">
                    <User className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                    <span className="truncate text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                      {item.guestName || 'Gast'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
