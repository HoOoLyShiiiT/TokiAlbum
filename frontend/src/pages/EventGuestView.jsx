import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Camera, Image as ImageIcon, QrCode, User, Edit2, Lock, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, Smile, Mic, Square, Trash2, Shield, Target, X, Sparkles, BookOpen } from 'lucide-react';
import IosThemeToggle from '../components/IosThemeToggle';
import CountdownTimer from '../components/CountdownTimer';
import GalleryGrid from '../components/GalleryGrid';
import LightboxModal from '../components/LightboxModal';
import QRCodeModal from '../components/QRCodeModal';
import WelcomeSplash from '../components/WelcomeSplash';
import FloatingBottomNav from '../components/FloatingBottomNav';
import PhotographerRanking from '../components/PhotographerRanking';
import RankingModal from '../components/RankingModal';
import GuestbookModal from '../components/GuestbookModal';
import { getEventDetails, getEventMedia, uploadMedia, deleteMedia } from '../utils/api';
import { getTranslation } from '../utils/i18n';

const MISSIONS_POOL = [
  // Grimassen & Lustige Gesichter (Funny Faces & Grimaces)
  { emoji: '🤪', text: 'Mach ein Foto von 3 Personen, die ihre verrückteste Grimasse schneiden!' },
  { emoji: '😜', text: 'Fotografiere jemanden, der überrascht die Zunge herausstreckt!' },
  { emoji: '😲', text: 'Mach ein Foto von jemandem mit einem spektakulär schockierten Blick!' },
  { emoji: '🤓', text: 'Fotografiere jemanden, der eine Sonnenbrille oder verrückte Brille verkehrt herum trägt!' },
  { emoji: '🥸', text: 'Schnapp dir eine Brille oder Accessoire und mach das lustigste Agenten-Foto des Abends.' },
  { emoji: '🧐', text: 'Fotografiere jemanden, der so tut als würde er das Essen wie ein 5-Sterne-Kritiker prüfen.' },
  { emoji: '🤣', text: 'Fotografiere jemanden mitten im herzlichsten Lachen!' },
  { emoji: '😉', text: 'Mach ein Foto von jemandem, der schauspielerisch einen frechen Zwinkerer abgibt.' },
  { emoji: '😴', text: 'Fotografiere jemanden, der so tut als würde er tief und fest schlafen.' },
  { emoji: '😯', text: 'Mach ein Foto von 2 Personen, die sich völlig entsetzt anschauen!' },
  { emoji: '🤯', text: 'Fotografiere den Blick von jemandem, dessen Verstand gerade schmelzen würde.' },
  { emoji: '🥳', text: 'Mach ein Foto von der lustigsten Party-Fratze auf der Tanzfläche!' },

  // Brillen, Outfits & Posen (Glasses, Outfits & Poses)
  { emoji: '🕶️', text: 'Mach ein cooles "Men in Black"-Gruppenfoto mit Sonnenbrillen drinnen!' },
  { emoji: '👑', text: 'Fotografiere die selbsternannte "Königin" oder den "König" der Feier!' },
  { emoji: '🎩', text: 'Mach ein Bild von jemandem, der besonders edel oder gentleman-mäßig posiert.' },
  { emoji: '🎀', text: 'Fotografiere jemanden, der seine Krawatte oder Fliege schief trägt.' },
  { emoji: '🪩', text: 'Schnapp dir 2 Gäste und lasst euch wie 70er Disco-Stars ablichten!' },
  { emoji: '💍', text: 'Fotografiere jemanden, der ganz stolz seinen Schmuck oder Ring präsentiert.' },
  { emoji: '💄', text: 'Fotografiere jemanden, der sich gerade für das nächste Foto herausputzt.' },

  // Posen & Action (Poses & Stunts)
  { emoji: '🦸‍♂️', text: 'Mach ein Foto von 3 Gästen in ihrer besten Superhelden-Landepose!' },
  { emoji: '🕺', text: 'Fotografiere den absolut spektakulärsten Tanzmove auf der Tanzfläche!' },
  { emoji: '💃', text: 'Fotografiere 2 Personen bei einer dramatischen Tanz-Hebefigur oder Drehung!' },
  { emoji: '🥷', text: 'Mach ein Foto von jemandem, der sich wie ein Ninja im Hintergrund anpirscht!' },
  { emoji: '📸', text: 'Fotografiere einen anderen Fotografen, der gerade angestrengt ein Foto macht!' },
  { emoji: '💣', text: 'Mache ein Photo-Bomb Bild! Schleich dich heimlich ins Bild von anderen.' },
  { emoji: '👯‍♀️', text: 'Fotografiere 2 Gäste, die exakt dieselbe Pose wie Statuen einnehmen!' },
  { emoji: '💪', text: 'Mach ein Foto von jemandem, der extrem motiviert seine Muskeln spielen lässt.' },
  { emoji: '🎸', text: 'Fotografiere jemanden, der eine mitreißende Luftgitarren-Show ablifert!' },
  { emoji: '🎤', text: 'Mach ein Foto von jemandem, der so tut als würde er mit der Gabel als Mikrofon singen.' },
  { emoji: '🧘‍♀️', text: 'Fotografiere jemanden, der mitten im Partytrubel versucht zu meditieren.' },
  { emoji: '🏋️‍♂️', text: 'Mach ein Foto von jemandem, der so tut als wäre ein Stuhl oder Tisch riesenschwer.' },
  { emoji: '🏃‍♂️', text: 'Fotografiere jemanden in Zeitlupen-Action-Pose!' },

  // Feiern & Anstoßen (Toasts & Drinks)
  { emoji: '🥂', text: 'Stoße mit deinen Tischnachbarn an und mach im Moment des Klinkens ein Foto!' },
  { emoji: '🍻', text: 'Mach ein spektakuläres Gruppen-Anstoßen mit mindestens 5 Gläsern!' },
  { emoji: '🍷', text: 'Fotografiere jemanden, der am Glas nippt wie ein professioneller Sommelier.' },
  { emoji: '🍹', text: 'Mach ein Foto vom buntesten oder leckersten Cocktail des Abends.' },
  { emoji: '🍾', text: 'Mach ein Foto im exakten Moment eines Prosts auf das Brautpaar!' },
  { emoji: '🧊', text: 'Fotografiere jemanden, der sich mit einem kalten Getränk die Stirn kühlt.' },

  // Essen, Torte & Genuss (Food & Cake)
  { emoji: '🍰', text: 'Fotografiere jemanden mit einem riesigen Stück Hochzeitstorte im Mund!' },
  { emoji: '😋', text: 'Mach ein Foto von jemandem, der vor dem Buffet gierig die Lippen leckt.' },
  { emoji: '🍇', text: 'Fotografiere jemanden, der versucht eine Traube oder Nuss in der Luft zu fangen.' },
  { emoji: '🍕', text: 'Mach ein Foto von dem ersten Gast, der sich Nachschlag am Buffet holt.' },
  { emoji: '☕', text: 'Fotografiere jemanden, der nach dem Essen genüsslich seinen Kaffee schlürft.' },
  { emoji: '🧁', text: 'Mach ein Nahaufnahme-Foto von der hübschesten Süßigkeit der Candybar.' },

  // Brautpaar & Romantik (Romance)
  { emoji: '❤️', text: 'Fotografiere das Brautpaar in einem romantischen, unbeobachteten Moment.' },
  { emoji: '👩‍❤️‍👨', text: 'Mach ein Foto von einem Paar auf der Feier, das sich tief in die Augen schaut.' },
  { emoji: '👩‍❤️‍💋‍👨', text: 'Fotografiere den schönsten Kuss des Abends!' },
  { emoji: '💐', text: 'Mach ein wunderschönes Foto vom Brautstrauß im Scheinwerferlicht.' },
  { emoji: '💌', text: 'Fotografiere jemanden, der gerade eine liebevolle Zeile ins Gästebuch schreibt.' },
  { emoji: '🕯️', text: 'Mach ein stimmungsvolles Foto von einer Kerze oder Tischdekoration.' },

  // Gruppe & Gesellschaft (Group Fun)
  { emoji: '🤳', text: 'Mach ein Gruppen-Selfie mit mindestens 6 Personen!' },
  { emoji: '👨‍👩‍👧‍👦', text: 'Fotografiere 3 Generationen, die zusammen auf der Feier lachen.' },
  { emoji: '🤝', text: 'Mach ein Foto von 2 Gästen, die sich heute Abend zum ersten Mal kennengelernt haben.' },
  { emoji: '👵', text: 'Mach ein Foto vom ältesten und jüngsten Gast beim gemeinsamen Lachen.' },
  { emoji: '🗣️', text: 'Fotografiere 2 Personen bei einer hochintensiven Diskussion über Essen oder Musik.' },
  { emoji: '🤫', text: 'Mach ein Foto von jemandem, der gerade ein lustiges Geheimnis zuflüstert.' },
  { emoji: '🤗', text: 'Fotografiere eine herzliche Umarmung zwischen zwei Freunden.' },
  { emoji: '🖐️', text: 'Mach ein High-Five Foto im Moment des Zusammenpralls der Hände!' },

  // Partystimmung & Tanzfläche (Party Vibe)
  { emoji: '🎉', text: 'Mach ein Foto von 4 Personen, die gleichzeitig die Hände in die Luft werfen!' },
  { emoji: '🎶', text: 'Fotografiere den DJ oder die Band bei ihrem mitreißendsten Song!' },
  { emoji: '🔊', text: 'Mach ein Foto von jemandem, der völlig in der Musik versinkt und mitsingt.' },
  { emoji: '✨', text: 'Fotografiere den glitzerndsten Partymoment auf der Tanzfläche!' },
  { emoji: '👏', text: 'Mach ein Foto von den Gästen, die begeistert Applaus klatschen!' },
  { emoji: '🎤', text: 'Fotografiere den "Lead-Sänger" der Runde, der den Song lautstark mitsingt.' },

  // Kreativ & Lustig (Creative Challenges)
  { emoji: '🔎', text: 'Mach ein Foto, auf dem man nur die Augen von 3 Personen sieht!' },
  { emoji: '👤', text: 'Fotografiere den Schatten einer tanzenden Person an der Wand.' },
  { emoji: '🎭', text: 'Mach ein Foto, bei dem 2 Personen die Rollen tauschen und sich nachmachen.' },
  { emoji: '📐', text: 'Mach ein Foto mit einer extremen Perspektive von ganz weit unten!' },
  { emoji: '🔮', text: 'Fotografiere jemanden, der so tut als würde er die Zukunft im Glas lesen.' },
  { emoji: '🏆', text: 'Mach ein Siegermotiv-Foto vom "Champion" der Tanzfläche.' },
  { emoji: '🎩', text: 'Fotografiere den charmantesten Lächeler des Abends.' },

  // Emotionen & Glücksmomente (Emotions)
  { emoji: '🥹', text: 'Mach ein Foto von jemandem mit echten Freudentränen oder Rührung!' },
  { emoji: '😃', text: 'Fotografiere das breiteste Grinsen auf der gesamten Feier.' },
  { emoji: '👏', text: 'Mach ein Foto von jemandem, der vor Begeisterung aufsteht.' },
  { emoji: '🌟', text: 'Fotografiere ein strahlendes Gesicht beim Anschneiden der Torte.' },
  { emoji: '💖', text: 'Mach ein Foto von 2 Personen, die mit den Händen ein Herz formen.' },

  // Lustige Situationen (Humor)
  { emoji: '🕵️‍♂️', text: 'Mach ein Spionage-Foto von jemandem, der heimlich am Dessert nascht!' },
  { emoji: '🥱', text: 'Fotografiere den ersten Gast, der heimlich gähnt!' },
  { emoji: '🥤', text: 'Mach ein Foto von jemandem, der 2 Getränke gleichzeitig in der Hand hält.' },
  { emoji: '👔', text: 'Fotografiere jemanden, der sich die Ärmel hochkrempelt und bereit für die Party ist!' },
  { emoji: '📸', text: 'Mach ein Foto von jemandem, der gerade sein Smartphone nach Fotos durchsucht.' },
  { emoji: '🎁', text: 'Fotografiere den Geschenketisch oder die kreativste Karte.' },

  // Late Night Party
  { emoji: '🌙', text: 'Mach ein Foto vom stimmungsvollsten Lichterschein der Nacht.' },
  { emoji: '👟', text: 'Fotografiere jemanden, der die schicken Schuhe gegen bequeme Treter getauscht hat.' },
  { emoji: '🎆', text: 'Mach ein Foto von den letzten Stehaufmännchen auf der Tanzfläche!' },
  { emoji: '💬', text: 'Fotografiere die lustigste Tischgruppe bei den späten Nachtgesprächen.' },
  { emoji: '💤', text: 'Mach ein Foto von jemandem, der erschöpft aber glücklich auf dem Stuhl lehnt.' },
  { emoji: '🥂', text: 'Mach ein Abschluss-Foto: Stoße auf einen unvergesslichen Abend an!' }
];

