const Flipcard = require("../../model/Flipcard/Flipcard");

// Helper function to convert Google Drive/Photos sharing link to direct viewable URL
const convertGoogleDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  
  let fileId = null;
  
  // Check if it's a Google Photos link (lh3.googleusercontent.com)
  if (url.includes('lh3.googleusercontent.com') || url.includes('googleusercontent.com')) {
    // Google Photos links work directly, return as-is
    return url;
  }
  
  // Extract file ID from various Google Drive URL formats
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileIdMatch = url.match(/\/d\/([^/]+)/);
  if (fileIdMatch) {
    fileId = fileIdMatch[1].split('?')[0];
  }
  
  // Also handle uc?id= format or other id= formats
  if (!fileId) {
    const ucMatch = url.match(/[?&]id=([^&]+)/);
    if (ucMatch) {
      fileId = ucMatch[1];
    }
  }
  
  // Also handle open?id= format
  if (!fileId) {
    const openMatch = url.match(/open\?id=([^&]+)/);
    if (openMatch) {
      fileId = openMatch[1];
    }
  }
  
  if (fileId) {
    // Use lh3.googleusercontent.com format - this is the most reliable for embedding
    // This format works for publicly shared files
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  
  // If already a direct URL or other format, return as is
  return url;
};

// Create a new Flipcard in a specific category
exports.addFlipcardToCategory = async (req, res) => {
  try {
    const { category, stateName, flipPrice, flipOfferPrice, flipcardImageUrl } = req.body;
    let flipcardImages = [];

    // Check if image URL is provided (Google Drive link)
    if (flipcardImageUrl) {
      const convertedUrl = convertGoogleDriveUrl(flipcardImageUrl);
      flipcardImages.push(convertedUrl);
    }
    // Fallback to file upload if no URL provided
    else if (req.files && req.files.flipcardImage) {
      req.files.flipcardImage.forEach((file) => {
        flipcardImages.push(file.filename);
      });
    }

    if (flipcardImages.length === 0) {
      return res.status(400).json({ message: "Please provide an image URL or upload a file" });
    }

    // Find the Flipcard document (assuming there is only one document)
    let flipcard = await Flipcard.findOne();

    if (!flipcard) {
      // If no document exists, create a new one
      flipcard = new Flipcard();
    }

    // Create a new flipcard item
    const newFlipcardItem = {
      stateName,
      flipcardImage: flipcardImages,
      flipPrice,
      flipOfferPrice,
    };

    // Add the new flipcard to the specified category
    flipcard[category].push(newFlipcardItem);

    // Save the updated document
    await flipcard.save();
    res.status(201).json({ message: "Flipcard added successfully", flipcard });
  } catch (error) {
    res.status(500).json({ message: "Error adding flipcard", error });
  }
};
exports.getFlipcards = async (req, res) => {
  try {
    // Find the Flipcard documents
    const flipcards = await Flipcard.find();
    const baseUrl = "https://elitetrips-backend.onrender.com/upload/";

    if (!flipcards || flipcards.length === 0) {
      return res.status(404).json({ message: "No flipcards found" });
    }

    // Helper function to convert old URLs to lh3.googleusercontent.com format
    const fixGoogleDriveUrl = (url) => {
      if (!url || typeof url !== 'string') return url;
      
      // If already using googleusercontent.com, return as-is
      if (url.includes('googleusercontent.com')) {
        return url;
      }
      
      let fileId = null;
      
      // Check for old thumbnail format
      const thumbnailMatch = url.match(/drive\.google\.com\/thumbnail\?id=([^&]+)/);
      if (thumbnailMatch) {
        fileId = thumbnailMatch[1];
      }
      
      // Check for uc?export format
      if (!fileId) {
        const ucMatch = url.match(/drive\.google\.com\/uc\?.*id=([^&]+)/);
        if (ucMatch) {
          fileId = ucMatch[1];
        }
      }
      
      // Check for /d/FILE_ID/ format
      if (!fileId) {
        const dMatch = url.match(/\/d\/([^/]+)/);
        if (dMatch) {
          fileId = dMatch[1].split('?')[0];
        }
      }
      
      if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}`;
      }
      
      return url;
    };

    // Function to construct full URLs for images and include the flipcardId
    const constructImageUrls = (items) => {
      return items.map((item) => ({
        flipcardId: item._id, // Include the flipcard ID
        stateName: item.stateName,
        flipPrice: item.flipPrice,
        flipOfferPrice: item.flipOfferPrice,
        flipcardImage: item.flipcardImage.map((image) => {
          // Check if image is already a full URL (Google Drive or other external link)
          if (image.startsWith('http://') || image.startsWith('https://')) {
            // Fix old thumbnail URLs to new format
            return fixGoogleDriveUrl(image);
          }
          // Otherwise, it's a filename on the server
          return baseUrl + image;
        }),
      }));
    };

    // Create an array to hold all the data
    const responsePayload = {
      national: [],
      international: [],
      honeymoon: [],
    };

    // Map through flipcards and only include necessary fields
    flipcards.forEach((flipcard) => {
      // Assuming flipcard.national, flipcard.international, and flipcard.honeymoon are arrays
      responsePayload.national.push(...constructImageUrls(flipcard.national));
      responsePayload.international.push(
        ...constructImageUrls(flipcard.international)
      );
      responsePayload.honeymoon.push(...constructImageUrls(flipcard.honeymoon));
    });

    res.status(200).json(responsePayload);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flipcards", error });
  }
};

// Update a Flipcard in a specific category
exports.updateFlipcardInCategory = async (req, res) => {
  try {
    const { category, flipcardId } = req.params;
    const { stateName, flipPrice, flipOfferPrice, flipcardImageUrl } = req.body;
    let flipcardImages = [];

    // Check if image URL is provided (Google Drive link)
    if (flipcardImageUrl) {
      const convertedUrl = convertGoogleDriveUrl(flipcardImageUrl);
      flipcardImages.push(convertedUrl);
    }
    // Fallback to file upload if no URL provided
    else if (req.files && req.files.flipcardImage) {
      flipcardImages = req.files.flipcardImage.map((file) => file.filename);
    }

    // Find the Flipcard document
    const flipcard = await Flipcard.findOne();

    if (!flipcard || !flipcard[category]) {
      return res
        .status(404)
        .json({ message: "Flipcard not found for the specified category" });
    }

    // Find the flipcard item within the category
    const flipcardItem = flipcard[category].id(flipcardId);
    if (!flipcardItem) {
      return res.status(404).json({ message: "Flipcard item not found" });
    }

    // Update the flipcard item details
    flipcardItem.stateName = stateName || flipcardItem.stateName;
    flipcardItem.flipPrice = flipPrice || flipcardItem.flipPrice;
    flipcardItem.flipOfferPrice = flipOfferPrice || flipcardItem.flipOfferPrice;
    if (flipcardImages.length > 0) {
      flipcardItem.flipcardImage = flipcardImages;
    }

    // Save the updated document
    await flipcard.save();
    res
      .status(200)
      .json({ message: "Flipcard updated successfully", flipcardItem });
  } catch (error) {
    res.status(500).json({ message: "Error updating flipcard", error });
  }
};

exports.deleteFlipcardInCategory = async (req, res) => {
  try {
    const { category, stateName } = req.body;
    // console.log("Category:", category, "State Name:", stateName);

    // Find the Flipcard document that matches the category and contains the stateName
    const flipcard = await Flipcard.findOne({
      [category]: { $elemMatch: { stateName: stateName } },
    });

    // console.log("Found Flipcard:", flipcard);

    if (!flipcard || !flipcard[category]) {
      return res
        .status(404)
        .json({ message: "Flipcard not found for the specified category" });
    }

    // Remove the flipcard item from the specified category by matching stateName
    flipcard[category] = flipcard[category].filter(
      (item) => item.stateName !== stateName
    );

    // Save the updated document
    await flipcard.save();
    res.status(200).json({ message: "Flipcard deleted successfully" });
  } catch (error) {
    console.error("Error deleting Flipcard", error);
    res.status(500).json({ message: "Error deleting flipcard", error });
  }
};
