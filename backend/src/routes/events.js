import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import archiver from 'archiver';
import db, { generateRandomCode } from '../db.js';
import { UPLOAD_DIR, MAX_FILE_SIZE_BYTES, BASE_URL } from '../config.js';
import { processMediaThumbnail } from '../utils/mediaProcessor.js';
import { generateQRCodeDataUrl, generateQRCodeBuffer } from '../utils/qrGenerator.js';

const router = express.Router();

function getEventUploadDir(event) {
  return path.join(UPLOAD_DIR, event.id);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const eventId = req.params.id;
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
    const eventDir = event ? getEventUploadDir(event) : path.join(UPLOAD_DIR, eventId);
    const thumbsDir = path.join(eventDir, 'thumbs');

    if (!fs.existsSync(eventDir)) {
      fs.mkdirSync(eventDir, { recursive: true });
    }
    if (!fs.existsSync(thumbsDir)) {
      fs.mkdirSync(thumbsDir, { recursive: true });
    }
    cb(null, eventDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const ext = path.extname(file.originalname).toLowerCase() || '.webm';
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES
  },
  fileFilter: (req, file, cb) => {
    const allowedMimePrefixes = ['image/', 'video/', 'audio/', 'application/octet-stream'];
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.mp4', '.mov', '.webm', '.avi', '.mp3', '.wav', '.m4a', '.ogg'];
    
    const isAllowed = allowedMimePrefixes.some(prefix => file.mimetype.startsWith(prefix)) || allowedExts.includes(ext);
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Only images, videos, and audio notes are allowed.'));
    }
  }
});

function verifyAdminAuth(req, event) {
  const tokenFromHeader = req.headers['x-admin-token'];
  const tokenFromQuery = req.query.token;
  const tokenFromAuth = req.headers.authorization?.replace('Bearer ', '');

  const providedToken = tokenFromHeader || tokenFromQuery || tokenFromAuth;
  return Boolean(providedToken && providedToken === event.admin_token);
}

function isGalleryRevealed(event) {
  if (!event.reveal_date) return true;
  const revealTime = new Date(event.reveal_date).getTime();
  return Date.now() >= revealTime;
}

