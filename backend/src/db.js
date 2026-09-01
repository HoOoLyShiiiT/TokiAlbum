import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { DATABASE_PATH } from './config.js';

// Ensure data directory exists
const dbDir = path.dirname(DATABASE_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DATABASE_PATH);
db.pragma('journal_mode = WAL');

// Helper to generate a 5-character unique uppercase code
export function generateRandomCode(length = 5) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Initialize Database Schemas
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    event_code TEXT UNIQUE,
    event_date TEXT NOT NULL,
    reveal_date TEXT NOT NULL,
    theme TEXT DEFAULT 'classic',
    max_uploads_per_guest INTEGER DEFAULT 50,
    storage_type TEXT DEFAULT 'local',
    storage_custom_path TEXT,
    storage_webdav_url TEXT,
    storage_webdav_username TEXT,
    storage_webdav_password TEXT,
    storage_s3_bucket TEXT,
    storage_s3_endpoint TEXT,
    storage_s3_key TEXT,
    storage_s3_secret TEXT,
    admin_token TEXT NOT NULL,
    password_hash TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    original_name TEXT NOT NULL,
    stored_filename TEXT NOT NULL,
    thumbnail_filename TEXT,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    guest_name TEXT,
    caption TEXT,
    session_id TEXT,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    audio_filename TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS media_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_id TEXT NOT NULL,
    session_id TEXT,
    guest_name TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(media_id, session_id),
    FOREIGN KEY(media_id) REFERENCES media(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS guestbook_entries (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_media_event_id ON media(event_id);
  CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at);
  CREATE INDEX IF NOT EXISTS idx_media_views_media_id ON media_views(media_id);
  CREATE INDEX IF NOT EXISTS idx_guestbook_event_id ON guestbook_entries(event_id);
`);

// Migration helper for existing database files
try {
  const eventCols = db.pragma('table_info(events)').map(c => c.name);
  if (!eventCols.includes('event_code')) {
    db.exec("ALTER TABLE events ADD COLUMN event_code TEXT");
  }

  // Populate missing event_codes for existing rows
  const eventsWithoutCode = db.prepare("SELECT id FROM events WHERE event_code IS NULL OR event_code = ''").all();
  eventsWithoutCode.forEach(row => {
    let code = generateRandomCode(5);
    while (db.prepare('SELECT id FROM events WHERE event_code = ?').get(code)) {
      code = generateRandomCode(5);
    }
    db.prepare('UPDATE events SET event_code = ? WHERE id = ?').run(code, row.id);
  });

  // Create Unique index
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_events_event_code ON events(event_code)");

  if (!eventCols.includes('theme')) {
    db.exec("ALTER TABLE events ADD COLUMN theme TEXT DEFAULT 'classic'");
  }
  if (!eventCols.includes('max_uploads_per_guest')) {
    db.exec("ALTER TABLE events ADD COLUMN max_uploads_per_guest INTEGER DEFAULT 50");
  }

  const mediaCols = db.pragma('table_info(media)').map(c => c.name);
  if (!mediaCols.includes('likes_count')) {
    db.exec("ALTER TABLE media ADD COLUMN likes_count INTEGER DEFAULT 0");
  }
  if (!mediaCols.includes('views_count')) {
    db.exec("ALTER TABLE media ADD COLUMN views_count INTEGER DEFAULT 0");
  }
  if (!mediaCols.includes('audio_filename')) {
    db.exec("ALTER TABLE media ADD COLUMN audio_filename TEXT");
  }
} catch (e) {
  console.error('Migration error:', e);
}

export default db;
