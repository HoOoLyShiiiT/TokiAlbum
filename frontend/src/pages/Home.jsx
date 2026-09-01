import React, { useState, useEffect } from 'react';
import { Camera, Calendar, Clock, Lock, Sparkles, QrCode, Copy, Check, ArrowRight, Shield, Trash2, ExternalLink, Palette, KeyRound } from 'lucide-react';
import { createEvent, getEventByCode } from '../utils/api';
import { getTranslation } from '../utils/i18n';
import Header from '../components/Header';

export default function Home({ lang, darkMode, onToggleDarkMode, onLanguageChange }) {
  const defaultDate = new Date().toISOString().split('T')[0];
  const defaultReveal = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [name, setName] = useState('');
  const [eventDate, setEventDate] = useState(defaultDate);
  const [revealDate, setRevealDate] = useState(defaultReveal);
  const [theme, setTheme] = useState('classic');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdEvent, setCreatedEvent] = useState(null);
  const [copiedGuest, setCopiedGuest] = useState(false);
  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const [savedEvents, setSavedEvents] = useState([]);

  // Event Code join state
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('knipsen_my_events');
      if (stored) {
        setSavedEvents(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveEventToLocalStorage = (newEvent) => {
    try {
      const stored = localStorage.getItem('knipsen_my_events');
      const list = stored ? JSON.parse(stored) : [];
      const filtered = list.filter((e) => e.id !== newEvent.id);
      const updated = [newEvent, ...filtered];
      localStorage.setItem('knipsen_my_events', JSON.stringify(updated));
      setSavedEvents(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const removeSavedEvent = (id) => {
    try {
      const updated = savedEvents.filter((e) => e.id !== id);
      localStorage.setItem('knipsen_my_events', JSON.stringify(updated));
      setSavedEvents(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    const cleanCode = joinCodeInput.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 5) {
      setJoinError('Bitte gib einen 5-stelligen Event-Code ein.');
      return;
    }

    setJoinLoading(true);
    setJoinError('');

    try {
      const eventData = await getEventByCode(cleanCode);
      if (eventData && eventData.id) {
        window.location.href = `/event/${eventData.id}`;
      }
    } catch (err) {
      setJoinError(err.message || 'Event-Code nicht gefunden.');
      setJoinLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !eventDate || !revealDate) {
      setErrorMsg('Bitte fülle alle Pflichtfelder aus.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const result = await createEvent({
        name,
        eventDate,
        revealDate,
        theme,
        password
      });

      const eventData = {
        id: result.id,
        eventCode: result.eventCode,
        name: result.name,
        eventDate: result.eventDate,
        revealDate: result.revealDate,
        theme: result.theme || 'classic',
        guestUrl: result.guestUrl,
        adminUrl: result.adminUrl,
        adminToken: result.adminToken,
        qrCodeDataUrl: result.qrCodeDataUrl,
        createdAt: new Date().toISOString()
      };

      setCreatedEvent(eventData);
      saveEventToLocalStorage(eventData);
    } catch (err) {
      setErrorMsg(err.message || 'Fehler beim Erstellen des Events.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'guest') {
      setCopiedGuest(true);
      setTimeout(() => setCopiedGuest(false), 2000);
    } else {
      setCopiedAdmin(true);
      setTimeout(() => setCopiedAdmin(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased transition-colors duration-200">
      <Header
        lang={lang}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onLanguageChange={onLanguageChange}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Hero Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TokiAlbum Event Sharing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-slate-900 dark:text-white tracking-tight leading-tight">
            {getTranslation(lang, 'createEventTitle')}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {getTranslation(lang, 'createEventSubtitle')}
          </p>
        </div>

        {/* 🔑 CARD: Mit Event-Code beitreten */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 border border-indigo-800/60 shadow-xl text-white space-y-4 max-w-xl mx-auto">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <KeyRound className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit']">Event-Code eingeben</h3>
              <p className="text-xs text-indigo-200/80">
                Du hast einen 5-stelligen Event-Code erhalten? Gib ihn hier ein:
              </p>
            </div>
          </div>

          <form onSubmit={handleJoinByCode} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              maxLength={5}
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              placeholder="z.B. W3DD2"
              className="flex-1 px-4 py-3 bg-slate-950/80 border border-indigo-700/60 rounded-xl text-center text-lg font-black tracking-widest uppercase text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
            />
            <button
              type="submit"
              disabled={joinLoading}
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-98 flex items-center justify-center space-x-2 flex-shrink-0"
            >
              <span>{joinLoading ? 'Prüfe...' : 'Album beitreten'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {joinError && (
            <p className="text-xs text-rose-300 font-semibold text-center">{joinError}</p>
          )}
        </div>

        {/* Display newly created event */}
        {createdEvent ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 animate-fadeIn">
            <div className="text-center space-y-1">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-['Outfit']">
                {getTranslation(lang, 'eventCreatedTitle')}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Event: <strong className="text-slate-900 dark:text-white">{createdEvent.name}</strong>
              </p>
              <div className="inline-block mt-1 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black tracking-widest border border-indigo-200 dark:border-indigo-800">
                Event-Code: {createdEvent.eventCode}
              </div>
            </div>

            {/* QR & Guest Link */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 text-center sm:text-left">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <QrCode className="w-4 h-4" />
                <span>{getTranslation(lang, 'guestLinkTitle')}</span>
              </div>

              {createdEvent.qrCodeDataUrl && (
                <div className="bg-white p-3 rounded-xl inline-block mx-auto shadow-md text-center space-y-2">
                  <img
                    src={createdEvent.qrCodeDataUrl}
                    alt="QR Code"
                    className="w-44 h-44 object-contain mx-auto"
                  />
                  <div className="text-xs font-extrabold font-mono text-slate-900 tracking-wider">
                    Code: {createdEvent.eventCode}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={createdEvent.guestUrl}
                  className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 select-all truncate"
                />
                <button
                  onClick={() => copyToClipboard(createdEvent.guestUrl, 'guest')}
                  className="px-3.5 py-2 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 transition flex-shrink-0"
                >
                  {copiedGuest ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedGuest ? getTranslation(lang, 'copied') : getTranslation(lang, 'copy')}</span>
                </button>
              </div>
            </div>

            {/* Admin Link */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                <Shield className="w-4 h-4" />
                <span>{getTranslation(lang, 'adminLinkTitle')}</span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={createdEvent.adminUrl}
                  className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-mono text-amber-800 dark:text-amber-200 select-all truncate"
                />
                <button
                  onClick={() => copyToClipboard(createdEvent.adminUrl, 'admin')}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 transition flex-shrink-0"
                >
                  {copiedAdmin ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedAdmin ? getTranslation(lang, 'copied') : getTranslation(lang, 'copy')}</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`/event/${createdEvent.id}`}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-center font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition"
              >
                <span>{getTranslation(lang, 'goToGuestPage')}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={createdEvent.adminUrl}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-center font-bold text-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center space-x-2 transition"
              >
                <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{getTranslation(lang, 'goToAdminPage')}</span>
              </a>
              <button
                type="button"
                onClick={() => setCreatedEvent(null)}
                className="py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold"
              >
                Neues Event erstellen
              </button>
            </div>
          </div>
        ) : (
          /* Event Form */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {getTranslation(lang, 'eventNameLabel')} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={getTranslation(lang, 'eventNamePlaceholder')}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400 transition"
                />
              </div>

              {/* Event Date & Reveal Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                    {getTranslation(lang, 'eventDateLabel')} *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-pink-500" />
                    {getTranslation(lang, 'revealDateLabel')} *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={revealDate}
                    onChange={(e) => setRevealDate(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-400 transition"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    {getTranslation(lang, 'revealDateHelp')}
                  </p>
                </div>
              </div>

              {/* Design Theme Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                  <Palette className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                  Event Design-Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'classic', label: 'Indigo Klassisch', color: 'from-indigo-600 to-indigo-900' },
                    { id: 'boho', label: 'Boho Gold', color: 'from-amber-500 to-amber-900' },
                    { id: 'romantic', label: 'Rose Romance', color: 'from-pink-500 to-rose-900' },
                    { id: 'party', label: 'Midnight Party', color: 'from-purple-600 to-slate-900' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                        theme === item.id
                          ? 'border-indigo-600 dark:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-full h-3 rounded-lg bg-gradient-to-r ${item.color} mb-2`} />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Password Optional */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                  {getTranslation(lang, 'adminPasswordLabel')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={getTranslation(lang, 'adminPasswordPlaceholder')}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400 transition"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold text-base shadow-md transition active:scale-[0.99] flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>{loading ? 'Wird erstellt...' : getTranslation(lang, 'createButton')}</span>
              </button>
            </form>
          </div>
        )}

        {/* Saved Events History */}
        {savedEvents.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
              <span>Deine erstellten Events ({savedEvents.length})</span>
            </h2>

            <div className="space-y-3">
              {savedEvents.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.name}</h3>
                      {item.eventCode && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black tracking-wider border border-indigo-200 dark:border-indigo-800">
                          Code: {item.eventCode}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Event: {item.eventDate} | Enthüllung: {new Date(item.revealDate).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <a
                      href={`/event/${item.id}`}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold flex items-center justify-center space-x-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Gäste-Seite</span>
                    </a>
                    <a
                      href={item.adminUrl}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold flex items-center justify-center space-x-1"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </a>
                    <button
                      onClick={() => removeSavedEvent(item.id)}
                      className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 transition"
                      title="Aus Liste entfernen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
