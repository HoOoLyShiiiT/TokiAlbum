import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Heart, Feather, CheckCircle2, Lock, Edit3, Trash2, Eye } from 'lucide-react';
import { getGuestbookEntries, addGuestbookEntry, deleteGuestbookEntry } from '../utils/api';

export default function GuestbookModal({ isOpen, onClose, eventId, eventName, defaultGuestName = '', isAdmin = false, adminToken = '' }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(defaultGuestName || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mySavedEntry, setMySavedEntry] = useState(null);
  const [showAdminOverview, setShowAdminOverview] = useState(false);

  const loadEntries = async () => {
    if (!eventId) return;
    try {
      setLoading(true);
      const res = await getGuestbookEntries(eventId);
      const allEntries = res.entries || [];
      setEntries(allEntries);

      // Check if current guest already wrote an entry
      const savedName = localStorage.getItem(`knipsen_guest_name_${eventId}`) || defaultGuestName;
      if (savedName) {
        const found = allEntries.find(
          (e) => e.guestName && e.guestName.trim().toLowerCase() === savedName.trim().toLowerCase()
        );
        if (found) {
          setMySavedEntry(found);
        }
      }
    } catch (err) {
      console.error('Error loading guestbook:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadEntries();
      setName(defaultGuestName || localStorage.getItem(`knipsen_guest_name_${eventId}`) || '');
      setErrorMsg('');
    }
  }, [isOpen, eventId, defaultGuestName]);

  const handleStartEdit = () => {
    if (mySavedEntry) {
      setName(mySavedEntry.guestName || name);
      setMessage(mySavedEntry.message || '');
    }
    setMySavedEntry(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setErrorMsg('Bitte gib deinen Namen und deine Zeilen ein.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await addGuestbookEntry(eventId, name.trim(), message.trim());
      if (res && res.entry) {
        setMySavedEntry(res.entry);
        setEntries((prev) => [res.entry, ...prev.filter((e) => e.id !== res.entry.id)]);
      }
      setMessage('');
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      setErrorMsg(err.message || 'Fehler beim Speichern.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (entryId) => {
    if (!window.confirm('Eintrag wirklich aus dem Gästebuch löschen?')) return;
    try {
      await deleteGuestbookEntry(eventId, entryId, adminToken);
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
      if (mySavedEntry && mySavedEntry.id === entryId) {
        setMySavedEntry(null);
      }
    } catch (err) {
      alert(err.message || 'Fehler beim Löschen.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 animate-fadeIn">
      
      {/* Elegant Wedding Stationery Card (Bespoke Linen & Gold Frame) */}
      <div className="relative w-full max-w-xl bg-[#FAF7F2] text-stone-900 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] max-h-[90vh] flex flex-col space-y-6 overflow-hidden">
        
        {/* Decorative Gold Filigree Border Inside */}
        <div className="absolute inset-3 border border-amber-400/40 rounded-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Royal Wedding Stationery Seal */}
        <div className="text-center pt-2 space-y-2 relative z-10">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100 flex items-center justify-center mx-auto shadow-md border-2 border-amber-300">
            <Heart className="w-6 h-6 fill-amber-200 text-amber-100" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-amber-950 font-bold tracking-tight">
            Gästebuch der Wünsche
          </h2>
          <p className="text-xs text-stone-500 font-serif italic max-w-xs mx-auto">
            „Deine Worte sind vertraulich & bleiben ein persönliches Geschenk an das Brautpaar.“
          </p>
        </div>

        {/* Admin Overview Toggle (If Admin) */}
        {isAdmin && (
          <div className="flex justify-end pt-1 relative z-10">
            <button
              onClick={() => setShowAdminOverview(!showAdminOverview)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-900 text-amber-100 font-bold text-xs shadow-xs hover:bg-amber-950 transition flex items-center space-x-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>{showAdminOverview ? 'Schreib-Karte' : `Alle Einträge ansehen (${entries.length})`}</span>
            </button>
          </div>
        )}

        {/* Main Content */}
        {showAdminOverview && isAdmin ? (

          /* ADMIN VIEW: CLEAN LIST OF ALL MESSAGES */
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 pt-2 relative z-10">
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider font-['Outfit'] mb-2">
              Alle Gästebucheinträge ({entries.length})
            </h3>
            {entries.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-6 text-center">Noch keine Einträge vorhanden.</p>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-white/90 border border-amber-200/80 rounded-2xl space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs text-stone-500 font-semibold border-b border-amber-100 pb-1.5">
                    <span className="font-bold text-amber-950 text-sm">{entry.guestName}</span>
                    <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-serif italic text-stone-800 leading-relaxed">
                    „{entry.message}“
                  </p>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-xs text-rose-600 font-bold flex items-center space-x-1 hover:underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Löschen</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        ) : (

          /* GUEST VIEW: ELEGANT STATIONERY FORM OR SAVED LETTER */
          <div className="flex-1 flex flex-col justify-between space-y-4 overflow-y-auto pr-1 relative z-10">
            
            {mySavedEntry ? (

              /* ALREADY SUBMITTED: ELEGANT SAVED LETTER CARD */
              <div className="space-y-5 my-auto py-2 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center space-x-2 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Deine Glückwünsche wurden im Gästebuch verewigt! ✨</span>
                </div>

                {/* Framed Parchment Letter Card */}
                <div className="p-6 bg-white/90 border border-amber-300/70 rounded-2xl space-y-3 shadow-sm relative">
                  <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider font-['Outfit']">
                      Deine Worte an das Brautpaar
                    </span>
                    <span className="text-[11px] font-serif italic text-stone-400">
                      {new Date(mySavedEntry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-lg font-serif font-bold text-amber-950">
                    Von: {mySavedEntry.guestName}
                  </h4>
                  <p className="text-base sm:text-lg font-serif italic text-stone-900 leading-relaxed pl-3 border-l-2 border-amber-500 py-1">
                    „{mySavedEntry.message}“
                  </p>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={handleStartEdit}
                    className="text-xs font-bold text-amber-900 hover:text-amber-950 underline inline-flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Eintrag bearbeiten / korrigieren</span>
                  </button>
                </div>
              </div>

            ) : (

              /* FORM: BESPOKE STATIONERY WRITING SURFACE */
              <form onSubmit={handleSubmit} className="space-y-5 my-auto">
                {errorMsg && (
                  <p className="text-xs text-rose-700 font-bold bg-rose-50 p-3 rounded-xl border border-rose-200">
                    {errorMsg}
                  </p>
                )}

                <div className="space-y-4">
                  {/* Name Input Line */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 font-['Outfit']">
                      Dein Name / Namen *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="z.B. Markus & Sarah"
                      className="w-full px-3 py-2 bg-transparent border-b-2 border-amber-400 font-serif font-bold text-base text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 transition"
                    />
                  </div>

                  {/* Message Writing Area */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 font-['Outfit']">
                      Deine Zeilen an das Brautpaar *
                    </label>
                    <textarea
                      required
                      rows="5"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Schreibe hier deine persönlichen Wünsche, Zeilen oder Gedanken..."
                      className="w-full px-3 py-2 bg-white/70 border border-amber-300/80 rounded-2xl text-base sm:text-lg font-serif italic text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 transition leading-relaxed resize-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 hover:from-amber-600 hover:to-amber-900 text-white font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center space-x-2 border border-amber-400/40"
                  >
                    <Feather className="w-4 h-4 text-amber-200" />
                    <span>{isSubmitting ? 'Wird im Buch verewigt...' : 'Glückwünsche im Gästebuch verewigen ✨'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
