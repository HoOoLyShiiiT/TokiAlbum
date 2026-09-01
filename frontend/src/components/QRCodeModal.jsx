import React, { useState } from 'react';
import { X, QrCode, Copy, Check, Download, ExternalLink, KeyRound } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export default function QRCodeModal({
  isOpen,
  onClose,
  qrCodeDataUrl,
  guestUrl,
  eventId,
  eventCode,
  eventName,
  lang
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(guestUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const qrDownloadUrl = `/api/events/${eventId}/qr`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-3 border border-indigo-500/20">
          <QrCode className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white font-['Outfit']">
          {eventName || 'Event QR-Code'}
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          Gäste scannen diesen Code oder geben den 5-stelligen Event-Code ein.
        </p>

        {/* QR Code Container */}
        {qrCodeDataUrl && (
          <div className="bg-white p-4 rounded-2xl inline-block shadow-xl border border-slate-700 mb-4 text-center space-y-2">
            <img
              src={qrCodeDataUrl}
              alt="Event QR Code"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain mx-auto"
            />
            {eventCode && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-sm tracking-widest uppercase">
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                <span>Code: {eventCode}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={qrDownloadUrl}
            download={`QR_${eventName ? eventName.replace(/[^a-zA-Z0-9_-]/g, '_') : 'Event'}.png`}
            className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>{getTranslation(lang, 'downloadQrBtn')}</span>
          </a>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={guestUrl}
              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono select-all truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1 transition flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? getTranslation(lang, 'copied') : getTranslation(lang, 'copy')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
