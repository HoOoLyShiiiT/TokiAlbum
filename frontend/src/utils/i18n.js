export const translations = {
  de: {
    appName: 'TokiAlbum',
    appTagline: 'Gemeinsames Fotoalbum für deine Feier',
    createEventTitle: 'Neues Event erstellen',
    createEventSubtitle: 'Erstelle dein eigenes Fotoalbum für Hochzeiten, Geburtstage und Partys. Gäste scannen den QR-Code und laden sofort Fotos hoch.',
    eventNameLabel: 'Event Name',
    eventNamePlaceholder: 'z.B. Hochzeit Max & Julia',
    eventDateLabel: 'Datum der Feier',
    revealDateLabel: 'Enthüllungsdatum & Uhrzeit',
    revealDateHelp: 'Vor diesem Datum sind die Galerie-Fotos verschwommen.',
    adminPasswordLabel: 'Admin Passwort (optional)',
    adminPasswordPlaceholder: 'Passwort zum Schutz des Dashboard Links',
    createButton: 'Event erstellen & QR-Code generieren',
    
    // Guest View
    welcomeGuest: 'Willkommen bei',
    guestInstructions: 'Scanne den QR-Code oder nutze die Buttons unten, um Fotos direkt hochzuladen!',
    uploadButtonCamera: 'Foto aufnehmen',
    uploadButtonGallery: 'Aus Galerie wählen',
    uploadingProgress: 'Wird hochgeladen...',
    uploadSuccess: 'Erfolgreich hochgeladen! Danke für deine Erinnerung ❤️',
    captionPlaceholder: 'Nachricht / Bildunterschrift (optional)',
    guestNamePlaceholder: 'Dein Name (optional)',
    
    // Countdown
    countdownTitle: 'Galerie schaltet sich frei in:',
    galleryLockedBadge: 'Galerie ist noch verschlossen',
    galleryUnlockedBadge: 'Galerie ist freigeschaltet!',

    // Gallery
    filterAll: 'Alle',
    filterPhotos: 'Fotos',
    filterVideos: 'Videos',
    downloadAllZip: 'Alle Medien als ZIP herunterladen',
    noMediaYet: 'Noch keine Fotos hochgeladen',
    beTheFirst: 'Sei der Erste, der ein Foto von der Feier teilt!',

    // Admin Dashboard
    adminDashboardTitle: 'Event Verwaltung (Admin)',
    totalUploads: 'Gesamte Uploads',
    uniqueParticipants: 'Aktive Gäste',
    storageUsed: 'Speicherplatz',
    deleteConfirm: 'Möchtest du diese Datei wirklich dauerhaft löschen?',
    saveChanges: 'Änderungen speichern',
    printTableStand: 'Tischaufsteller drucken',
    downloadQr: 'QR-Code PNG herunterladen',
    manageMediaTitle: 'Hochgeladene Medien verwalten',

    // Modals & Extras
    close: 'Schließen',
    copied: 'Kopiert!',
    copy: 'Kopieren',
    guestLinkTitle: 'Gäste-Link & QR-Code',
    guestLinkHelp: 'Teile diesen Link oder den QR-Code mit deinen Gästen.',
    adminLinkTitle: 'Dein Admin-Link (Geheim!)',
    adminLinkHelp: 'Speichere diesen Link unbedingt ab! Nur damit kannst du das Event verwalten.',
    goToGuestPage: 'Zur Gäste-Seite ➔',
    goToAdminPage: 'Zum Admin-Dashboard 🛡️',
    
    // Lightbox
    downloadItem: 'Herunterladen',
    delete: 'Löschen',
    loading: 'Lädt...'
  },
  en: {
    appName: 'TokiAlbum',
    appTagline: 'Collaborative Event Photo Album',
    createEventTitle: 'Create a New Event',
    createEventSubtitle: 'Create a shared photo album for weddings, birthdays, and parties. Guests scan the QR code and instantly upload media.',
    eventNameLabel: 'Event Name',
    eventNamePlaceholder: 'e.g. Wedding Max & Julia',
    eventDateLabel: 'Event Date',
    revealDateLabel: 'Reveal Date & Time',
    revealDateHelp: 'Before this date, uploaded photos remain blurred.',
    adminPasswordLabel: 'Admin Password (optional)',
    adminPasswordPlaceholder: 'Password to protect admin dashboard',
    createButton: 'Create Event & Generate QR Code',
    
    // Guest View
    welcomeGuest: 'Welcome to',
    guestInstructions: 'Scan the QR code or tap the buttons below to upload photos directly!',
    uploadButtonCamera: 'Take Photo',
    uploadButtonGallery: 'Select from Gallery',
    uploadingProgress: 'Uploading...',
    uploadSuccess: 'Successfully uploaded! Thank you ❤️',
    captionPlaceholder: 'Message / Caption (optional)',
    guestNamePlaceholder: 'Your Name (optional)',
    
    // Countdown
    countdownTitle: 'Gallery unlocks in:',
    galleryLockedBadge: 'Gallery is locked until reveal date',
    galleryUnlockedBadge: 'Gallery is unlocked!',

    // Gallery
    filterAll: 'All',
    filterPhotos: 'Photos',
    filterVideos: 'Videos',
    downloadAllZip: 'Download All Media as ZIP',
    noMediaYet: 'No media uploaded yet',
    beTheFirst: 'Be the first to share a photo from the event!',

    // Admin Dashboard
    adminDashboardTitle: 'Event Management (Admin)',
    totalUploads: 'Total Uploads',
    uniqueParticipants: 'Active Guests',
    storageUsed: 'Storage Used',
    deleteConfirm: 'Are you sure you want to permanently delete this item?',
    saveChanges: 'Save Changes',
    printTableStand: 'Print Table Stand Card',
    downloadQr: 'Download QR Code PNG',
    manageMediaTitle: 'Manage Uploaded Media',

    // Modals & Extras
    close: 'Close',
    copied: 'Copied!',
    copy: 'Copy',
    guestLinkTitle: 'Guest Link & QR Code',
    guestLinkHelp: 'Share this link or QR code with your guests.',
    adminLinkTitle: 'Your Admin Link (Secret!)',
    adminLinkHelp: 'Bookmark this link! It is the only way to manage your event.',
    goToGuestPage: 'Go to Guest Page ➔',
    goToAdminPage: 'Go to Admin Dashboard 🛡️',
    
    // Lightbox
    downloadItem: 'Download',
    delete: 'Delete',
    loading: 'Loading...'
  }
};

export function getTranslation(lang = 'de', key) {
  return translations[lang]?.[key] || translations['de']?.[key] || key;
}