// 0. GET /api/events/health — Health check
router.get('/health', (req, res) => {
  return res.json({
    status: 'ok',
    app: 'TokiAlbum',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// 0b. GET /api/events/code/:code — Lookup Event by 5-character Code
router.get('/code/:code', (req, res) => {
  try {
    const cleanCode = (req.params.code || '').trim().toUpperCase();
    if (!cleanCode) return res.status(400).json({ error: 'Bitte gib einen Event-Code ein.' });

    const event = db.prepare('SELECT id, name, event_code, event_date, reveal_date FROM events WHERE UPPER(event_code) = ?').get(cleanCode);
    if (!event) {
      return res.status(404).json({ error: 'Event-Code ungültig oder nicht gefunden.' });
    }

    return res.json({
      id: event.id,
      eventCode: event.event_code,
      name: event.name,
      guestUrl: `${BASE_URL}/event/${event.id}`
    });
  } catch (err) {
    console.error('Error looking up event code:', err);
    return res.status(500).json({ error: 'Fehler beim Suchen des Event-Codes.' });
  }
});

// 1. POST /api/events — Create Event
router.post('/', async (req, res) => {
  try {
    const { name, eventDate, revealDate, password, theme = 'classic', maxUploadsPerGuest = 50 } = req.body;

    if (!name || !eventDate || !revealDate) {
      return res.status(400).json({ error: 'Event name, event date, and reveal date are required.' });
    }

    const eventId = crypto.randomBytes(6).toString('hex');
    let eventCode = generateRandomCode(5);
    while (db.prepare('SELECT id FROM events WHERE event_code = ?').get(eventCode)) {
      eventCode = generateRandomCode(5);
    }

    const adminToken = crypto.randomBytes(16).toString('hex');
    const passwordHash = password ? crypto.createHash('sha256').update(password).digest('hex') : null;

    const stmt = db.prepare(`
      INSERT INTO events (id, name, event_code, event_date, reveal_date, theme, max_uploads_per_guest, admin_token, password_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(eventId, name.trim(), eventCode, eventDate, revealDate, theme, maxUploadsPerGuest, adminToken, passwordHash);

    const guestUrl = `${BASE_URL}/event/${eventId}`;
    const adminUrl = `${BASE_URL}/admin/${eventId}?token=${adminToken}`;
    const qrCodeDataUrl = await generateQRCodeDataUrl(guestUrl);

    return res.status(201).json({
      id: eventId,
      eventCode,
      name,
      eventDate,
      revealDate,
      theme,
      maxUploadsPerGuest,
      adminToken,
      guestUrl,
      adminUrl,
      qrCodeDataUrl
    });
  } catch (err) {
    console.error('Error creating event:', err);
    return res.status(500).json({ error: 'Failed to create event.' });
  }
});

// 2. GET /api/events/:id — Get Event Details
router.get('/:id', async (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const isAdmin = verifyAdminAuth(req, event);
    const revealed = isGalleryRevealed(event);

    const guestUrl = `${BASE_URL}/event/${event.id}`;
    const qrCodeDataUrl = await generateQRCodeDataUrl(guestUrl);

    return res.json({
      id: event.id,
      eventCode: event.event_code,
      name: event.name,
      eventDate: event.event_date,
      revealDate: event.reveal_date,
      theme: event.theme || 'classic',
      maxUploadsPerGuest: event.max_uploads_per_guest || 50,
      isRevealed: revealed,
      isAdmin,
      guestUrl,
      qrCodeDataUrl
    });
  } catch (err) {
    console.error('Error fetching event:', err);
    return res.status(500).json({ error: 'Failed to fetch event details.' });
  }
});

// 3. POST /api/events/:id/upload — Upload Media & Voice Note
router.post('/:id/upload', (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found.' });
  }

  const uploadFields = upload.fields([
    { name: 'files', maxCount: 20 },
    { name: 'audio', maxCount: 1 }
  ]);

  uploadFields(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: `File size exceeds limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.` });
      }
      return res.status(400).json({ error: err.message || 'File upload error.' });
    }

    try {
      const mediaFiles = req.files?.files || [];
      if (mediaFiles.length === 0) {
        return res.status(400).json({ error: 'No media files were uploaded.' });
      }

      const guestName = (req.body.guestName || '').trim();
      const caption = (req.body.caption || '').trim();
      const sessionId = (req.body.sessionId || req.headers['x-session-id'] || '').trim();
      const audioFile = req.files?.audio ? req.files.audio[0] : null;

      // Check upload limit per guest
      const maxLimit = event.max_uploads_per_guest || 50;
      if (maxLimit > 0 && (sessionId || guestName)) {
        const currentCount = db.prepare(`
          SELECT COUNT(*) as count FROM media
          WHERE event_id = ? AND (session_id = ? OR (guest_name = ? AND guest_name != '' AND guest_name != 'Gast'))
        `).get(event.id, sessionId, guestName).count;

        if (currentCount + mediaFiles.length > maxLimit) {
          return res.status(400).json({
            error: `Upload-Limit von ${maxLimit} Dateien pro Gast erreicht. Du hast bereits ${currentCount} Dateien hochgeladen.`
          });
        }
      }

      const savedMediaItems = [];

      const insertStmt = db.prepare(`
        INSERT INTO media (id, event_id, original_name, stored_filename, thumbnail_filename, mime_type, file_size, width, height, guest_name, caption, session_id, audio_filename)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const eventDir = getEventUploadDir(event);

      for (const file of mediaFiles) {
        const mediaId = crypto.randomBytes(8).toString('hex');
        const thumbFilename = `thumb_${path.parse(file.filename).name}.webp`;
        const outputThumbPath = path.join(eventDir, 'thumbs', thumbFilename);

        const { width, height } = await processMediaThumbnail(file.path, outputThumbPath, file.mimetype);

        insertStmt.run(
          mediaId,
          event.id,
          file.originalname,
          file.filename,
          thumbFilename,
          file.mimetype,
          file.size,
          width,
          height,
          guestName || null,
          caption || null,
          sessionId || null,
          audioFile ? audioFile.filename : null
        );

        savedMediaItems.push({
          id: mediaId,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          guestName,
          caption
        });
      }

      return res.status(201).json({
        message: 'Upload successful!',
        count: savedMediaItems.length,
        items: savedMediaItems
      });
    } catch (routeErr) {
      console.error('[UPLOAD ROUTE ERROR]:', routeErr);
      return res.status(500).json({ error: 'Fehler beim Speichern der Datei auf dem Server.' });
    }
  });
});

// 4. GET /api/events/:id/media — Get Media List
router.get('/:id/media', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const isAdmin = verifyAdminAuth(req, event);
    const revealed = isGalleryRevealed(event);

    const mediaList = db.prepare(`
      SELECT id, original_name, stored_filename, thumbnail_filename, mime_type, file_size, width, height, guest_name, caption, likes_count, views_count, audio_filename, session_id, created_at
      FROM media
      WHERE event_id = ?
      ORDER BY created_at DESC
    `).all(event.id);

    const formattedMedia = mediaList.map(item => ({
      id: item.id,
      originalName: item.original_name,
      mimeType: item.mime_type,
      fileSize: item.file_size,
      width: item.width,
      height: item.height,
      guestName: item.guest_name,
      caption: item.caption,
      sessionId: item.session_id,
      likesCount: item.likes_count || 0,
      viewsCount: item.views_count || 0,
      hasAudio: Boolean(item.audio_filename),
      createdAt: item.created_at,
      fileUrl: `${BASE_URL}/api/events/${event.id}/media/${item.id}/file${isAdmin ? `?token=${event.admin_token}` : ''}`,
      thumbnailUrl: `${BASE_URL}/api/events/${event.id}/media/${item.id}/thumbnail${isAdmin ? `?token=${event.admin_token}` : ''}`,
      audioUrl: item.audio_filename
        ? `${BASE_URL}/api/events/${event.id}/media/${item.id}/audio${isAdmin ? `?token=${event.admin_token}` : ''}`
        : null
    }));

    return res.json({
      eventId: event.id,
      count: formattedMedia.length,
      isRevealed: revealed,
      revealDate: event.reveal_date,
      media: formattedMedia
    });
  } catch (err) {
    console.error('Error fetching media:', err);
    return res.status(500).json({ error: 'Failed to fetch gallery media.' });
  }
});

// 5. POST /api/events/:id/media/:mediaId/like — Like/Heart a photo
router.post('/:id/media/:mediaId/like', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    db.prepare('UPDATE media SET likes_count = likes_count + 1 WHERE id = ? AND event_id = ?').run(req.params.mediaId, event.id);

    const updated = db.prepare('SELECT likes_count FROM media WHERE id = ?').get(req.params.mediaId);
    return res.json({ id: req.params.mediaId, likesCount: updated ? updated.likes_count : 0 });
  } catch (err) {
    console.error('Error liking media:', err);
    return res.status(500).json({ error: 'Failed to like media item.' });
  }
});