export default function EventGuestView({ eventId, lang, darkMode, onToggleDarkMode, onLanguageChange }) {
  const [event, setEvent] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Guest Name & Step State
  const [showSplash, setShowSplash] = useState(() => {
    return !localStorage.getItem(`knipsen_splash_seen_${eventId}`);
  });

  const handleSplashComplete = () => {
    localStorage.setItem(`knipsen_splash_seen_${eventId}`, 'true');
    setShowSplash(false);
  };

  const [guestName, setGuestName] = useState(() => {
    return localStorage.getItem(`knipsen_guest_name_${eventId}`) || '';
  });
  const [guestStep, setGuestStep] = useState(() => {
    const savedName = localStorage.getItem(`knipsen_guest_name_${eventId}`);
    return savedName ? 'album' : 'name';
  });
  const [nameInput, setNameInput] = useState(guestName);
  const [myUploadedIds, setMyUploadedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`knipsen_my_uploaded_ids_${eventId}`) || '[]');
    } catch (e) {
      return [];
    }
  });

  // Upload States
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Mission Modal State
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [currentMission, setCurrentMission] = useState(MISSIONS_POOL[0]);

  // Guestbook Modal State
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);

  // Ranking Modal State
  const [isRankingOpen, setIsRankingOpen] = useState(false);

  // Audio Recorder States
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Hidden File Inputs
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Lightbox States
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEventDetails(eventId);
      setEvent(data);
      setIsRevealed(data.isRevealed);

      const mediaRes = await getEventMedia(eventId);
      setMediaList(mediaRes.media || []);
    } catch (err) {
      console.error('Error loading guest view:', err);
      setErrorMsg(err.message || 'Event konnte nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Admin Button Handler
  const handleHiddenAdminClick = () => {
    try {
      const stored = localStorage.getItem('knipsen_my_events');
      const list = stored ? JSON.parse(stored) : [];
      const matched = list.find((e) => e.id === eventId);

      if (matched && matched.adminToken) {
        window.location.href = `/admin/${eventId}?token=${matched.adminToken}`;
        return;
      }
    } catch (e) {
      console.error(e);
    }

    const inputToken = prompt('Admin-Zugang: Bitte gib deinen Admin-Token ein:');
    if (inputToken && inputToken.trim()) {
      window.location.href = `/admin/${eventId}?token=${encodeURIComponent(inputToken.trim())}`;
    }
  };

  // Draw Random Mission
  const handleDrawMission = () => {
    const nextIdx = Math.floor(Math.random() * MISSIONS_POOL.length);
    setCurrentMission(MISSIONS_POOL[nextIdx]);
    setIsMissionModalOpen(true);
  };

  const handleFulfillMission = () => {
    setCaption(`[Mission] ${currentMission.text}`);
    setIsMissionModalOpen(false);
    cameraInputRef.current?.click();
  };

  // Handle Step 1 Name Submit
  const handleNameSubmit = (e) => {
    e.preventDefault();
    const nameToSave = nameInput.trim() || 'Gast';
    setGuestName(nameToSave);
    localStorage.setItem(`knipsen_guest_name_${eventId}`, nameToSave);
    setGuestStep('album');
  };

  const handleSkipName = () => {
    const anonName = 'Gast';
    setGuestName(anonName);
    localStorage.setItem(`knipsen_guest_name_${eventId}`, anonName);
    setGuestStep('album');
  };

  // Direct file selection and upload
  const handleRawFileSelection = (files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    executeUpload(fileArray);
  };

  const executeUpload = async (fileArray) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');

    try {
      const res = await uploadMedia(eventId, fileArray, guestName || 'Gast', caption, audioBlob, (progress) => {
        setUploadProgress(progress);
      });

      if (res && res.items && res.items.length > 0) {
        const newIds = res.items.map(i => i.id);
        const stored = JSON.parse(localStorage.getItem(`knipsen_my_uploaded_ids_${eventId}`) || '[]');
        const updated = Array.from(new Set([...stored, ...newIds]));
        localStorage.setItem(`knipsen_my_uploaded_ids_${eventId}`, JSON.stringify(updated));
        setMyUploadedIds(updated);
      }

      setUploadSuccess(true);
      setCaption('');
      setAudioBlob(null);
      setIsUploading(false);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });

      const mediaRes = await getEventMedia(eventId);
      setMediaList(mediaRes.media || []);

      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Upload fehlgeschlagen.');
      setIsUploading(false);
    }
  };

  const handleDeleteGuestMedia = async (mediaId) => {
    try {
      await deleteMedia(eventId, mediaId, '', guestName);

      const stored = JSON.parse(localStorage.getItem(`knipsen_my_uploaded_ids_${eventId}`) || '[]');
      const updated = stored.filter(id => id !== mediaId);
      localStorage.setItem(`knipsen_my_uploaded_ids_${eventId}`, JSON.stringify(updated));
      setMyUploadedIds(updated);

      setMediaList(prev => prev.filter(m => m.id !== mediaId));
      if (isLightboxOpen && selectedItem?.id === mediaId) {
        setIsLightboxOpen(false);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Fehler beim Löschen des Fotos.');
    }
  };

  const handleRevealExpire = () => {
    setIsRevealed(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    getEventMedia(eventId).then((res) => setMediaList(res.media || [])).catch(() => {});
  };

  const handleOpenLightbox = (item, index) => {
    const currentSessionId = typeof localStorage !== 'undefined' ? localStorage.getItem('knipsen_session_id') : null;
    const isOwnPhoto = Boolean(
      (item.sessionId && currentSessionId && item.sessionId === currentSessionId) ||
      (myUploadedIds && myUploadedIds.includes(item.id)) ||
      (item.guestName && guestName && item.guestName.trim().toLowerCase() === guestName.trim().toLowerCase() && item.guestName.trim().toLowerCase() !== 'gast')
    );

    if (!isRevealed && !isOwnPhoto) return;

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
        <span className="text-sm font-medium">{getTranslation(lang, 'loading')}</span>
      </div>
    );
  }

  if (errorMsg || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-500 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">Event nicht gefunden</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{errorMsg}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased transition-colors duration-200 pb-20">
      
      {/* Animated Welcome Splash Overlay when scanning QR or opening event */}
      {showSplash && (
        <WelcomeSplash
          eventName={event?.name}
          onComplete={handleSplashComplete}
        />
      )}

      {/* Top Bar with Admin Shield on Left, QR & iPhone Theme Slider on Right */}
      <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-2 flex items-center justify-between">
        {/* Admin Button at TOP LEFT */}
        <button
          type="button"
          onClick={handleHiddenAdminClick}
          className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center space-x-1"
          title="Admin-Bereich"
        >
          <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-semibold hidden sm:inline">Admin</span>
        </button>

        {/* Right Controls: QR Button & iPhone Theme Slider */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={() => setIsQrOpen(true)}
            className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            title="QR-Code anzeigen"
          >
            <QrCode className="w-4.5 h-4.5 text-slate-600 dark:text-slate-300" />
          </button>

          {/* iPhone Slider Toggle */}
          <IosThemeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
        </div>
      </div>

      <main className="flex-1 max-w-xl w-full mx-auto px-4 pb-12">

        {/* Hidden Native File Inputs */}
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*,video/*"
          capture="environment"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleRawFileSelection(e.target.files);
            }
            e.target.value = '';
          }}
          className="hidden"
        />
        <input
          type="file"
          ref={galleryInputRef}
          accept="image/*,video/*"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleRawFileSelection(e.target.files);
            }
            e.target.value = '';
          }}
          className="hidden"
        />

        {/* STEP 1: NAME QUESTION */}
        {guestStep === 'name' ? (
          <div className="w-full my-auto space-y-6 animate-fadeIn py-8">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center mx-auto shadow-md border border-slate-800">
                <Smile className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-slate-900 dark:text-white tracking-tight">
                {event.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Willkommen beim Fotoalbum! Bitte verrate uns deinen Namen, bevor du Schnappschüsse teilst.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <form onSubmit={handleNameSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Wie heißt du? *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="z.B. Laura & Thomas"
                    className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center space-x-2"
                >
                  <span>Weiter zum Fotoalbum</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleSkipName}
                  className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 underline"
                >
                  Anonym fortfahren
                </button>
              </div>
            </div>
          </div>
        ) : (

          /* STEP 2: ALBUM & GALLERY SCREEN */
          <div className="space-y-4 animate-fadeIn">
            
            {/* Centered Title & Greeting Header */}
            <div className="text-center space-y-1 border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-slate-900 dark:text-white tracking-tight">
                {event.name}
              </h1>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Hallo, <strong className="text-slate-800 dark:text-slate-200 font-semibold">{guestName}</strong>! 👋
                </span>
                <button
                  onClick={() => {
                    setNameInput(guestName);
                    setGuestStep('name');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300 transition inline-flex items-center space-x-1"
                >
                  <Edit2 className="w-3 h-3 text-slate-400" />
                  <span>Ändern</span>
                </button>
              </div>
            </div>

            {/* Feedback & Progress Banners */}
            {uploadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/60 backdrop-blur-md border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center space-x-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Erfolgreich hochgeladen! Vielen Dank! 📸</span>
              </div>
            )}

            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-50/90 dark:bg-rose-950/60 backdrop-blur-md border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center space-x-2 shadow-xs">
                <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {isUploading && (
              <div className="space-y-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <span>Wird hochgeladen...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div
                    className="h-full bg-slate-800 dark:bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Optional Caption Bar */}
            {caption && (
              <div className="px-3.5 py-2.5 bg-indigo-50/90 dark:bg-indigo-950/50 backdrop-blur-md rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-900 dark:text-indigo-300 flex items-center justify-between shadow-2xs">
                <span className="truncate">Angehängte Mission / Text: "{caption}"</span>
                <button onClick={() => setCaption('')} className="text-slate-400 hover:text-slate-600 ml-2">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* COUNTDOWN TIMER */}
            {!isRevealed && (
              <div className="pt-1">
                <CountdownTimer
                  revealDate={event.revealDate}
                  lang={lang}
                  onExpire={handleRevealExpire}
                />
              </div>
            )}

            {/* TOP 3 PHOTOGRAPHER RANKING STRIP */}
            {mediaList.length > 0 && (
              <div className="pt-1">
                <PhotographerRanking mediaList={mediaList} onOpenRanking={() => setIsRankingOpen(true)} />
              </div>
            )}

            {/* UPLOADED PHOTOS GRID */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                  Fotos ({mediaList.length})
                </h2>
                {!isRevealed && (
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center">
                    <Lock className="w-3 h-3 mr-1 text-slate-400" />
                    Verschwommen bis Enthüllung
                  </span>
                )}
              </div>

              <GalleryGrid
                media={mediaList}
                eventId={event.id}
                lang={lang}
                isAdmin={false}
                isRevealed={isRevealed}
                guestName={guestName}
                myUploadedIds={myUploadedIds}
                onItemClick={handleOpenLightbox}
                onDeleteItem={handleDeleteGuestMedia}
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating iPhone-Style Full Width Bottom Tab Bar */}
      {guestStep === 'album' && (
        <FloatingBottomNav
          onCameraClick={() => cameraInputRef.current?.click()}
          onGalleryClick={() => galleryInputRef.current?.click()}
          onMissionClick={handleDrawMission}
          onGuestbookClick={() => setIsGuestbookOpen(true)}
          onRankingClick={() => setIsRankingOpen(true)}
        />
      )}

      {/* Digital Guestbook Modal */}
      <GuestbookModal
        isOpen={isGuestbookOpen}
        onClose={() => setIsGuestbookOpen(false)}
        eventId={event.id}
        eventName={event.name}
        defaultGuestName={guestName}
      />

      {/* Photographer Ranking Leaderboard Modal */}
      <RankingModal
        isOpen={isRankingOpen}
        onClose={() => setIsRankingOpen(false)}
        mediaList={mediaList}
      />

      {/* Foto-Mission Drawer / Modal */}
      {isMissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs border border-amber-200 dark:border-amber-800">
              <Target className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Deine Foto-Mission
              </span>
              <div className="text-3xl py-1">{currentMission.emoji}</div>
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                "{currentMission.text}"
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleFulfillMission}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition active:scale-98 flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Mission jetzt fotografieren!</span>
              </button>

              <button
                type="button"
                onClick={handleDrawMission}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Andere Mission ziehen</span>
              </button>
            </div>

            <button
              onClick={() => setIsMissionModalOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 pt-1"
            >
              Schließen
            </button>
          </div>
        </div>
      )}

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
        isAdmin={false}
        isRevealed={isRevealed}
        onDeleteItem={handleDeleteGuestMedia}
        guestName={guestName}
        myUploadedIds={myUploadedIds}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        qrCodeDataUrl={event.qrCodeDataUrl}
        guestUrl={event.guestUrl}
        eventId={event.id}
        eventCode={event.eventCode}
        eventName={event.name}
        lang={lang}
      />
    </div>
  );
}
