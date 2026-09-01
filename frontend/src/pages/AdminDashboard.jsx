import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Upload,
  Users,
  HardDrive,
  Calendar,
  Save,
  Download,
  QrCode,
  Check,
  MessageCircle,
  Sliders,
  BarChart3,
  ExternalLink,
  Camera,
  ArrowRight,
  BookOpen,
  Feather
} from 'lucide-react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import GalleryGrid from '../components/GalleryGrid';
import LightboxModal from '../components/LightboxModal';
import QRCodeModal from '../components/QRCodeModal';
import ThankYouCardModal from '../components/ThankYouCardModal';
import GuestbookPdfModal from '../components/GuestbookPdfModal';
import GuestsModal from '../components/GuestsModal';
import GuestbookModal from '../components/GuestbookModal';
import { getEventDetails, getEventMedia, getEventStats, updateEvent, deleteMedia } from '../utils/api';
import { getTranslation } from '../utils/i18n';

export default function AdminDashboard({ eventId, token, lang, darkMode, onToggleDarkMode, onLanguageChange }) {
  const [event, setEvent] = useState(null);
  const [stats, setStats] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Event Settings form states
  const [editName, setEditName] = useState('');
  const [editRevealDate, setEditRevealDate] = useState('');
  const [editTheme, setEditTheme] = useState('classic');
  const [editMaxUploads, setEditMaxUploads] = useState(50);
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal States
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const loadAdminData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const [eventRes, statsRes, mediaRes] = await Promise.all([
        getEventDetails(eventId, token),
        getEventStats(eventId, token),
        getEventMedia(eventId, token)
      ]);

      setEvent(eventRes);
      setStats(statsRes);
      setMediaList(mediaRes.media || []);

      setEditName(eventRes.name);
      setEditTheme(eventRes.theme || 'classic');
      setEditMaxUploads(eventRes.maxUploadsPerGuest || 50);

      if (eventRes.revealDate) {
        setEditRevealDate(new Date(eventRes.revealDate).toISOString().slice(0, 16));
      }
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
      setErrorMsg(err.message || 'Zugriff verweigert. Ungültiger Admin-Token.');
    } finally {
      setLoading(false);
    }
  }, [eventId, token]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setSaveSuccess(false);

    try {
      const updated = await updateEvent(
        eventId,
        {
          name: editName,
          revealDate: editRevealDate,
          theme: editTheme,
          maxUploadsPerGuest: editMaxUploads
        },
        token
      );
      setEvent((prev) => ({ ...prev, ...updated }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Fehler beim Speichern der Einstellungen.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteItem = async (mediaId) => {
    if (!window.confirm(getTranslation(lang, 'deleteConfirm'))) return;

    try {
      await deleteMedia(eventId, mediaId, token);
      setMediaList((prev) => prev.filter((item) => item.id !== mediaId));
      const newStats = await getEventStats(eventId, token);
      setStats(newStats);
    } catch (err) {
      alert(err.message || 'Fehler beim Löschen der Datei.');
    }
  };

  const handleOpenLightbox = (item, index) => {
    setSelectedItem(item);
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  const handleNavigateLightbox = (newIdx) => {
    if (mediaList[newIdx]) {
      setCurrentIndex(newIdx);
      setSelectedItem(mediaList[newIdx]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 space-x-3">
        <Upload className="w-6 h-6 animate-spin text-indigo-500" />
        <span className="font-semibold text-base">{getTranslation(lang, 'loading')}</span>
      </div>
    );
  }

  if (errorMsg || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Header
          lang={lang}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
          onLanguageChange={onLanguageChange}
        />
        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-16 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 shadow-sm">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-['Outfit']">
            Admin-Zugriff fehlgeschlagen
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {errorMsg || 'Ungültiger oder fehlender Admin-Token.'}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased transition-colors duration-200">
      <Header
        eventName={event.name}
        isRevealed={event.isRevealed}
        isAdmin={true}
        lang={lang}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onLanguageChange={onLanguageChange}
        onOpenQr={() => setIsQrOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Sleek Admin Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800/80">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] tracking-tight text-white">
                {event.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center space-x-2">
                <span>Gäste-Link:</span>
                <a
                  href={`/event/${event.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-indigo-300 hover:text-indigo-200 underline flex items-center inline-flex"
                >
                  <span>{event.guestUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </p>
            </div>

            {/* Clean Admin Action Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <a
                href={`/event/${event.id}`}
                className="px-4.5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md transition active:scale-95 border border-indigo-400/30"
              >
                <Camera className="w-4 h-4" />
                <span>Gästeansicht</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>

              <button
                onClick={() => setIsGuestbookOpen(true)}
                className="px-4.5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md transition active:scale-95 border border-amber-400/30"
              >
                <Feather className="w-4 h-4 text-amber-200" />
                <span>Gästebuch Einträge</span>
              </button>

              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md transition active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>PDF-Gästebuch</span>
              </button>

              <button
                onClick={() => setIsThankYouOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Dankeskarte</span>
              </button>

              <button
                onClick={() => setIsQrOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center space-x-2 backdrop-blur-md transition active:scale-95"
              >
                <QrCode className="w-4 h-4" />
                <span>QR-Code</span>
              </button>

              <a
                href={`/api/events/${eventId}/download-all?token=${encodeURIComponent(token)}`}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center space-x-2 backdrop-blur-md transition active:scale-95"
              >
                <Download className="w-4 h-4 text-indigo-300" />
                <span>ZIP Export</span>
              </a>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <StatsCard
              title={getTranslation(lang, 'totalUploads')}
              value={stats.totalUploads}
              subtitle={`${stats.photosCount} Fotos, ${stats.videosCount} Videos`}
              icon={Upload}
              color="indigo"
            />
            <StatsCard
              title={getTranslation(lang, 'uniqueParticipants')}
              value={stats.uniqueParticipantsCount}
              subtitle={stats.guestNames.length > 0 ? `${stats.guestNames.length} Namen eintragen` : 'Gäste'}
              icon={Users}
              color="pink"
              onClick={() => setIsGuestsModalOpen(true)}
            />
            <StatsCard
              title={getTranslation(lang, 'storageUsed')}
              value={`${stats.totalStorageMB} MB`}
              subtitle="Server Speicher"
              icon={HardDrive}
              color="purple"
            />
            <StatsCard
              title="Status"
              value={event.isRevealed ? 'Freigeschaltet' : 'Verschlossen'}
              subtitle={new Date(event.revealDate).toLocaleDateString()}
              icon={Calendar}
              color={event.isRevealed ? 'emerald' : 'amber'}
            />
          </div>
        )}

        {/* Event General Settings Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5 transition-colors duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center">
              <Sliders className="w-5 h-5 mr-2 text-indigo-500" />
              <span>Event-Einstellungen</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Sofort speicherbar</span>
          </div>

          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center">
              <Check className="w-4 h-4 mr-2 text-emerald-600" />
              <span>Einstellungen erfolgreich aktualisiert!</span>
            </div>
          )}

          <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Event Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Enthüllungsdatum
              </label>
              <input
                type="datetime-local"
                value={editRevealDate}
                onChange={(e) => setEditRevealDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Design Theme
              </label>
              <select
                value={editTheme}
                onChange={(e) => setEditTheme(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="classic">Indigo Klassisch</option>
                <option value="boho">Boho Gold</option>
                <option value="romantic">Rose Romance</option>
                <option value="party">Midnight Party</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Max. Uploads / Gast
              </label>
              <input
                type="number"
                min="0"
                value={editMaxUploads}
                onChange={(e) => setEditMaxUploads(e.target.value)}
                placeholder="50"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isUpdating ? 'Speichert...' : getTranslation(lang, 'saveChanges')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Media Management Grid */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" />
              <span>{getTranslation(lang, 'manageMediaTitle')} ({mediaList.length})</span>
            </h2>
          </div>

          <GalleryGrid
            media={mediaList}
            eventId={event.id}
            lang={lang}
            isAdmin={true}
            adminToken={token}
            onItemClick={handleOpenLightbox}
            onDeleteItem={handleDeleteItem}
          />
        </div>
      </main>

      {/* Guests Modal Popup */}
      <GuestsModal
        isOpen={isGuestsModalOpen}
        onClose={() => setIsGuestsModalOpen(false)}
        guestNames={stats?.guestNames || []}
        mediaList={mediaList}
      />

      {/* Admin Guestbook Entries View Modal */}
      <GuestbookModal
        isOpen={isGuestbookOpen}
        onClose={() => setIsGuestbookOpen(false)}
        eventId={event.id}
        eventName={event.name}
        isAdmin={true}
        adminToken={token}
      />

      {/* Lightbox */}
      <LightboxModal
        item={selectedItem}
        mediaList={mediaList}
        currentIndex={currentIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={handleNavigateLightbox}
        lang={lang}
        eventId={event.id}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        qrCodeDataUrl={event.qrCodeDataUrl}
        guestUrl={event.guestUrl}
        eventId={event.id}
        eventName={event.name}
        lang={lang}
      />

      {/* Thank You Card Modal */}
      <ThankYouCardModal
        isOpen={isThankYouOpen}
        onClose={() => setIsThankYouOpen(false)}
        eventName={event.name}
        guestUrl={event.guestUrl}
        lang={lang}
      />

      {/* Printable PDF Guestbook Modal */}
      <GuestbookPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        eventName={event.name}
        mediaList={mediaList}
      />
    </div>
  );
}
