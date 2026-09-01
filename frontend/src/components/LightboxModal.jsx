import React, { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Download, User, Calendar, Heart, Mic, Trash2, Eye } from 'lucide-react';
import { getTranslation } from '../utils/i18n';
import { likeMedia } from '../utils/api';

export default function LightboxModal({
  item,
  mediaList = [],
  currentIndex = 0,
  isOpen,
  onClose,
  onNavigate,
  lang,
  eventId,
  isAdmin = false,
  isRevealed = true,
  onDeleteItem = null,
  guestName = '',
  myUploadedIds = []
}) {
  const [likesCount, setLikesCount] = useState(item?.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchEndX = useRef(null);
  const touchEndY = useRef(null);

  useEffect(() => {
    if (item) {
      setLikesCount(item.likesCount || 0);
      setHasLiked(false);
    }
  }, [item]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < mediaList.length - 1) onNavigate(currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, mediaList.length, onClose, onNavigate]);

  const handleTouchStart = (e) => {
    touchEndX.current = null;
    touchEndY.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distanceX = touchStartX.current - touchEndX.current;
    const distanceY = touchStartY.current - touchEndY.current;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe && Math.abs(distanceX) > 35) {
      if (distanceX > 0) {
        // Swiped Left -> Next Photo
        if (currentIndex < mediaList.length - 1) {
          onNavigate(currentIndex + 1);
        }
      } else {
        // Swiped Right -> Previous Photo
        if (currentIndex > 0) {
          onNavigate(currentIndex - 1);
        }
      }
    }
  };

  if (!isOpen || !item) return null;

  const currentSessionId = typeof localStorage !== 'undefined' ? localStorage.getItem('knipsen_session_id') : null;
  const isOwnPhoto = Boolean(
    (item.sessionId && currentSessionId && item.sessionId === currentSessionId) ||
    (myUploadedIds && myUploadedIds.includes(item.id)) ||
    (item.guestName && guestName && item.guestName.trim().toLowerCase() === guestName.trim().toLowerCase())
  );

  const isVideo = item.mimeType.startsWith('video/');

  const getFullFileUrl = (mediaItem) => {
    if (!mediaItem || !mediaItem.fileUrl) return '';
    let url = mediaItem.fileUrl;
    if (!isRevealed && !isAdmin && isOwnPhoto) {
      const sep = url.includes('?') ? '&' : '?';
      url += `${sep}guestName=${encodeURIComponent(guestName || '')}&sessionId=${encodeURIComponent(currentSessionId || '')}`;
    }
    return url;
  };

  const fullFileUrl = getFullFileUrl(item);

  const handleLikeInModal = async () => {
    if (hasLiked || !eventId) return;
    try {
      setHasLiked(true);
      setLikesCount((prev) => prev + 1);
      const res = await likeMedia(eventId, item.id);
      item.likesCount = res.likesCount;
      setLikesCount(res.likesCount);
    } catch (e) {
      console.error('Like error:', e);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-3 sm:p-6 animate-fadeIn select-none"
    >
      {/* Top Bar Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-50">
        <div className="text-xs sm:text-sm font-semibold text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 shadow-md">
          {currentIndex + 1} / {mediaList.length}
        </div>

        <div className="flex items-center space-x-2">
          {/* Own Photo Badge */}
          {isOwnPhoto && (
            <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-indigo-600/90 text-white text-xs font-extrabold border border-indigo-400/40 shadow-md">
              Dein Foto 📸
            </span>
          )}

          {/* Views Counter Badge in Modal Header */}
          <div className="px-3 py-1.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-800 text-xs font-bold flex items-center space-x-1.5 shadow-md">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>{item.viewsCount || 0} Aufrufe</span>
          </div>

          {/* Delete Button for Owner or Admin */}
          {(isAdmin || isOwnPhoto) && onDeleteItem && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Möchtest du dieses Foto wirklich löschen?')) {
                  onDeleteItem(item.id);
                  onClose();
                }
              }}
              className="p-2.5 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white border border-rose-500 transition shadow-lg flex items-center space-x-1"
              title="Foto löschen"
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">Löschen</span>
            </button>
          )}

          {/* Like Button */}
          <button
            onClick={handleLikeInModal}
            className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center space-x-1.5 transition ${
              hasLiked
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-900/80 text-rose-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
            <span>{likesCount}</span>
          </button>

          <a
            href={fullFileUrl}
            download={item.originalName}
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-800 transition shadow-lg"
            title={getTranslation(lang, 'downloadItem')}
          >
            <Download className="w-5 h-5" />
          </a>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-slate-200 hover:text-white border border-slate-800 transition shadow-lg"
            title="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 sm:p-3.5 rounded-full bg-slate-900/80 hover:bg-indigo-600 text-white border border-slate-700/80 shadow-2xl transition active:scale-90"
          title="Vorheriges Bild"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      )}

      {currentIndex < mediaList.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex + 1);
          }}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 sm:p-3.5 rounded-full bg-slate-900/80 hover:bg-indigo-600 text-white border border-slate-700/80 shadow-2xl transition active:scale-90"
          title="Nächstes Bild"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      )}

      {/* Main Content Area */}
      <div className="w-full max-w-5xl max-h-[85vh] flex flex-col items-center justify-center my-auto px-2">
        <div className="relative max-h-[65vh] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl">
          {isVideo ? (
            <video
              src={fullFileUrl}
              controls
              autoPlay
              className="max-h-[65vh] max-w-full rounded-2xl outline-none"
            />
          ) : (
            <img
              src={fullFileUrl}
              alt={item.originalName}
              className="max-h-[65vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />
          )}
        </div>

        {/* Media Metadata & Voice Note Audio Player */}
        <div className="mt-4 max-w-lg w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center backdrop-blur-md shadow-xl space-y-2">
          {item.guestName && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
              <User className="w-3.5 h-3.5" />
              <span>{item.guestName}</span>
            </div>
          )}

          {item.caption && (
            <p className="text-sm sm:text-base text-slate-100 font-medium my-1">
              "{item.caption}"
            </p>
          )}

          {/* Voice Note Audio Player with Play/Pause Controls */}
          {item.audioUrl && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-left w-full">
              <div className="flex items-center space-x-2 text-pink-400 flex-shrink-0">
                <Mic className="w-4 h-4" />
                <span className="text-xs font-semibold text-slate-300">Sprachnachricht</span>
              </div>
              
              <audio
                src={item.audioUrl}
                controls
                preload="metadata"
                className="w-full max-w-xs h-8"
              />
            </div>
          )}

          <div className="flex items-center justify-center space-x-3 text-xs text-slate-400 mt-2">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(item.createdAt).toLocaleString(lang === 'de' ? 'de-DE' : 'en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-indigo-400 font-semibold flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5 mr-0.5" />
              <span>{item.viewsCount || 0} Aufrufe</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
