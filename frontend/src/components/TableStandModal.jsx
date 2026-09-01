import React from 'react';
import { X, Printer, Camera, Heart, Sparkles } from 'lucide-react';

export default function TableStandModal({ isOpen, onClose, eventName, qrCodeDataUrl, guestUrl }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn print:p-0 print:bg-white print:static print:inset-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 print:border-0 print:shadow-none print:bg-white print:text-slate-900 print:p-0">
        
        {/* Controls (Hidden during print) */}
        <div className="flex items-center justify-between print:hidden border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-indigo-400" />
            <span>Tischaufsteller-Druckvorlage</span>
          </h3>
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
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Content Area */}
        <div className="border-2 border-dashed border-indigo-500/30 rounded-3xl p-8 bg-gradient-to-b from-slate-900 to-slate-950 print:border-2 print:border-solid print:border-slate-300 print:bg-white print:rounded-2xl print:p-8">
          
          <div className="inline-flex p-3 rounded-full bg-indigo-500/10 text-indigo-400 print:bg-indigo-50 print:text-indigo-600 mb-3">
            <Heart className="w-8 h-8 fill-indigo-500/20" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white print:text-slate-900 tracking-tight">
            {eventName || 'Unser Event'}
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-300 print:text-slate-600 font-medium mt-2 max-w-xs mx-auto">
            Teile deine schönsten Fotos von der Feier mit uns!
          </p>

          {/* QR Code */}
          {qrCodeDataUrl && (
            <div className="bg-white p-4 rounded-2xl inline-block shadow-2xl border border-slate-700 print:border-slate-200 my-6">
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                className="w-52 h-52 sm:w-60 sm:h-60 object-contain mx-auto"
              />
            </div>
          )}

          {/* Instructions Step-by-Step */}
          <div className="space-y-2 text-xs sm:text-sm font-semibold text-slate-200 print:text-slate-700">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">1</span>
              <span>Kamera öffnen & QR-Code scannen</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">2</span>
              <span>Name eingeben & Schnappschüsse hochladen</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 print:text-slate-400 mt-6 font-mono">
            {guestUrl}
          </p>
        </div>

      </div>
    </div>
  );
}
