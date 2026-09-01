import React from 'react';
import { X, Printer, BookOpen, Download, Heart, Mic, User } from 'lucide-react';

export default function GuestbookPdfModal({ isOpen, onClose, eventName, mediaList = [] }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header (Non-printable) */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 print:hidden">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                Druckfertiges PDF-Gästebuch
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vorschau aller Erinnerungen. Klicke unten auf Drucken / Als PDF speichern.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              <span>Drucken / PDF speichern</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Container */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-white text-slate-900 print:p-0 print:overflow-visible print:bg-white print:text-black" id="printable-guestbook">
          
          {/* Guestbook Cover Header */}
          <div className="text-center space-y-3 pb-8 border-b-2 border-slate-900 print:pb-6">
            <div className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-widest border border-slate-300 print:border-black">
              Erinnerungs-Gästebuch
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] tracking-tight text-slate-900 print:text-black">
              {eventName}
            </h1>
            <p className="text-sm font-medium text-slate-600 print:text-slate-800">
              Erstellt mit ❤️ via TokiAlbum | {mediaList.length} Aufnahmen gesammelt
            </p>
          </div>

          {/* Guestbook Media Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
            {mediaList.map((item, index) => (
              <div
                key={item.id || index}
                className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50 print:bg-white print:border-slate-400 print:break-inside-avoid"
              >
                {/* Photo Thumbnail */}
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                  <img
                    src={item.thumbnailUrl || item.fileUrl}
                    alt={item.originalName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-indigo-600 print:text-black" />
                      <span>{item.guestName || 'Gast'}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {item.caption && (
                    <p className="text-slate-700 italic font-medium pt-1">
                      "{item.caption}"
                    </p>
                  )}

                  <div className="flex items-center space-x-3 text-[10px] text-slate-500 pt-1">
                    {item.likesCount > 0 && (
                      <span className="flex items-center space-x-0.5 text-rose-600 font-bold">
                        <Heart className="w-3 h-3 fill-rose-600" />
                        <span>{item.likesCount} Gefällt mir</span>
                      </span>
                    )}
                    {item.hasAudio && (
                      <span className="flex items-center space-x-0.5 text-indigo-600 font-bold">
                        <Mic className="w-3 h-3" />
                        <span>Sprachnachricht</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Page Note */}
          <div className="text-center pt-8 border-t border-slate-200 text-xs text-slate-500 print:pt-4 print:text-[10px]">
            Erstellt mit ❤️ von Soner Çetin | TokiAlbum
          </div>
        </div>

        {/* Action Footer (Non-printable) */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Tipp: Wähle im Druckfenster "Als PDF speichern", um das Buch abzuspeichern!
          </span>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>Jetzt Drucken / Als PDF speichern</span>
          </button>
        </div>
      </div>
    </div>
  );
}
