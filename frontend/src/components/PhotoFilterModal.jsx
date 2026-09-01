import React, { useState, useRef, useEffect } from 'react';
import { X, Wand2, Check, ArrowRight } from 'lucide-react';

const FILTERS = [
  { id: 'normal', name: 'Original', filterStyle: 'none' },
  { id: 'vintage', name: 'Vintage 🎞️', filterStyle: 'sepia(0.5) contrast(1.15) brightness(0.95) saturate(1.2)' },
  { id: 'bw', name: 'B&W 🖤', filterStyle: 'grayscale(1) contrast(1.25)' },
  { id: 'rose', name: 'Rose Glow 🌸', filterStyle: 'hue-rotate(-15deg) saturate(1.3) contrast(1.05) brightness(1.02)' },
  { id: 'vivid', name: 'Vivid ☀️', filterStyle: 'saturate(1.6) contrast(1.1) brightness(1.05)' },
  { id: 'cool', name: 'Cool Film ❄️', filterStyle: 'hue-rotate(20deg) contrast(1.1) brightness(1.05)' }
];

export default function PhotoFilterModal({ isOpen, file, onCancel, onConfirm }) {
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [imageSrc, setImageSrc] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const handleApplyFilter = async () => {
    if (selectedFilter === 'normal') {
      onConfirm(file);
      return;
    }

    setIsProcessing(true);
    try {
      const filterObj = FILTERS.find((f) => f.id === selectedFilter);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      ctx.filter = filterObj.filterStyle;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const rawName = (file && file.name) ? file.name : 'photo.jpg';
          const lastDot = rawName.lastIndexOf('.');
          const baseName = lastDot > 0 ? rawName.substring(0, lastDot) : rawName;
          const fileName = `${baseName}.jpg`;
          const filteredFile = new File([blob], fileName, { type: 'image/jpeg' });
          onConfirm(filteredFile);
        } else {
          onConfirm(file);
        }
        setIsProcessing(false);
      }, 'image/jpeg', 0.92);
    } catch (err) {
      console.error('Filter apply error:', err);
      onConfirm(file);
      setIsProcessing(false);
    }
  };

  const currentFilterStyle = FILTERS.find((f) => f.id === selectedFilter)?.filterStyle || 'none';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <Wand2 className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
              Foto-Filter wählen
            </span>
          </div>

          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Filter Image Preview */}
        <div className="p-4 bg-slate-950 flex items-center justify-center min-h-[260px] aspect-square overflow-hidden relative">
          {imageSrc && (
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Filter Vorschau"
              style={{ filter: currentFilterStyle }}
              className="max-h-[280px] w-auto object-contain rounded-xl shadow-lg transition-all duration-300"
            />
          )}
        </div>

        {/* Filter Selection Pills Bar */}
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center space-x-1 border ${
                  selectedFilter === f.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                {selectedFilter === f.id && <Check className="w-3 h-3 mr-1" />}
                <span>{f.name}</span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
            >
              Abbrechen
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleApplyFilter}
              className="w-2/3 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5"
            >
              <span>{isProcessing ? 'Verarbeite...' : 'Foto hochladen'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
