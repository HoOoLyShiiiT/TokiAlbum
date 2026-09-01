import React, { useState } from 'react';
import { X, Heart, Copy, Check, Share2, Sparkles, MessageCircle } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export default function ThankYouCardModal({ isOpen, onClose, eventName, guestUrl, lang }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const thankYouText = `Vielen Dank für die wunderschönen Momente bei ${eventName}! 💍❤️\n\nDu kannst dir jetzt alle freigeschalteten Fotos unserer Feier ansehen & herunterladen:\n${guestUrl}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(thankYouText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50">
          <Heart className="w-8 h-8 fill-rose-500/20" />
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
            Digitales Dankeskärtchen
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sende diese Nachricht nach der Feier per WhatsApp oder E-Mail an deine Gäste.
          </p>
        </div>

        {/* Preview Card Box */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-left space-y-3 font-sans">
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
            {thankYouText}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCopyText}
          className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
        >
          {copied ? <Check className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
          <span>{copied ? 'Text kopiert!' : 'Text für WhatsApp / E-Mail kopieren'}</span>
        </button>

      </div>
    </div>
  );
}
