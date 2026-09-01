# 📸 Knipsen — Collaborative Event Photo & Video Sharing Platform

A production-ready, self-hosted web application for event photo and video collection (weddings, birthdays, anniversaries, corporate events). Guests scan a QR code to upload photos and videos without any login or registration. The gallery remains locked with a live countdown timer until a creator-configured **reveal date**, after which all media becomes viewable and downloadable in bulk as a ZIP archive.

---

## ✨ Key Features

- **No Registration Guest Upload**: Guests access the event instantly via QR code or shareable link on mobile or desktop.
- **Reveal Date & Gallery Locking**:
  - Uploads are accepted anytime before or after the reveal date.
  - The gallery is hidden (HTTP 403 API protection) before the reveal date, displaying a live animated countdown timer to guests.
  - On the reveal date, the gallery unlocks automatically for all guests.
- **Admin Dashboard**:
  - Real-time stats: Total uploads, photo/video breakdown, unique participant count, storage used.
  - Media management: View, preview, and delete individual uploads.
  - Adjust reveal date or event name on the fly.
  - High-res PNG QR code download.
- **Gallery & Lightbox**:
  - Responsive Grid/Masonry view.
  - Fullscreen Lightbox supporting keyboard navigation, full resolution photos, and video playback.
  - Dynamic **ZIP bulk download** streaming all media cleanly.
- **Optimized Storage**:
  - Converts/thumbnails images (JPG, PNG, WEBP, HEIC) using `sharp`.
  - Videos (MP4, MOV) stored with custom media preview cards.
- **Multilingual UI**: German (primary default) and English fallback with dynamic language switcher.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express.js, `better-sqlite3` (SQLite Database), `multer`, `sharp`, `archiver`, `qrcode`.
- **Deployment**: Docker & Docker Compose support with persistent data volumes.

---

## 🚀 Quick Start (Docker Compose - Recommended)

The easiest way to self-host Knipsen is using Docker Compose:

```bash
# 1. Clone the repository
git clone https://github.com/your-user/knipsen.git
cd knipsen

# 2. Configure your environment
cp .env.example .env

# Edit .env to set your domain/BASE_URL (e.g., BASE_URL=https://wedding.example.com)

# 3. Launch with Docker Compose
docker-compose up -d --build
```

The application will be accessible at `http://localhost:3000` (or your configured port).

---

## 💻 Manual Setup & Local Development

### Prerequisites
- Node.js 18+ and `npm`

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies & Build
```bash
cd ../frontend
npm install
npm run build
```

### 3. Start the Application
```bash
# In backend directory
cd ../backend
npm start
```

For development mode (with hot reloading):
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP Port for the Express server |
| `NODE_ENV` | `production` | Node environment (`development` or `production`) |
| `UPLOAD_DIR` | `./uploads` | Directory path for storing uploaded media files |
| `DATABASE_PATH` | `./data/knipsen.db` | Directory/file path for SQLite database |
| `MAX_FILE_SIZE_MB` | `100` | Maximum file size limit per upload in Megabytes |
| `BASE_URL` | `http://localhost:3000` | Base URL used for generating QR Code links and guest share URLs |

---

## 🔒 Security & Access Control

- **Guest Access**: Access controlled by unguessable event IDs (`/event/:id`).
- **Admin Access**: Protected by a 32-character cryptographically secure token (`/admin/:id?token=...`) generated upon event creation.
- **API Guard**: Endpoints `/api/events/:id/media` and download routes strictly return `403 Forbidden` prior to reveal date unless valid admin credentials are sent.

---

## 📜 License

MIT License. Free to host, modify, and use for any wedding or personal event!
