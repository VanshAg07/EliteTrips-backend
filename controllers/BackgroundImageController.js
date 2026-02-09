const BackgroundImage = require("../model/BackgroundImages");
const baseUrl = "http://localhost:5001/upload/";

// Helper function to convert Google Drive URL to lh3 format
const convertGoogleDriveUrl = (url) => {
  if (!url) return url;
  
  // Already in lh3 format
  if (url.includes('lh3.googleusercontent.com')) {
    return url;
  }
  
  // Extract file ID from various Google Drive URL formats
  let fileId = null;
  
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([^\/]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([^&]+)/);
  if (openMatch) {
    fileId = openMatch[1];
  }
  
  // Format: https://drive.google.com/uc?id=FILE_ID
  const ucMatch = url.match(/uc\?.*id=([^&]+)/);
  if (ucMatch) {
    fileId = ucMatch[1];
  }
  
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  
  return url;
};

exports.createBackground = async (req, res) => {
  try {
    const { type, heading } = req.body;
    let image = [];

    // Check for Google Drive URL first
    if (req.body.imageUrl) {
      const imageUrls = Array.isArray(req.body.imageUrl) ? req.body.imageUrl : [req.body.imageUrl];
      image = imageUrls.map(url => convertGoogleDriveUrl(url));
    } else if (req.files && req.files.image) {
      // Handle multiple images upload
      image = req.files.image.map((file) => file.filename);
    }

    const newBackgroundImage = new BackgroundImage({ type, image, heading });
    await newBackgroundImage.save();

    res.status(201).json(newBackgroundImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllBackground = async (req, res) => {
  try {
    const backgroundImages = await BackgroundImage.find();
    // Map through the images to prepend the base URL or fix Google Drive URLs
    const updatedImages = backgroundImages.map((image) => {
      return {
        ...image.toObject(),
        image: image.image.map((filename) => {
          // If it's a full URL (Google Drive), fix and return as-is
          if (filename.startsWith('http')) {
            return convertGoogleDriveUrl(filename);
          }
          return `${baseUrl}${filename}`;
        }),
      };
    });
    res.status(200).json(updatedImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findByIdBackground = async (req, res) => {
  try {
    const { id } = req.params;
    const backgroundImage = await BackgroundImage.findById(id);
    if (!backgroundImage) {
      return res.status(404).json({ message: "Background image not found" });
    }
    res.status(200).json(backgroundImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBackground = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, heading } = req.body;
    let image = [];

    // Check for Google Drive URL first
    if (req.body.imageUrl) {
      const imageUrls = Array.isArray(req.body.imageUrl) ? req.body.imageUrl : [req.body.imageUrl];
      image = imageUrls.map(url => convertGoogleDriveUrl(url));
    } else if (req.files && req.files.image) {
      // Handle multiple images upload
      image = req.files.image.map((file) => file.filename);
    }

    const updateData = { type, heading };
    if (image.length > 0) {
      updateData.image = image; // Update image only if new images are uploaded
    }

    const updatedBackgroundImage = await BackgroundImage.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedBackgroundImage) {
      return res.status(404).json({ message: "Background image not found" });
    }

    res.status(200).json(updatedBackgroundImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBackground = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBackgroundImage = await BackgroundImage.findByIdAndDelete(id);
    if (!deletedBackgroundImage) {
      return res.status(404).json({ message: "Background image not found" });
    }
    res.status(200).json({ message: "Background image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
