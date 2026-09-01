import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import heicConvert from 'heic-convert';

/**
 * Generates a WebP thumbnail for images, or a custom video poster icon thumbnail for videos.
 * @param {string} inputPath - Absolute path to original uploaded file
 * @param {string} outputThumbPath - Absolute path to save thumbnail WebP
 * @param {string} mimeType - File MIME type
 * @returns {Promise<{width: number|null, height: number|null}>}
 */
export async function processMediaThumbnail(inputPath, outputThumbPath, mimeType) {
  try {
    if (mimeType.startsWith('image/')) {
      let imageBuffer;

      // Handle HEIC/HEIF files
      if (mimeType.includes('heic') || mimeType.includes('heif') || inputPath.toLowerCase().endsWith('.heic')) {
        const inputBuffer = await fs.promises.readFile(inputPath);
        const outputJpeg = await heicConvert({
          buffer: inputBuffer,
          format: 'JPEG',
          quality: 0.85
        });
        imageBuffer = Buffer.from(outputJpeg);
      } else {
        imageBuffer = inputPath;
      }

      const pipeline = sharp(imageBuffer);
      const metadata = await pipeline.metadata();

      await pipeline
        .rotate() // Auto rotate EXIF orientation
        .resize(500, 500, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 80 })
        .toFile(outputThumbPath);

      return {
        width: metadata.width || null,
        height: metadata.height || null
      };
    } else if (mimeType.startsWith('video/')) {
      // Create a clean SVG video poster thumbnail card
      const videoIconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1e1b4b" />
              <stop offset="50%" stop-color="#312e81" />
              <stop offset="100%" stop-color="#4338ca" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.4"/>
            </filter>
          </defs>
          <rect width="500" height="500" fill="url(#bg)" />
          <circle cx="250" cy="250" r="70" fill="rgba(255, 255, 255, 0.2)" filter="url(#shadow)" />
          <circle cx="250" cy="250" r="55" fill="#ffffff" />
          <polygon points="238,220 274,250 238,280" fill="#4338ca" />
          <text x="250" y="370" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="600" fill="#ffffff" text-anchor="middle" letter-spacing="1">VIDEO PLAYBACK</text>
        </svg>
      `;

      await sharp(Buffer.from(videoIconSvg))
        .webp()
        .toFile(outputThumbPath);

      return { width: 1280, height: 720 };
    }
  } catch (err) {
    console.error('Error processing media thumbnail:', err);
    // Fallback if thumbnail generation fails
    try {
      const fallbackSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
          <rect width="400" height="400" fill="#334155" />
          <text x="200" y="200" font-family="sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">Preview unavailable</text>
        </svg>
      `;
      await sharp(Buffer.from(fallbackSvg)).webp().toFile(outputThumbPath);
    } catch (e) {
      // ignore
    }
  }

  return { width: null, height: null };
}
