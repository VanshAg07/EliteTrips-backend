/**
 * Utility Script to Update Controllers for Google Drive Integration
 * 
 * This script provides helper functions to update controller patterns
 */

const fs = require('fs');
const path = require('path');

/**
 * Pattern replacements for common controller updates
 */
const patterns = {
  // Add import at the top of controllers
  addImport: {
    search: /^(const .+ = require\(.+\);?\n)+/m,
    replace: (match) => `${match}const { processMediaUrls } = require("../config/googleDriveConfig");\n`
  },

  // Update file upload handling to support URLs
  updateFileHandling: {
    // Pattern for single file
    singleFile: {
      search: /if \(req\.files && req\.files\.(\w+)\) \{\s*(\w+)\.(\w+) = req\.files\.\1\.map\(\(file\) => file\.filename\);?\s*\}/gs,
      getReplace: (fieldName, objectName, propertyName) => `
    // Handle URL-based inputs (Google Drive/Photos)
    if (req.body.${fieldName}) {
      if (typeof req.body.${fieldName} === 'string') {
        try {
          const parsed = JSON.parse(req.body.${fieldName});
          ${objectName}.${propertyName} = Array.isArray(parsed) ? processMediaUrls(parsed) : processMediaUrls([req.body.${fieldName}]);
        } catch (e) {
          ${objectName}.${propertyName} = processMediaUrls(req.body.${fieldName}.split('\\n').filter(url => url.trim()));
        }
      } else if (Array.isArray(req.body.${fieldName})) {
        ${objectName}.${propertyName} = processMediaUrls(req.body.${fieldName});
      }
    }
    // Backward compatibility: Handle file uploads
    else if (req.files && req.files.${fieldName}) {
      ${objectName}.${propertyName} = req.files.${fieldName}.map((file) => file.filename);
    }`
    }
  },

  // Remove baseUrl concatenation in GET endpoints
  removeBaseUrl: {
    search: /const baseUrl = ["']https:\/\/api\.EliteTrips\.com\/upload\/["'];?/g,
    replace: '// Base URL no longer needed - using direct Google Drive URLs'
  },

  removeBaseUrlMapping: {
    search: /(\w+): item\.(\w+)\.map\(\((\w+)\) => baseUrl \+ \3\)/g,
    replace: '$1: item.$2  // Already full URLs from Google Drive/Photos'
  }
};

/**
 * List of controllers that need updating
 */
const controllersToUpdate = [
  'controllers/BackgroundImageController.js',
  'controllers/OfferController.js',
  'controllers/HomeController/HomeController.js',
  'controllers/TeamController/teamController.js',
  'controllers/Blog/BlogController.js',
  'controllers/Corporate/CorporateController.js',
  'controllers/FlipCard/Flipcard.js',
  'controllers/honeymoonController.js',
  'controllers/internationalControllers.js',
  'controllers/weekendController.js',
  'controllers/PackaeImageController.js',
  'controllers/editableController.js',
  'controllers/Editable/*.js',
  'controllers/GroupTours/*.js',
  'controllers/Reviews/*.js',
  'controllers/Popus/*.js'
];

/**
 * Instructions for manual updates
 */
const manualUpdateInstructions = `
MANUAL UPDATE CHECKLIST FOR EACH CONTROLLER:
============================================

1. Add import at top:
   const { processMediaUrls } = require("../config/googleDriveConfig");

2. For CREATE/POST endpoints, replace:
   
   OLD:
   if (req.files && req.files.image) {
     data.image = req.files.image.map(file => file.filename);
   }

   NEW:
   if (req.body.images) {
     if (typeof req.body.images === 'string') {
       try {
         const parsed = JSON.parse(req.body.images);
         data.image = Array.isArray(parsed) ? processMediaUrls(parsed) : processMediaUrls([req.body.images]);
       } catch (e) {
         data.image = processMediaUrls(req.body.images.split('\\n').filter(url => url.trim()));
       }
     } else if (Array.isArray(req.body.images)) {
       data.image = processMediaUrls(req.body.images);
     }
   }
   // Backward compatibility
   else if (req.files && req.files.image) {
     data.image = req.files.image.map(file => file.filename);
   }

3. For UPDATE/PUT endpoints, use same pattern as CREATE

4. For GET endpoints, remove baseUrl concatenation:
   
   OLD:
   const baseUrl = "https://elitetrips-backend.onrender.com/upload/";
   images: item.images.map(img => baseUrl + img)

   NEW:
   images: item.images  // Already full URLs

5. Common field names to update:
   - image / images
   - video / videos
   - tripImages
   - backgroundVideo
   - blogImages
   - blogBackgroungImage
   - blogCardImage
   - stateImage
   - iconImage
   - phoneImage
   - logo

CONTROLLERS STATUS:
===================
✅ GalleryControllers.js - UPDATED
✅ ReelController.js - UPDATED
⬜ BackgroundImageController.js
⬜ OfferController.js
⬜ HomeController/HomeController.js
⬜ TeamController/teamController.js
⬜ Blog/BlogController.js
⬜ Corporate/*
⬜ FlipCard/Flipcard.js
⬜ GroupTours/*
⬜ Reviews/*
⬜ Popus/*
⬜ honeymoonController.js
⬜ internationalControllers.js
⬜ weekendController.js
`;

console.log(manualUpdateInstructions);

module.exports = {
  patterns,
  controllersToUpdate,
  manualUpdateInstructions
};
