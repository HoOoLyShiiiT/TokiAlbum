import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'));
export const DATABASE_PATH = path.resolve(process.env.DATABASE_PATH || path.join(__dirname, '../../data/knipsen.db'));
export const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '100', 10);
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
