import QRCode from 'qrcode';

/**
 * Generates a PNG Data URL for a given event URL
 * @param {string} url - Target URL to encode into QR code
 * @returns {Promise<string>} Data URL string (data:image/png;base64,...)
 */
export async function generateQRCodeDataUrl(url) {
  try {
    return await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 600,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('QR code generation error:', err);
    throw err;
  }
}

/**
 * Generates a PNG Buffer for direct download
 * @param {string} url - Target URL to encode into QR code
 * @returns {Promise<Buffer>} PNG Buffer
 */
export async function generateQRCodeBuffer(url) {
  try {
    return await QRCode.toBuffer(url, {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 2,
      width: 1000,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('QR code buffer generation error:', err);
    throw err;
  }
}