// 5b. POST /api/events/:id/media/:mediaId/view — Increment photo unique view counter per user
router.post('/:id/media/:mediaId/view', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const sessionId = (req.body.sessionId || req.headers['x-session-id'] || req.query.sessionId || '').trim();
    const guestName = (req.body.guestName || req.headers['x-guest-name'] || req.query.guestName || '').trim();

    if (sessionId) {
      db.prepare(`
        INSERT OR IGNORE INTO media_views (media_id, session_id, guest_name)
        VALUES (?, ?, ?)
      `).run(req.params.mediaId, sessionId, guestName || null);
    } else if (guestName && guestName.toLowerCase() !== 'gast') {
      db.prepare(`
        INSERT OR IGNORE INTO media_views (media_id, session_id, guest_name)
        VALUES (?, ?, ?)
      `).run(req.params.mediaId, `name_${guestName.toLowerCase()}`, guestName);
    }

    // Count distinct unique sessions/viewers
    const uniqueCount = db.prepare(`
      SELECT COUNT(DISTINCT session_id) as count
      FROM media_views
      WHERE media_id = ?
    `).get(req.params.mediaId).count;

    // Update views_count in media table
    db.prepare('UPDATE media SET views_count = ? WHERE id = ? AND event_id = ?').run(uniqueCount, req.params.mediaId, event.id);

    return res.json({ id: req.params.mediaId, viewsCount: uniqueCount });
  } catch (err) {
    console.error('Error recording media view:', err);
    return res.status(500).json({ error: 'Failed to record view.' });
  }
});

