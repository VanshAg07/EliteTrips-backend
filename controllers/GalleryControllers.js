const GalleryHoneymoon = require("../model/GalleryHoneymoon");
const GalleryNational = require("../model/GalleryNational");
const GalleryInternational = require("../model/GalleryInternational");
const GalleryHome = require("../model/GalleryHome");
const { processMediaUrls } = require("../config/googleDriveConfig");

exports.addGalleryHoneymoon = async (req, res) => {
  try {
    const { name, tripImages } = req.body;

    let galleryDetails = { name };

    // Handle URL-based image inputs (Google Drive/Photos)
    if (tripImages) {
      if (typeof tripImages === 'string') {
        try {
          const parsed = JSON.parse(tripImages);
          galleryDetails.tripImages = Array.isArray(parsed) ? processMediaUrls(parsed) : processMediaUrls([tripImages]);
        } catch (e) {
          galleryDetails.tripImages = processMediaUrls([tripImages]);
        }
      } else if (Array.isArray(tripImages)) {
        galleryDetails.tripImages = processMediaUrls(tripImages);
      }
    }
    // Backward compatibility: Handle file uploads
    else if (req.files && req.files.tripImages) {
      galleryDetails.tripImages = req.files.tripImages.map(
        (file) => file.filename
      );
    }

    const newGallery = new GalleryHoneymoon(galleryDetails);
    await newGallery.save();

    return res
      .status(201)
      .json({ message: "Gallery added successfully!", newGallery });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getHoneymoonGallery = async (req, res) => {
  try {
    const gallery = await GalleryHoneymoon.find();
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    return res.json(gallery);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addGalleryNational = async (req, res) => {
  try {
    const { name, tripImages } = req.body;

    let galleryDetails = { name };

    // Handle URL-based image inputs (Google Drive/Photos)
    if (tripImages) {
      if (typeof tripImages === 'string') {
        try {
          const parsed = JSON.parse(tripImages);
          galleryDetails.tripImages = Array.isArray(parsed) ? processMediaUrls(parsed) : processMediaUrls([tripImages]);
        } catch (e) {
          galleryDetails.tripImages = processMediaUrls([tripImages]);
        }
      } else if (Array.isArray(tripImages)) {
        galleryDetails.tripImages = processMediaUrls(tripImages);
      }
    }
    // Backward compatibility: Handle file uploads
    else if (req.files && req.files.tripImages) {
      galleryDetails.tripImages = req.files.tripImages.map(
        (file) => file.filename
      );
    }

    const newGallery = new GalleryNational(galleryDetails);
    await newGallery.save();

    return res
      .status(201)
      .json({ message: "Gallery added successfully!", newGallery });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getNationalGallery = async (req, res) => {
  try {
    const gallery = await GalleryNational.find();
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    return res.json(gallery);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addGalleryInternational = async (req, res) => {
  try {
    const { name, tripImages } = req.body;

    let galleryDetails = { name };

    // Handle URL-based image inputs (Google Drive/Photos)
    if (tripImages) {
      if (typeof tripImages === 'string') {
        try {
          const parsed = JSON.parse(tripImages);
          galleryDetails.tripImages = Array.isArray(parsed) ? processMediaUrls(parsed) : processMediaUrls([tripImages]);
        } catch (e) {
          galleryDetails.tripImages = processMediaUrls([tripImages]);
        }
      } else if (Array.isArray(tripImages)) {
        galleryDetails.tripImages = processMediaUrls(tripImages);
      }
    }
    // Backward compatibility: Handle file uploads
    else if (req.files && req.files.tripImages) {
      galleryDetails.tripImages = req.files.tripImages.map(
        (file) => file.filename
      );
    }

    const newGallery = new GalleryInternational(galleryDetails);
    await newGallery.save();

    return res
      .status(201)
      .json({ message: "Gallery added successfully!", newGallery });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getInternationalGallery = async (req, res) => {
  try {
    const gallery = await GalleryInternational.find();
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    return res.json(gallery);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addGalleryHome = async (req, res) => {
  try {
    const { name, images } = req.body;

    let galleryDetails = { name };

    // Handle URL-based image inputs (Google Drive/Photos)
    if (images) {
      if (typeof images === 'string') {
        try {
          const parsed = JSON.parse(images);
          galleryDetails.images = Array.isArray(parsed) ? processMediaUrls(parsed) : processMediaUrls([images]);
        } catch (e) {
          galleryDetails.images = processMediaUrls([images]);
        }
      } else if (Array.isArray(images)) {
        galleryDetails.images = processMediaUrls(images);
      }
    }
    // Backward compatibility: Handle file uploads
    else if (req.files && req.files.images) {
      galleryDetails.images = req.files.images.map((file) => file.filename);
    }

    const newGallery = new GalleryHome(galleryDetails);
    await newGallery.save();

    return res
      .status(201)
      .json({ message: "Gallery added successfully!", newGallery });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getHomeGallery = async (req, res) => {
  try {
    const gallery = await GalleryHome.find();
    if (!gallery || gallery.length === 0) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    const baseUrl = "https://elitetrips-backend.onrender.com/upload/";

    // helper function to fix old Google Drive URLs to lh3 format
    const fixGoogleDriveUrl = (url) => {
      if (!url || typeof url !== 'string') return url;

      // If already using lh3.googleusercontent.com, return as is
      if (url.includes('lh3.googleusercontent.com')) {
        return url;
      }

      let fileId = null;

      // Check for old uc?export format
      const ucMatch = url.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
      if (ucMatch) {
        fileId = ucMatch[1];
      }

      // Check for thumbnail format
      if (!fileId) {
        const thumbMatch = url.match(/drive\.google\.com\/thumbnail\?.*id=([a-zA-Z0-9_-]+)/);
        if (thumbMatch) {
          fileId = thumbMatch[1];
        }
      }

      // Check for /d/FILE_ID/ format
      if (!fileId) {
        const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (dMatch) {
          fileId = dMatch[1];
        }
      }

      if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}`;
      }

      return url;
    };

    // Process images and fix URLs
    const updatedGallery = gallery.map((item) => ({
      ...item._doc,
      images: item.images.map((image) => {
        // If it's a full URL, fix it if needed
        if (image.startsWith('http://') || image.startsWith('https://')) {
          return fixGoogleDriveUrl(image);
        }
        // Otherwise, it's a local file
        return baseUrl + image;
      })
    }));

    return res.json({ images: updatedGallery });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addInExistingGallery = async (req, res) => {
  const galleryId = req.params.id;

  try {
    const existingGallery = await Gallery.findById(galleryId);
    if (!existingGallery) {
      return res.status(404).json({ message: "Gallery not found." });
    }

    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`); // Assuming you save images to a public folder

    // Add new images to the existing array
    existingGallery.images.push(...imageUrls);
    await existingGallery.save();

    res.status(200).json({ message: "Images uploaded successfully." });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ message: "Failed to upload images." });
  }
};

exports.deleteHomeGallery = async (req, res) => {
  const galleryId = req.params.id;
  try {
    const gallery = await GalleryHome.findByIdAndDelete(galleryId);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found." });
    }
    res.status(200).json({ message: "Gallery deleted successfully." });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    res.status(500).json({ message: "Failed to delete gallery." });
  }
};

// controllers/galleryController.js

exports.deleteGalleryImage = async (req, res) => {
  const { galleryId, imageName } = req.params;

  try {
    // Find the gallery by ID
    const gallery = await GalleryHome.findById(galleryId);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found." });
    }

    // Check if the image exists in the gallery
    const imageIndex = gallery.images.findIndex(
      (image) => image.toLowerCase() === imageName.toLowerCase()
    );

    if (imageIndex === -1) {
      return res
        .status(404)
        .json({ message: "Image not found in the gallery." });
    }

    // Remove the image from the array
    gallery.images.splice(imageIndex, 1);

    // Save the updated gallery
    await gallery.save();

    res.status(200).json({ message: "Image deleted successfully." });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Failed to delete image." });
  }
};
