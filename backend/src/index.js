import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PORT, UPLOAD_DIR } from './config.js';
import eventsRouter from './routes/events.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure Upload Directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// API Routes
app.use('/api/events', eventsRouter);

// Serve Frontend Static Bundle in Production / Docker
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  console.log(`Serving static frontend from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  console.log('Frontend dist folder not found. API mode only.');
  app.get('/', (req, res) => {
    res.send('TokiAlbum Backend API is running!');
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 TokiAlbum Server running on port ${PORT}`);
  console.log(`📁 Uploads Directory: ${UPLOAD_DIR}`);
  console.log(`⚙️ Network Access: http://192.168.178.29:${PORT}`);
  console.log(`====================================================`);
});