// 6. GET /api/events/:id/media/:mediaId/audio — Stream Voice Note Audio
router.get('/:id/media/:mediaId/audio', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    const item = db.prepare('SELECT audio_filename FROM media WHERE id = ? AND event_id = ?').get(req.params.mediaId, event.id);
    if (!item || !item.audio_filename) {
      return res.status(404).json({ error: 'Audio note not found.' });
    }

    const eventDir = getEventUploadDir(event);
    const audioPath = path.resolve(path.join(eventDir, item.audio_filename));
    if (!fs.existsSync(audioPath)) {
      return res.status(404).json({ error: 'Audio file missing.' });
    }

    const ext = path.extname(item.audio_filename).toLowerCase();
    if (ext === '.webm') res.setHeader('Content-Type', 'audio/webm');
    else if (ext === '.mp4' || ext === '.m4a') res.setHeader('Content-Type', 'audio/mp4');
    else if (ext === '.ogg') res.setHeader('Content-Type', 'audio/ogg');
    else if (ext === '.mp3') res.setHeader('Content-Type', 'audio/mpeg');

    return res.sendFile(audioPath);
  } catch (err) {
    console.error('Error streaming audio:', err);
    return res.status(500).json({ error: 'Error streaming audio file.' });
  }
});

// 7. GET /api/events/:id/media/:mediaId/file — Stream Full File
router.get('/:id/media/:mediaId/file', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    const item = db.prepare('SELECT * FROM media WHERE id = ? AND event_id = ?').get(req.params.mediaId, event.id);
    if (!item) return res.status(404).json({ error: 'Media file not found.' });

    const isAdmin = verifyAdminAuth(req, event);
    const revealed = isGalleryRevealed(event);
    const clientSessionId = req.query.sessionId || req.headers['x-session-id'];
    const clientGuestName = req.query.guestName;
    const isOwner = Boolean(
      (item.session_id && clientSessionId && item.session_id === clientSessionId) ||
      (item.guest_name && clientGuestName && item.guest_name.trim().toLowerCase() === clientGuestName.trim().toLowerCase())
    );

    if (!revealed && !isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Full size view is locked until reveal date.' });
    }

    const eventDir = getEventUploadDir(event);
    const filePath = path.resolve(path.join(eventDir, item.stored_filename));
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing on server.' });

    return res.sendFile(filePath);
  } catch (err) {
    console.error('Error streaming file:', err);
    return res.status(500).json({ error: 'Error streaming file.' });
  }
});

// 8. GET /api/events/:id/media/:mediaId/thumbnail — Stream Thumbnail
router.get('/:id/media/:mediaId/thumbnail', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    const item = db.prepare('SELECT * FROM media WHERE id = ? AND event_id = ?').get(req.params.mediaId, event.id);
    if (!item) return res.status(404).json({ error: 'Media item not found.' });

    const eventDir = getEventUploadDir(event);
    const thumbPath = path.resolve(path.join(eventDir, 'thumbs', item.thumbnail_filename || ''));
    if (fs.existsSync(thumbPath)) {
      return res.sendFile(thumbPath);
    } else {
      const origPath = path.resolve(path.join(eventDir, item.stored_filename));
      return res.sendFile(origPath);
    }
  } catch (err) {
    console.error('Error streaming thumbnail:', err);
    return res.status(500).json({ error: 'Error streaming thumbnail.' });
  }
});

// 9. DELETE /api/events/:id/media/:mediaId — Delete Media (Admin or Owner)
router.delete('/:id/media/:mediaId', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event nicht gefunden.' });

    const item = db.prepare('SELECT * FROM media WHERE id = ? AND event_id = ?').get(req.params.mediaId, event.id);
    if (!item) return res.status(404).json({ error: 'Foto nicht gefunden.' });

    const isAdmin = verifyAdminAuth(req, event);
    const reqSessionId = req.headers['x-session-id'] || req.query.sessionId || req.body.sessionId;
    const reqGuestName = req.headers['x-guest-name'] || req.query.guestName || req.body.guestName;

    const isOwner = Boolean(
      (reqSessionId && item.session_id && reqSessionId === item.session_id) ||
      (reqGuestName && item.guest_name && reqGuestName.trim().toLowerCase() === item.guest_name.trim().toLowerCase() && item.guest_name.trim().toLowerCase() !== 'gast')
    );

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Du darfst nur deine eigenen Fotos löschen.' });
    }

    db.prepare('DELETE FROM media WHERE id = ?').run(item.id);

    const eventDir = getEventUploadDir(event);
    const origPath = path.join(eventDir, item.stored_filename);
    const thumbPath = path.join(eventDir, 'thumbs', item.thumbnail_filename || '');
    if (item.audio_filename) {
      const audioPath = path.join(eventDir, item.audio_filename);
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    }

    if (fs.existsSync(origPath)) fs.unlinkSync(origPath);
    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);

    return res.json({ message: 'Foto erfolgreich gelöscht.', id: item.id });
  } catch (err) {
    console.error('Error deleting media:', err);
    return res.status(500).json({ error: 'Fehler beim Löschen des Fotos.' });
  }
});

