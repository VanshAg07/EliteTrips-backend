/**
 * Google Drive Configuration helper
 * Converts Google Drive/Photos share links to direct embedding URLs
 */

/**
 * Convert Google Drive share link to direct image/video URL
 * @param {string} url - Google Drive share URL
 * @returns {string} - Direct URL for embedding
 */
exports.convertGoogleDriveUrl = (url) => {
  if (!url) return url;

  // If already using lh3.googleusercontent.com, return as is
  if (url.includes('lh3.googleusercontent.com')) {
    return url;
  }

  // Extract file ID from various Google Drive URL formats
  let fileId = null;

  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }

  // Format: https://drive.google.com/open?id=FILE_ID
  if (!fileId) {
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openMatch) {
      fileId = openMatch[1];
    }
  }

  // Format: https://drive.google.com/uc?export=view&id=FILE_ID
  if (!fileId) {
    const ucMatch = url.match(/uc\?.*id=([a-zA-Z0-9_-]+)/);
    if (ucMatch) {
      fileId = ucMatch[1];
    }
  }

  // Format: https://drive.google.com/thumbnail?id=FILE_ID
  if (!fileId) {
    const thumbMatch = url.match(/thumbnail\?.*id=([a-zA-Z0-9_-]+)/);
    if (thumbMatch) {
      fileId = thumbMatch[1];
    }
  }

  if (fileId) {
    // Use lh3.googleusercontent.com format - most reliable for embedding
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // Return original URL if no pattern matches
  return url;
};

/**
 * Convert Google Photos share link to direct image URL
 * @param {string} url - Google Photos share URL
 * @returns {string} - Direct URL for embedding
 */
exports.convertGooglePhotosUrl = (url) => {
  if (!url) return url;

  // If already a direct URL, return as is
  if (url.includes('lh3.googleusercontent.com') || url.includes('=w') || url.includes('=h')) {
    return url;
  }

  // Google Photos URLs can be used directly, just append size parameters
  if (url.includes('photos.google.com') || url.includes('photos.app.goo.gl')) {
    // For Google Photos, the shared link can be used with size parameters
    // Note: Size parameters like =w2000-h2000 can be added for optimization
    return url;
  }

  return url;
};

/**
 * Process media URL (handles both Google Drive and Google Photos)
 * @param {string} url - Media URL
 * @returns {string} - Direct URL for embedding
 */
exports.processMediaUrl = (url) => {
  if (!url) return url;

  // Check if it's a Google Photos URL
  if (url.includes('photos.google.com') || url.includes('photos.app.goo.gl')) {
    return this.convertGooglePhotosUrl(url);
  }

  // Check if it's a Google Drive URL
  if (url.includes('drive.google.com')) {
    return this.convertGoogleDriveUrl(url);
  }

  // If it's already a direct URL or other source
  return url;
};

/**
 * Process array of media URLs
 * @param {Array<string>} urls - Array of media URLs
 * @returns {Array<string>} - Array of direct URLs
 */
exports.processMediaUrls = (urls) => {
  if (!Array.isArray(urls)) return urls;
  return urls.map(url => this.processMediaUrl(url));
};

/**
 * Validate if URL is a valid media URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
exports.isValidMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);
    // Check if it's from Google Drive, Google Photos, or a direct image/video URL
    return (
      url.includes('drive.google.com') ||
      url.includes('photos.google.com') ||
      url.includes('photos.app.goo.gl') ||
      url.includes('lh3.googleusercontent.com') ||
      /\.(jpg|jpeg|png|gif|webp|mp4|avi|mov|wmv)$/i.test(url)
    );
  } catch (e) {
    return false;
  }
};
