import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video, X, CheckCircle2, User, MessageSquare, AlertCircle, Plus } from 'lucide-react';
import { uploadMedia } from '../utils/api';
import { getTranslation } from '../utils/i18n';

export default function UploadSection({ eventId, lang, onUploadSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [guestName, setGuestName] = useState('');
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setErrorMsg(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...droppedFiles]);
      setErrorMsg(null);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMsg(null);

    try {
      await uploadMedia(eventId, selectedFiles, guestName, caption, (progress) => {
        setUploadProgress(progress);
      });

      setSuccessMsg(true);
      setSelectedFiles([]);
      setCaption('');
      setIsUploading(false);

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setTimeout(() => setSuccessMsg(false), 8000);
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full glass-card rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-['Outfit']">
            Fotos hochladen
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {getTranslation(lang, 'fileSupportText')}
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-3 text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm sm:text-base">
              {getTranslation(lang, 'uploadedSuccessTitle')}
            </h4>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
              {getTranslation(lang, 'uploadedSuccessText')}
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleUploadSubmit} className="space-y-5">
        {/* Drag & Drop Box */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : 'border-slate-700/80 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900/90'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              handleFileChange(e);
              e.target.value = '';
            }}
            multiple
            accept="image/*,video/*"
            className="hidden"
          />
          <div className="mx-auto w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition">
            <Plus className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {getTranslation(lang, 'dragDropText')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Klicke hier oder ziehe deine Dateien hinein
          </p>
        </div>

        {/* File Previews */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
              <span>Ausgewählte Dateien ({selectedFiles.length})</span>
              <button
                type="button"
                onClick={() => setSelectedFiles([])}
                className="text-rose-400 hover:underline"
              >
                Alle entfernen
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1">
              {selectedFiles.map((file, idx) => {
                const isImg = file.type.startsWith('image/');
                const previewUrl = isImg ? URL.createObjectURL(file) : null;

                return (
                  <div
                    key={idx}
                    className="relative group rounded-xl bg-slate-900 border border-slate-800 p-2 flex items-center space-x-2 overflow-hidden"
                  >
                    {isImg ? (
                      <img
                        src={previewUrl}
                        alt="preview"
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                        <Video className="w-5 h-5" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-200 truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
              <User className="w-3.5 h-3.5 mr-1 text-indigo-400" />
              {getTranslation(lang, 'guestNameLabel')}
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder={getTranslation(lang, 'guestNamePlaceholder')}
              className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
              <MessageSquare className="w-3.5 h-3.5 mr-1 text-pink-400" />
              {getTranslation(lang, 'captionLabel')}
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={getTranslation(lang, 'captionPlaceholder')}
              className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>{getTranslation(lang, 'uploadingFiles')}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={selectedFiles.length === 0 || isUploading}
          className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base tracking-wide shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
            selectedFiles.length === 0 || isUploading
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white shadow-indigo-500/25 active:scale-[0.99]'
          }`}
        >
          <UploadCloud className="w-5 h-5" />
          <span>
            {isUploading
              ? `${uploadProgress}%...`
              : selectedFiles.length > 0
              ? `${selectedFiles.length} ${selectedFiles.length === 1 ? 'Datei' : 'Dateien'} hochladen`
              : getTranslation(lang, 'startUploadBtn')}
          </span>
        </button>
      </form>
    </div>
  );
}