// 10. GET /api/events/:id/download-all — Bulk ZIP Download
router.get('/:id/download-all', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    const isAdmin = verifyAdminAuth(req, event);
    const revealed = isGalleryRevealed(event);

    if (!revealed && !isAdmin) {
      return res.status(403).json({ error: 'Gallery is locked until reveal date.' });
    }

    const mediaList = db.prepare('SELECT * FROM media WHERE event_id = ? ORDER BY created_at ASC').all(event.id);
    if (mediaList.length === 0) {
      return res.status(400).json({ error: 'No media available to download.' });
    }

    const sanitizedEventName = event.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const zipFilename = `${sanitizedEventName}_Fotos.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);

    const archive = archiver('zip', { zlib: { level: 5 } });
    archive.pipe(res);

    const guestCounts = {};
    const eventDir = getEventUploadDir(event);

    mediaList.forEach((item) => {
      const filePath = path.join(eventDir, item.stored_filename);
      if (fs.existsSync(filePath)) {
        const rawName = item.guest_name ? item.guest_name.trim() : 'Unbekannte_Gaeste';
        const folderName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_');

        guestCounts[folderName] = (guestCounts[folderName] || 0) + 1;
        const indexStr = guestCounts[folderName].toString().padStart(3, '0');

        const zipEntryName = `${folderName}/${indexStr}_${item.original_name}`;
        archive.file(filePath, { name: zipEntryName });
      }
    });

    archive.finalize();
  } catch (err) {
    console.error('Error creating ZIP download:', err);
    return res.status(500).json({ error: 'Failed to generate ZIP archive.' });
  }
});

// 11. GET /api/events/:id/stats — Admin Statistics
router.get('/:id/stats', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    if (!verifyAdminAuth(req, event)) {
      return res.status(403).json({ error: 'Unauthorized admin access.' });
    }

    const totalUploads = db.prepare('SELECT COUNT(*) as count FROM media WHERE event_id = ?').get(event.id).count;
    const photosCount = db.prepare("SELECT COUNT(*) as count FROM media WHERE event_id = ? AND mime_type LIKE 'image/%'").get(event.id).count;
    const videosCount = db.prepare("SELECT COUNT(*) as count FROM media WHERE event_id = ? AND mime_type LIKE 'video/%'").get(event.id).count;
    const totalStorageBytes = db.prepare('SELECT SUM(file_size) as total FROM media WHERE event_id = ?').get(event.id).total || 0;

    const uniqueParticipantsCount = db.prepare(`
      SELECT COUNT(DISTINCT COALESCE(NULLIF(session_id, ''), guest_name)) as count
      FROM media
      WHERE event_id = ? AND (session_id IS NOT NULL OR guest_name IS NOT NULL)
    `).get(event.id).count;

    const guestNamesRows = db.prepare(`
      SELECT DISTINCT guest_name
      FROM media
      WHERE event_id = ? AND guest_name IS NOT NULL AND guest_name != ''
    `).all(event.id);
    const guestNames = guestNamesRows.map(r => r.guest_name);

    const timeline = db.prepare(`
      SELECT strftime('%Y-%m-%d %H:00', created_at) as timestamp, COUNT(*) as count
      FROM media
      WHERE event_id = ?
      GROUP BY timestamp
      ORDER BY timestamp ASC
    `).all(event.id);

    return res.json({
      totalUploads,
      photosCount,
      videosCount,
      uniqueParticipantsCount: Math.max(uniqueParticipantsCount, guestNames.length),
      totalStorageBytes,
      totalStorageMB: (totalStorageBytes / (1024 * 1024)).toFixed(2),
      guestNames,
      timeline
    });
  } catch (err) {
    console.error('Error fetching event stats:', err);
    return res.status(500).json({ error: 'Failed to fetch statistics.' });
  }
});

// 12. PATCH /api/events/:id — Admin Update Event Settings
router.patch('/:id', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    if (!verifyAdminAuth(req, event)) {
      return res.status(403).json({ error: 'Unauthorized admin access.' });
    }

    const {
      name,
      eventDate,
      revealDate,
      theme,
      maxUploadsPerGuest
    } = req.body;

    const newName = name !== undefined ? name.trim() : event.name;
    const newEventDate = eventDate !== undefined ? eventDate : event.event_date;
    const newRevealDate = revealDate !== undefined ? revealDate : event.reveal_date;
    const newTheme = theme !== undefined ? theme : (event.theme || 'classic');
    const newMaxLimit = maxUploadsPerGuest !== undefined ? parseInt(maxUploadsPerGuest, 10) : (event.max_uploads_per_guest || 50);

    db.prepare(`
      UPDATE events
      SET name = ?, event_date = ?, reveal_date = ?, theme = ?, max_uploads_per_guest = ?
      WHERE id = ?
    `).run(
      newName, newEventDate, newRevealDate, newTheme, newMaxLimit,
      event.id
    );

    const updatedEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(event.id);
    const revealed = isGalleryRevealed(updatedEvent);

    return res.json({
      message: 'Event updated successfully.',
      id: updatedEvent.id,
      eventCode: updatedEvent.event_code,
      name: updatedEvent.name,
      eventDate: updatedEvent.event_date,
      revealDate: updatedEvent.reveal_date,
      theme: updatedEvent.theme,
      maxUploadsPerGuest: updatedEvent.max_uploads_per_guest,
      isRevealed: revealed
    });
  } catch (err) {
    console.error('Error updating event:', err);
    return res.status(500).json({ error: 'Failed to update event settings.' });
  }
});

// 13. GET /api/events/:id/qr — Download QR PNG
router.get('/:id/qr', async (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    const guestUrl = `${BASE_URL}/event/${event.id}`;
    const pngBuffer = await generateQRCodeBuffer(guestUrl);

    const filename = `QR_${event.name.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(pngBuffer);
  } catch (err) {
    console.error('Error generating QR PNG download:', err);
    return res.status(500).json({ error: 'Failed to generate QR PNG.' });
  }
});

