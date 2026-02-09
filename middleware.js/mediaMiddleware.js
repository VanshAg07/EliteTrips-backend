/**
 * Middleware to process media URLs from request body
 * This replaces file uploads with URL-based media handling
 */

const { processMediaUrl, processMediaUrls, isValidMediaUrl } = require('../config/googleDriveConfig');

/**
 * Process media URLs in request body
 * Converts Google Drive/Photos URLs to direct URLs
 */
exports.processMediaUrls = (req, res, next) => {
  try {
    // Process single media fields
    const singleMediaFields = [
      'image', 'video', 'backgroundVideo', 'blogBackgroungImage',
      'blogCardImage', 'stateImage', 'iconImage', 'phoneImage'
    ];

    singleMediaFields.forEach(field => {
      if (req.body[field]) {
        if (typeof req.body[field] === 'string') {
          req.body[field] = [processMediaUrl(req.body[field])];
        } else if (Array.isArray(req.body[field])) {
          req.body[field] = processMediaUrls(req.body[field]);
        }
      }
    });

    // Process array media fields
    const arrayMediaFields = [
      'tripImages', 'images', 'blogImages', 'logo'
    ];

    arrayMediaFields.forEach(field => {
      if (req.body[field]) {
        if (typeof req.body[field] === 'string') {
          // Parse if it's a JSON string
          try {
            const parsed = JSON.parse(req.body[field]);
            req.body[field] = Array.isArray(parsed) ? processMediaUrls(parsed) : [processMediaUrl(req.body[field])];
          } catch (e) {
            // If not JSON, treat as single URL
            req.body[field] = [processMediaUrl(req.body[field])];
          }
        } else if (Array.isArray(req.body[field])) {
          req.body[field] = processMediaUrls(req.body[field]);
        }
      }
    });

    next();
  } catch (error) {
    console.error('Error processing media URLs:', error);
    res.status(400).json({ 
      message: 'Error processing media URLs', 
      error: error.message 
    });
  }
};

/**
 * Validate media URLs in request body
 */
exports.validateMediaUrls = (req, res, next) => {
  try {
    const allUrls = [];

    // Collect all URLs from request body
    Object.keys(req.body).forEach(key => {
      const value = req.body[key];
      if (typeof value === 'string' && value.includes('http')) {
        allUrls.push(value);
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          if (typeof item === 'string' && item.includes('http')) {
            allUrls.push(item);
          }
        });
      }
    });

    // Validate all URLs
    const invalidUrls = allUrls.filter(url => !isValidMediaUrl(url));

    if (invalidUrls.length > 0) {
      return res.status(400).json({
        message: 'Invalid media URLs detected',
        invalidUrls: invalidUrls
      });
    }

    next();
  } catch (error) {
    console.error('Error validating media URLs:', error);
    res.status(400).json({ 
      message: 'Error validating media URLs', 
      error: error.message 
    });
  }
};

/**
 * Handle both file uploads and URL inputs
 * This middleware supports backward compatibility
 */
exports.handleMediaInput = (req, res, next) => {
  try {
    // If files are uploaded (backward compatibility)
    if (req.files && Object.keys(req.files).length > 0) {
      // Process uploaded files as before
      // This maintains backward compatibility
      next();
      return;
    }

    // Otherwise, process URLs from body
    exports.processMediaUrls(req, res, next);
  } catch (error) {
    console.error('Error handling media input:', error);
    res.status(400).json({ 
      message: 'Error handling media input', 
      error: error.message 
    });
  }
};