// 14. GET /api/events/:id/guestbook — List Guestbook Entries
router.get('/:id/guestbook', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event nicht gefunden.' });

    const entries = db.prepare(`
      SELECT id, guest_name as guestName, message, created_at as createdAt
      FROM guestbook_entries
      WHERE event_id = ?
      ORDER BY created_at DESC
    `).all(event.id);

    return res.json({ eventId: event.id, count: entries.length, entries });
  } catch (err) {
    console.error('Error fetching guestbook entries:', err);
    return res.status(500).json({ error: 'Fehler beim Laden der Gästebucheinträge.' });
  }
});

// 15. POST /api/events/:id/guestbook — Add Guestbook Entry
router.post('/:id/guestbook', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event nicht gefunden.' });

    const guestName = (req.body.guestName || '').trim();
    const message = (req.body.message || '').trim();

    if (!guestName) {
      return res.status(400).json({ error: 'Bitte gib deinen Namen an.' });
    }
    if (!message) {
      return res.status(400).json({ error: 'Bitte gib einen Glückwunsch-Text ein.' });
    }

    const entryId = crypto.randomBytes(8).toString('hex');
    db.prepare(`
      INSERT INTO guestbook_entries (id, event_id, guest_name, message)
      VALUES (?, ?, ?, ?)
    `).run(entryId, event.id, guestName, message);

    const newEntry = db.prepare('SELECT id, guest_name as guestName, message, created_at as createdAt FROM guestbook_entries WHERE id = ?').get(entryId);
    return res.status(201).json({ message: 'Eintrag erfolgreich hinzugefügt!', entry: newEntry });
  } catch (err) {
    console.error('Error adding guestbook entry:', err);
    return res.status(500).json({ error: 'Fehler beim Speichern des Gästebucheintrags.' });
  }
});

// 16. DELETE /api/events/:id/guestbook/:entryId — Delete Guestbook Entry
router.delete('/:id/guestbook/:entryId', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event nicht gefunden.' });

    if (!verifyAdminAuth(req, event)) {
      return res.status(403).json({ error: 'Nur der Admin darf Gästebucheinträge löschen.' });
    }

    db.prepare('DELETE FROM guestbook_entries WHERE id = ? AND event_id = ?').run(req.params.entryId, event.id);
    return res.json({ message: 'Eintrag gelöscht.', id: req.params.entryId });
  } catch (err) {
    console.error('Error deleting guestbook entry:', err);
    return res.status(500).json({ error: 'Fehler beim Löschen des Eintrags.' });
  }
});

export default router;
