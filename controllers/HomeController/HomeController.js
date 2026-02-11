const VideoPage = require("../../model/Videopage/Videopage");
const FooterIcons = require("../../model/Footer/FooterIcons");
const HomeVideo = require("../../model/HomeVideo");
const HeroImage = require("../../model/HeroImage");
const OfferHomePage = require("../../model/Offer/HomeOffer");
const HomeBanner = require("../../model/Homepage/HomeBanner");
const HomeInternational = require("../../model/Homepage/HomeInternational");
const HomeNational = require("../../model/Homepage/HomeNational");
const HomeHoneymoon = require("../../model/Homepage/HomeHoneymoon");
const States = require("../../model/adminProduct");
const International = require("../../model/International");
const Honeymoon = require("../../model/Honeymoon");
const NavOffer = require("../../model/Offer/NavOffer");
const ExploreAdventure = require("../../model/Homepage/ExploreAdventure");
const Youtube = require("../../model/YoutubeSchema");
const Gallery = require("../../model/GalleryPage");
const baseUrl = "https://elitetrips-backend.onrender.com/upload/";

// helper function to convert Google Drive URL to lh3 format
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

exports.addExploreAdventure = async (req, res) => {
  try {
    const exploreAdventure = new ExploreAdventure(req.body);
    if (req.files) {
      if (req.files.video) {
        exploreAdventure.video = req.files.video[0].filename;
      }
      if (req.files.image) {
        exploreAdventure.image = req.files.image[0].filename;
      }
    }
    await exploreAdventure.save();
    res.status(201).json(exploreAdventure);
  } catch (error) {
    console.error("Error adding exploreAdventure:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Read - Get all ExploreAdventure entries
exports.getAllExploreAdventures = async (req, res) => {
  try {
    const exploreAdventures = await ExploreAdventure.find();
    res.status(200).json(exploreAdventures);
  } catch (error) {
    console.error("Error fetching explore adventures:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getExploreAdventure = async (req, res) => {
  try {
    const exploreAdventures = await ExploreAdventure.find();

    if (!exploreAdventures || exploreAdventures.length === 0) {
      return res.status(404).json({ message: "No Explore Adventures found" });
    }

    // Map over the results to create full URLs for images and videos
    const adventuresWithMediaUrls = exploreAdventures.map((adventure) => ({
      ...adventure._doc,
      image: adventure.image.map((img) => `${baseUrl}${img}`),
      video: adventure.video.map((vid) => `${baseUrl}${vid}`),
    }));

    res.status(200).json(adventuresWithMediaUrls);
  } catch (error) {
    console.error("Error fetching explore adventures:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateExploreAdventure = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // console.log(updateData);
    if (req.files) {
      // Handle backgroundVideo (single video)
      if (req.files.video) {
        updateData.video = req.files.video[0].filename;
      }
      if (req.files.image) {
        updateData.image = req.files.image[0].filename;
      }
    }

    const exploreAdventure = await ExploreAdventure.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    );

    if (!exploreAdventure) {
      return res.status(404).json({ message: "ExploreAdventure not found" });
    }

    res.status(200).json(exploreAdventure);
  } catch (error) {
    console.error("Error updating explore adventure:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete - Remove an ExploreAdventure by ID
exports.deleteExploreAdventure = async (req, res) => {
  try {
    const { id } = req.params;
    const exploreAdventure = await ExploreAdventure.findByIdAndDelete(id);

    if (!exploreAdventure) {
      return res.status(404).json({ message: "ExploreAdventure not found" });
    }

    res.status(200).json({ message: "ExploreAdventure deleted successfully" });
  } catch (error) {
    console.error("Error deleting explore adventure:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllStatesNational = async (req, res) => {
  try {
    const states = await States.find({}, { stateName: 1, _id: 0 });
    res.status(200).json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getAllStatesInternNational = async (req, res) => {
  try {
    const states = await International.find({}, { stateName: 1, _id: 0 });
    res.status(200).json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getAllStatesHoneymoon = async (req, res) => {
  try {
    const states = await Honeymoon.find({}, { stateName: 1, _id: 0 });
    res.status(200).json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addVideoPage = async (req, res) => {
  try {
    const tripDetails = req.body;

    let backgroundVideo = null;
    let backgroundImage = null;
    let mediaType = req.body.mediaType || 'video';

    // Check for Google Drive URL for video
    if (req.body.videoUrl) {
      backgroundVideo = req.body.videoUrl; // Store the Google Drive video URL directly
      mediaType = 'video';
    }
    // Check for Google Drive URL for image
    else if (req.body.imageUrl) {
      backgroundImage = convertGoogleDriveUrl(req.body.imageUrl);
      mediaType = 'image';
    } else if (req.files) {
      // Handle backgroundVideo (single video)
      if (req.files.backgroundVideo) {
        backgroundVideo = req.files.backgroundVideo[0].filename;
        mediaType = 'video';
      }
      // Handle backgroundImage (single image)
      if (req.files.backgroundImage) {
        backgroundImage = req.files.backgroundImage[0].filename;
        mediaType = 'image';
      }
    }

    // Extract type from request body
    const { type } = tripDetails;

    // Create a new trip with the details
    const trip = new VideoPage({
      type,
      backgroundVideo,
      backgroundImage,
      mediaType,
    });

    await trip.save();
    res.status(201).json({ message: "Trip created successfully", VideoPage: trip });
  } catch (error) {
    console.error("Error creating trip:", error);
    res
      .status(500)
      .json({ message: "Failed to create trip", error: error.message });
  }
};

exports.getAllVideoPages = async (req, res) => {
  try {
    const videoPages = await VideoPage.find({});
    const videoPagesWithFullUrl = videoPages.map((videoPage) => {
      const result = {
        ...videoPage.toObject(),
        mediaType: videoPage.mediaType || 'video',
      };

      // Handle backgroundVideo
      if (videoPage.backgroundVideo) {
        if (videoPage.backgroundVideo.startsWith('http')) {
          result.backgroundVideo = videoPage.backgroundVideo;
        } else {
          result.backgroundVideo = baseUrl + videoPage.backgroundVideo;
        }
      }

      // Handle backgroundImage
      if (videoPage.backgroundImage) {
        if (videoPage.backgroundImage.startsWith('http')) {
          result.backgroundImage = convertGoogleDriveUrl(videoPage.backgroundImage);
        } else {
          result.backgroundImage = baseUrl + videoPage.backgroundImage;
        }
      }

      return result;
    });
    res.json(videoPagesWithFullUrl);
  } catch (error) {
    console.error("Error fetching video pages:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch video pages", error: error.message });
  }
};

exports.getVideoPageById = async (req, res) => {
  try {
    const videoPage = await VideoPage.findById(req.params.id);
    if (!videoPage) {
      return res.status(404).json({ message: "Video page not found" });
    }
    res.json(videoPage);
  } catch (error) {
    console.error("Error fetching video page:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch video page", error: error.message });
  }
};

exports.updateVideoPage = async (req, res) => {
  try {
    // Find the existing video page by ID
    const videoPage = await VideoPage.findById(req.params.id);

    // Check if video page exists
    if (!videoPage) {
      return res.status(404).json({ message: "Video page not found" });
    }

    // Update fields with req.body values
    videoPage.type = req.body.type || videoPage.type;

    // Check for Google Drive URL for video
    if (req.body.videoUrl) {
      videoPage.backgroundVideo = req.body.videoUrl; // Store the Google Drive video URL directly
      videoPage.backgroundImage = null;
      videoPage.mediaType = 'video';
    }
    // Check for Google Drive URL for image
    else if (req.body.imageUrl) {
      videoPage.backgroundImage = convertGoogleDriveUrl(req.body.imageUrl);
      videoPage.backgroundVideo = null;
      videoPage.mediaType = 'image';
    } else if (req.files) {
      // Handle backgroundVideo (single video)
      if (req.files.backgroundVideo && req.files.backgroundVideo.length > 0) {
        videoPage.backgroundVideo = req.files.backgroundVideo[0].filename;
        videoPage.backgroundImage = null;
        videoPage.mediaType = 'video';
      }
      // Handle backgroundImage (single image)
      if (req.files.backgroundImage && req.files.backgroundImage.length > 0) {
        videoPage.backgroundImage = req.files.backgroundImage[0].filename;
        videoPage.backgroundVideo = null;
        videoPage.mediaType = 'image';
      }
    }

    // Update mediaType if provided
    if (req.body.mediaType) {
      videoPage.mediaType = req.body.mediaType;
    }

    // Save the updated video page
    const updatedVideoPage = await videoPage.save();

    // Return the updated video page
    res.json(updatedVideoPage);
  } catch (error) {
    console.error("Error updating video page:", error);
    res
      .status(500)
      .json({ message: "Failed to update video page", error: error.message });
  }
};

exports.deleteVideoPage = async (req, res) => {
  try {
    const videoPage = await VideoPage.findByIdAndDelete(req.params.id);
    if (!videoPage) {
      return res.status(404).json({ message: "Video page not found" });
    }
    res.json({ message: "Video page deleted successfully" });
  } catch (error) {
    console.error("Error deleting video page:", error);
    res
      .status(500)
      .json({ message: "Failed to delete video page", error: error.message });
  }
};

exports.addFooterIcon = async (req, res) => {
  try {
    const { name, url } = req.body;
    const footerDetails = { name, url };

    // Check if files are present and assign the iconImage if available
    if (req.files && req.files.iconImage) {
      if (Array.isArray(req.files.iconImage)) {
        // If multiple files are uploaded
        footerDetails.iconImage = req.files.iconImage.map(
          (file) => file.filename
        );
      } else {
        // If a single file is uploaded
        footerDetails.iconImage = [req.files.iconImage.filename];
      }
    }

    // Create a new FooterIcons document with the details
    const footerIcon = new FooterIcons(footerDetails);
    await footerIcon.save();

    // Send a success response with the created footer icon
    res.status(201).json({
      message: "Footer icon created successfully",
      footerIcon,
    });
  } catch (error) {
    console.error("Error adding footer icon:", error);
    res.status(500).json({
      message: "Failed to add footer icon",
      error: error.message,
    });
  }
};
exports.getFooterIcons = async (req, res) => {
  try {
    const footerIcons = await FooterIcons.find({});

    // Map through the icons and construct the full URL for each iconImage
    const iconsWithFullUrl = footerIcons.map((icon) => ({
      ...icon._doc, // Spread the icon document
      iconImage: icon.iconImage.map((image) => baseUrl + image), // Create full URL for each image
    }));

    res.json(iconsWithFullUrl);
  } catch (error) {
    console.error("Error fetching footer icons:", error);
    res.status(500).json({
      message: "Failed to fetch footer icons",
      error: error.message,
    });
  }
};

exports.getFooterIconById = async (req, res) => {
  try {
    const footerIcon = await FooterIcons.findById(req.params.id);
    if (!footerIcon) {
      return res.status(404).json({ message: "Footer icon not found" });
    }
    res.json(footerIcon);
  } catch (error) {
    console.error("Error fetching footer icon:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch footer icon", error: error.message });
  }
};

const fs = require("fs");
const path = require("path");

exports.updateFooterIcon = async (req, res) => {
  try {
    const footerIconId = req.params.id;

    // Fetch the current footer icon data
    const currentFooterIcon = await FooterIcons.findById(footerIconId);
    if (!currentFooterIcon) {
      return res.status(404).json({ message: "Footer icon not found" });
    }

    // Check if there's a new image file in the request
    if (req.files && req.files.iconImage) {
      // Get the old image filenames
      const oldImages = currentFooterIcon.iconImage;

      // Construct paths and delete old images
      oldImages.forEach((oldImage) => {
        const oldImagePath = path.join(__dirname, "upload", oldImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      });

      // Update the footer icon data with the new image filenames
      if (Array.isArray(req.files.iconImage)) {
        // If multiple files are uploaded
        req.body.iconImage = req.files.iconImage.map((file) => file.filename);
      } else {
        // If a single file is uploaded
        req.body.iconImage = [req.files.iconImage.filename];
      }
    }

    // Update the footer icon in the database
    const updatedFooterIcon = await FooterIcons.findByIdAndUpdate(
      footerIconId,
      req.body,
      { new: true }
    );

    if (!updatedFooterIcon) {
      return res.status(404).json({ message: "Failed to update footer icon" });
    }

    res.json(updatedFooterIcon);
  } catch (error) {
    console.error("Error updating footer icon:", error);
    res.status(500).json({
      message: "Failed to update footer icon",
      error: error.message,
    });
  }
};

exports.deleteFooterIcon = async (req, res) => {
  try {
    const footerIcon = await FooterIcons.findByIdAndDelete(req.params.id);
    if (!footerIcon) {
      return res.status(404).json({ message: "Footer icon not found" });
    }
    res.json({ message: "Footer icon deleted successfully" });
  } catch (error) {
    console.error("Error deleting footer icon:", error);
    res
      .status(500)
      .json({ message: "Failed to delete footer icon", error: error.message });
  }
};

exports.addHomeVideo = async (req, res) => {
  try {
    const { video } = req.body; // Accept video URL from request body

    if (!video) {
      return res.status(400).json({ message: "Video URL is required" });
    }

    // Check if a home video already exists
    const existingVideo = await HomeVideo.findOne({});

    if (existingVideo) {
      // Update existing video
      existingVideo.video = Array.isArray(video) ? video : [video];
      await existingVideo.save();
      return res.status(200).json({
        message: "Home video updated successfully",
        data: existingVideo
      });
    }

    // Create new home video if doesn't exist
    const videoArray = Array.isArray(video) ? video : [video];
    const homeVideo = new HomeVideo({ video: videoArray });
    await homeVideo.save();

    res.status(201).json({
      message: "Home video added successfully",
      data: homeVideo
    });
  } catch (error) {
    console.error("Error adding home video:", error);
    res.status(500).json({
      message: "Failed to add home video",
      error: error.message
    });
  }
};

exports.getHomeVideo = async (req, res) => {
  try {
    const homeVideo = await HomeVideo.findOne({});
    if (!homeVideo) {
      return res.status(404).json({ message: "Home video not found" });
    }

    // Return the video URLs directly (no base URL needed for external links)
    res.json({ ...homeVideo.toObject() });
  } catch (error) {
    console.error("Error fetching home video:", error);
    res.status(500).json({
      message: "Failed to fetch home video",
      error: error.message
    });
  }
};

exports.updateHomeVideo = async (req, res) => {
  try {
    const { video } = req.body; // Accept video URL from request body

    if (!video) {
      return res.status(400).json({ message: "Video URL is required" });
    }

    const videoArray = Array.isArray(video) ? video : [video];

    const updatedHomeVideo = await HomeVideo.findOneAndUpdate(
      {},
      { video: videoArray },
      { new: true, upsert: true } // Create if doesn't exist
    );

    res.json({
      message: "Home video updated successfully",
      data: updatedHomeVideo
    });
  } catch (error) {
    console.error("Error updating home video:", error);
    res.status(500).json({
      message: "Failed to update home video",
      error: error.message
    });
  }
};

exports.deleteHomeVideo = async (req, res) => {
  try {
    const deletedHomeVideo = await HomeVideo.deleteOne({});
    if (!deletedHomeVideo) {
      return res.status(404).json({ message: "Home video not found" });
    }
    res.json({ message: "Home video deleted successfully" });
  } catch (error) {
    console.error("Error deleting home video:", error);
    res
      .status(500)
      .json({ message: "Failed to delete home video", error: error.message });
  }
};

// ==================== HERO IMAGE CONTROLLERS ====================

// Create or Update Hero Image
exports.createHeroImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    // Convert Google Drive URL to lh3 format
    const convertedUrl = convertGoogleDriveUrl(imageUrl);

    // Upsert - update if exists, create if not
    const heroImage = await HeroImage.findOneAndUpdate(
      {},
      { image: convertedUrl, imageUrl: imageUrl },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Hero image saved successfully",
      data: heroImage
    });
  } catch (error) {
    console.error("Error saving hero image:", error);
    res.status(500).json({
      message: "Failed to save hero image",
      error: error.message
    });
  }
};

// Get Hero Image
exports.getHeroImage = async (req, res) => {
  try {
    const heroImage = await HeroImage.findOne({});
    if (!heroImage) {
      return res.status(404).json({ message: "Hero image not found" });
    }

    res.status(200).json({
      image: heroImage.image,
      imageUrl: heroImage.imageUrl
    });
  } catch (error) {
    console.error("Error fetching hero image:", error);
    res.status(500).json({
      message: "Failed to fetch hero image",
      error: error.message
    });
  }
};

// Delete Hero Image
exports.deleteHeroImage = async (req, res) => {
  try {
    const deletedImage = await HeroImage.deleteOne({});
    if (!deletedImage.deletedCount) {
      return res.status(404).json({ message: "Hero image not found" });
    }
    res.json({ message: "Hero image deleted successfully" });
  } catch (error) {
    console.error("Error deleting hero image:", error);
    res.status(500).json({
      message: "Failed to delete hero image",
      error: error.message
    });
  }
};

exports.addOfferHome = async (req, res) => {
  try {
    const { status } = req.body;
    let image = [];

    // Check if there are uploaded files
    if (req.files) {
      // Check if 'image' files are included
      if (req.files.image) {
        if (Array.isArray(req.files.image)) {
          image = req.files.image.map((file) => file.filename); // Multiple images
        } else {
          image = [req.files.image.filename]; // Single image
        }
      }
      if (req.files.phoneImage) {
        if (Array.isArray(req.files.phoneImage)) {
          phoneImage = req.files.phoneImage.map((file) => file.filename); // Multiple phoneImages
        } else {
          phoneImage = [req.files.phoneImage.filename]; // Single image
        }
      }
    }

    // Create a new offer document
    const newOffer = new OfferHomePage({
      image: image,
      status: status,
      phoneImage: phoneImage,
    });

    // Save the new offer to the database
    await newOffer.save();

    // Send a success response
    res.status(201).json({
      message: "Offer added successfully",
      data: newOffer,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      message: "Error adding offer",
      error: error.message,
    });
  }
};

exports.getOfferHome = async (req, res) => {
  try {
    // Fetch all offers regardless of their status
    const offers = await OfferHomePage.find();

    if (offers.length > 0) {
      // Send the offers within a data object
      res.json({
        success: true,
        data: offers,
      });
    } else {
      // Send a response if no offers are found
      res.status(404).json({
        success: false,
        message: "No offers found",
        data: [],
      });
    }
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      success: false,
      message: "Error fetching offers",
      error: error.message,
    });
  }
};

exports.getOfferHomeDisplay = async (req, res) => {
  try {
    // Base URL for images
    const baseUrl = "https://elitetrips-backend.onrender.com/upload/";

    // Fetch all offers regardless of their status
    const offers = await OfferHomePage.find();

    if (offers.length > 0) {
      // Map through offers to append the full image URLs
      const offersWithImages = offers.map((offer) => ({
        ...offer._doc,
        image: `${baseUrl}${offer.image}`,
        phoneImage: `${baseUrl}${offer.phoneImage}`,
      }));

      // Send the offers with the constructed image URLs
      res.json({
        success: true,
        data: offersWithImages,
      });
    } else {
      // Send a response if no offers are found
      res.status(404).json({
        success: false,
        message: "No offers found",
        data: [],
      });
    }
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      success: false,
      message: "Error fetching offers",
      error: error.message,
    });
  }
};

exports.updateOfferHomeStatus = async (req, res) => {
  try {
    // Fetch the offer with the given ID
    const offer = await OfferHomePage.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Toggle the status of the offer
    offer.status = !offer.status;

    // Check if a new image is uploaded
    if (req.files && req.files.image) {
      if (Array.isArray(req.files.image)) {
        // If multiple images are uploaded
        offer.image = req.files.image.map((file) => file.filename);
      } else {
        // If a single image is uploaded
        offer.image = [req.files.image.filename];
      }
    }
    if (req.files && req.files.phoneImage) {
      if (Array.isArray(req.files.phoneImage)) {
        // If multiple phoneImages are uploaded
        offer.phoneImage = req.files.phoneImage.map((file) => file.filename);
      } else {
        // If a single phoneImage is uploaded
        offer.phoneImage = [req.files.phoneImage.filename];
      }
    }

    // Save the updated offer
    await offer.save();

    // Send the updated offer
    res.json(offer);
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      message: "Error updating offer",
      error: error.message,
    });
  }
};

exports.deleteOfferHome = async (req, res) => {
  try {
    // Fetch the offer with the given ID
    const offer = await OfferHomePage.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    // Send a success response
    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      message: "Error deleting offer",
      error: error.message,
    });
  }
};

exports.addHomeBanner = async (req, res) => {
  try {
    const bannerDetails = req.body;

    // Handle image upload if present
    if (req.files && req.files.image) {
      // Assuming `req.files.image` is an array of uploaded images
      bannerDetails.image = req.files.image.map((file) => file.filename);
    }

    // Extract the required fields from the request body
    const { title, description, link } = bannerDetails;

    // Create a new HomeBanner with the provided details
    const homeBanner = new HomeBanner({
      title,
      description,
      image: bannerDetails.image, // Array of image filenames
      link,
    });

    // Save the banner in the database
    await homeBanner.save();
    res
      .status(201)
      .json({ message: "Home banner created successfully", homeBanner });
  } catch (error) {
    console.error("Error creating home banner:", error);
    res
      .status(500)
      .json({ message: "Failed to create home banner", error: error.message });
  }
};

exports.getHomeBanner = async (req, res) => {
  try {
    // Fetch all banners from the database
    const banners = await HomeBanner.find();

    // Map the banners to include the full image URL
    const bannerWithFullUrl = banners.map((banner) => ({
      _id: banner._id,
      title: banner.title,
      description: banner.description,
      image: baseUrl + banner.image, // Append the baseUrl to the image path
      link: banner.link,
    }));

    res.status(200).json(bannerWithFullUrl);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch banners", error: error.message });
  }
};

exports.deleteHomeBanner = async (req, res) => {
  try {
    // Fetch the banner with the given ID
    const banner = await HomeBanner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Home banner not found" });
    }
    // Send a success response
    res.json({ message: "Home banner deleted successfully" });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      message: "Error deleting home banner",
      error: error.message,
    });
  }
};

exports.updateHomeBanner = async (req, res) => {
  try {
    const bannerId = req.params.id;
    const updateDetails = req.body;

    // Handle image update if present
    if (req.files && req.files.image) {
      // Assuming `req.files.image` is an array of uploaded images
      updateDetails.image = req.files.image.map((file) => file.filename);
    }

    // Find the banner by ID and update its details
    const updatedBanner = await HomeBanner.findByIdAndUpdate(
      bannerId,
      {
        $set: updateDetails, // Update the fields based on the request body
      },
      { new: true } // Return the updated document
    );

    if (!updatedBanner) {
      return res.status(404).json({ message: "Home banner not found" });
    }

    // Send a success response with the updated banner details
    res.status(200).json({
      message: "Home banner updated successfully",
      updatedBanner,
    });
  } catch (error) {
    console.error("Error updating home banner:", error);
    res.status(500).json({
      message: "Failed to update home banner",
      error: error.message,
    });
  }
};

exports.addHomeInternational = async (req, res) => {
  const { entryId, stateId, tripName } = req.body;
  // console.log(entryId, stateId, tripName);
  try {
    const state = await International.findById(stateId);
    if (!state) {
      return res.status(404).json({ message: "No state found" });
    }

    const trip = state.trips.find((trip) => trip._id.toString() === entryId);
    if (!trip) {
      return res
        .status(404)
        .json({ message: "No trip found in the specified state" });
    }
    if (!trip._id) {
      return res.status(400).json({ message: "Invalid trip ID" });
    }

    // Ensure trip ID is being assigned correctly
    const newHomeNational = new HomeInternational({
      tripName,
      tripId: trip._id, // Make sure this is correctly referencing the trip's _id
      stateId: state._id,
      isChosen: true,
    });

    // Check for existing package
    const existingPackage = await HomeInternational.findOne({
      tripId: trip._id, // Check against the trip ID
      stateId: state._id,
    });

    if (existingPackage) {
      return res.status(400).json({ message: "Package already chosen" });
    }

    // Save the new HomeNational entry
    await newHomeNational.save();

    res
      .status(200)
      .json({ message: "Package chosen successfully", trip: newHomeNational });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Package already exists" });
    }
    console.error("Error choosing package:", error);
    res.status(500).json({ message: "Failed to choose package", error });
  }
};

exports.getHomeInternational = async (req, res) => {
  try {
    // Fetch all states from the database
    const states = await International.find();

    // Process the states to get the stateName and corresponding tripNames
    const processedStates = states.map((state) => ({
      _id: state._id,
      stateName: state.stateName,
      trips: state.trips.map((trip) => ({
        _id: trip._id,
        tripName: trip.tripName || "",
      })),
    }));

    // Extract all tripNames from the details
    const tripNames = processedStates.flatMap((state) =>
      state.trips.map((trip) => trip.tripName)
    );

    // Send the processed data and tripNames to the frontend
    res.status(200).json({
      message: "States and trip names fetched successfully",
      data: processedStates,
      // tripNames, // Include the extracted tripNames in the response
    });
  } catch (error) {
    console.error("Error fetching home national banners:", error);
    res.status(500).json({
      message: "Failed to fetch home national banners",
      error: error.message,
    });
  }
};

exports.getHomeInternationalChosenPackage = async (req, res) => {
  try {
    const homeNational = await HomeInternational.find();

    if (!homeNational || homeNational.length === 0) {
      return res
        .status(404)
        .json({ message: "No home national package found" });
    }

    // Separate packages based on the `isChosen` value
    const chosenPackages = homeNational.filter((pkg) => pkg.isChosen === true);
    const notChosenPackages = homeNational.filter(
      (pkg) => pkg.isChosen === false
    );

    res.status(200).json({
      message: "Home international packages fetched successfully",
      chosenPackages,
      notChosenPackages,
    });
  } catch (error) {
    console.error("Error fetching home international packages:", error);
    res.status(500).json({
      message: "Failed to fetch home international packages",
      error: error.message,
    });
  }
};

exports.getHomeInternationalChosenPackageDisplay = async (req, res) => {
  // Base URL for images
  try {
    const homeInternationalPackages = await HomeInternational.find();
    if (!homeInternationalPackages || homeInternationalPackages.length === 0) {
      return res
        .status(404)
        .json({ message: "No home international packages found" });
    }

    const stateIds = homeInternationalPackages.map((pkg) => pkg.stateId);
    const internationalPackages = await International.find({
      _id: { $in: stateIds },
    });

    if (!internationalPackages || internationalPackages.length === 0) {
      return res.status(404).json({
        message: "No international packages found for the specified stateIds",
      });
    }

    const chosenPackages = [];
    for (const pkg of homeInternationalPackages) {
      // Find the corresponding international package by state ID
      const matchingInternationalPackage = internationalPackages.find(
        (intPkg) => intPkg._id.toString() === pkg.stateId.toString()
      );

      if (matchingInternationalPackage) {
        const matchingTrips = matchingInternationalPackage.trips.filter(
          (trip) => {
            const isTripIdMatch = trip._id.toString() === pkg.tripId.toString();
            return isTripIdMatch;
          }
        );

        if (matchingTrips.length > 0) {
          // Add the matched trips directly to the chosen packages array
          matchingTrips.forEach((trip) => {
            // Update the trip image URL using the base URL
            if (trip.tripImages && trip.tripImages.length > 0) {
              trip.tripImages = trip.tripImages.map(
                (image) => `${baseUrl}${image}`
              );
            }
            // Include the stateName and tripDate count from the matching international package
            const tripDateCount = trip.tripDates.length; // Count the trip dates
            const firstTripDate = trip.tripDates[0] || null; // Get the first trip date, or null if it doesn't exist

            const tripWithStateNameAndDate = {
              ...trip._doc,
              stateName: matchingInternationalPackage.stateName,
              tripDateCount, // Add the trip date count
              firstTripDate, // Add the first trip date
            };
            // Add the trip to the chosen packages array
            chosenPackages.push(tripWithStateNameAndDate);
          });
        } else {
          // console.log("No Matching Trips Found for Package:", pkg);
        }
      } else {
        // console.log(
        //   "No Matching International Package for State ID:",
        //   pkg.stateId
        // );
      }
    }

    if (chosenPackages.length === 0) {
      return res.status(404).json({
        message:
          "No chosen international packages found for the specified criteria",
      });
    }
    res.status(200).json({
      message: "Home international chosen packages fetched successfully",
      chosenPackages,
    });
  } catch (error) {
    console.error("Error fetching home international packages:", error);
    res.status(500).json({
      message: "Failed to fetch home international packages",
      error: error.message,
    });
  }
};
exports.getHomeNationalChosenPackageDisplay = async (req, res) => {
  // Base URL for images
  try {
    const homeInternationalPackages = await HomeNational.find();
    if (!homeInternationalPackages || homeInternationalPackages.length === 0) {
      return res
        .status(404)
        .json({ message: "No home international packages found" });
    }

    const stateIds = homeInternationalPackages.map((pkg) => pkg.stateId);
    const internationalPackages = await States.find({
      _id: { $in: stateIds },
    });

    if (!internationalPackages || internationalPackages.length === 0) {
      return res.status(404).json({
        message: "No international packages found for the specified stateIds",
      });
    }

    const chosenPackages = [];
    for (const pkg of homeInternationalPackages) {
      // Find the corresponding international package by state ID
      const matchingInternationalPackage = internationalPackages.find(
        (intPkg) => intPkg._id.toString() === pkg.stateId.toString()
      );

      if (matchingInternationalPackage) {
        const matchingTrips = matchingInternationalPackage.trips.filter(
          (trip) => {
            const isTripIdMatch = trip._id.toString() === pkg.tripId.toString();
            return isTripIdMatch;
          }
        );

        if (matchingTrips.length > 0) {
          // Add the matched trips directly to the chosen packages array
          matchingTrips.forEach((trip) => {
            // Update the trip image URL using the base URL
            if (trip.tripImages && trip.tripImages.length > 0) {
              trip.tripImages = trip.tripImages.map(
                (image) => `${baseUrl}${image}`
              );
            }
            // Include the stateName and tripDate count from the matching international package
            const tripDateCount = trip.tripDate.length; // Count the trip dates
            const firstTripDate = trip.tripDate[0] || null; // Get the first trip date, or null if it doesn't exist

            const tripWithStateNameAndDate = {
              ...trip._doc,
              stateName: matchingInternationalPackage.stateName,
              tripDateCount, // Add the trip date count
              firstTripDate, // Add the first trip date
            };
            // Add the trip to the chosen packages array
            chosenPackages.push(tripWithStateNameAndDate);
          });
        } else {
          // console.log("No Matching Trips Found for Package:", pkg);
        }
      } else {
        // console.log(
        //   "No Matching International Package for State ID:",
        //   pkg.stateId
        // );
      }
    }

    if (chosenPackages.length === 0) {
      return res.status(404).json({
        message:
          "No chosen international packages found for the specified criteria",
      });
    }
    res.status(200).json({
      message: "Home international chosen packages fetched successfully",
      chosenPackages,
    });
  } catch (error) {
    console.error("Error fetching home international packages:", error);
    res.status(500).json({
      message: "Failed to fetch home international packages",
      error: error.message,
    });
  }
};

exports.getHomeHoneymoonChosenPackageDisplay = async (req, res) => {
  // Base URL for images
  try {
    const homeInternationalPackages = await HomeHoneymoon.find();
    if (!homeInternationalPackages || homeInternationalPackages.length === 0) {
      return res
        .status(404)
        .json({ message: "No home international packages found" });
    }

    const stateIds = homeInternationalPackages.map((pkg) => pkg.stateId);
    const internationalPackages = await Honeymoon.find({
      _id: { $in: stateIds },
    });

    if (!internationalPackages || internationalPackages.length === 0) {
      return res.status(404).json({
        message: "No international packages found for the specified stateIds",
      });
    }

    const chosenPackages = [];
    for (const pkg of homeInternationalPackages) {
      // Find the corresponding international package by state ID
      const matchingInternationalPackage = internationalPackages.find(
        (intPkg) => intPkg._id.toString() === pkg.stateId.toString()
      );

      if (matchingInternationalPackage) {
        const matchingTrips = matchingInternationalPackage.trips.filter(
          (trip) => {
            const isTripIdMatch = trip._id.toString() === pkg.tripId.toString();
            return isTripIdMatch;
          }
        );

        if (matchingTrips.length > 0) {
          // Add the matched trips directly to the chosen packages array
          matchingTrips.forEach((trip) => {
            // Update the trip image URL using the base URL
            if (trip.tripImages && trip.tripImages.length > 0) {
              trip.tripImages = trip.tripImages.map(
                (image) => `${baseUrl}${image}`
              );
            }
            // Include the stateName from the matching international package
            const tripWithStateName = {
              ...trip._doc,
              stateName: matchingInternationalPackage.stateName,
            };
            // Add the trip to the chosen packages array
            chosenPackages.push(tripWithStateName);
          });
        } else {
          // console.log("No Matching Trips Found for Package:", pkg);
        }
      } else {
        // console.log(
        //   "No Matching International Package for State ID:",
        //   pkg.stateId
        // );
      }
    }

    if (chosenPackages.length === 0) {
      return res.status(404).json({
        message:
          "No chosen international packages found for the specified criteria",
      });
    }
    res.status(200).json({
      message: "Home international chosen packages fetched successfully",
      chosenPackages,
    });
  } catch (error) {
    console.error("Error fetching home international packages:", error);
    res.status(500).json({
      message: "Failed to fetch home international packages",
      error: error.message,
    });
  }
};

exports.deleteHomeInternational = async (req, res) => {
  try {
    // Fetch the banner with the given ID
    const banner = await HomeInternational.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res
        .status(404)
        .json({ message: "Home international banner not found" });
    }
    // Send a success response
    res.json({ message: "Home international banner deleted successfully" });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      message: "Error deleting home international banner",
      error: error.message,
    });
  }
};

exports.updateHomeInternational = async (req, res) => {
  try {
    const { state, batches, duration, location } = req.body;
    const bannerId = req.params.id; // Get the banner ID from the request parameters

    // Initialize an object to hold the updated details
    const updateDetails = { state, batches, duration, location };

    // Handle image upload if present
    if (req.files && req.files.image) {
      // Assuming `req.files.image` is an array of uploaded images
      // Fetch the existing banner
      const existingBanner = await HomeInternational.findById(bannerId);

      // If no banner is found, return a 404 error
      if (!existingBanner) {
        return res
          .status(404)
          .json({ message: "Home international banner not found" });
      }

      // Update the image array with new images
      updateDetails.image = req.files.image.map((file) => file.filename);
    }

    // Update the banner in the database
    const updatedBanner = await HomeInternational.findByIdAndUpdate(
      bannerId,
      updateDetails,
      { new: true }
    );

    // If the banner was successfully updated, return the updated banner
    if (updatedBanner) {
      res
        .status(200)
        .json({ message: "Home banner updated successfully", updatedBanner });
    } else {
      res.status(404).json({ message: "Home international banner not found" });
    }
  } catch (error) {
    console.error("Error updating home banner:", error);
    res
      .status(500)
      .json({ message: "Failed to update home banner", error: error.message });
  }
};

exports.addHomeNational = async (req, res) => {
  const { entryId, stateId, tripName } = req.body;
  // console.log(entryId, stateId, tripName);
  try {
    const state = await States.findById(stateId);
    if (!state) {
      return res.status(404).json({ message: "No state found" });
    }

    const trip = state.trips.find((trip) => trip._id.toString() === entryId);
    if (!trip) {
      return res
        .status(404)
        .json({ message: "No trip found in the specified state" });
    }
    if (!trip._id) {
      return res.status(400).json({ message: "Invalid trip ID" });
    }

    // Ensure trip ID is being assigned correctly
    const newHomeNational = new HomeNational({
      tripName,
      tripId: trip._id, // Make sure this is correctly referencing the trip's _id
      stateId: state._id,
      isChosen: true,
    });

    // Check for existing package
    const existingPackage = await HomeNational.findOne({
      tripId: trip._id, // Check against the trip ID
      stateId: state._id,
    });

    if (existingPackage) {
      return res.status(400).json({ message: "Package already chosen" });
    }

    // Save the new HomeNational entry
    await newHomeNational.save();

    res
      .status(200)
      .json({ message: "Package chosen successfully", trip: newHomeNational });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Package already exists" });
    }
    console.error("Error choosing package:", error);
    res.status(500).json({ message: "Failed to choose package", error });
  }
};

exports.getHomeNational = async (req, res) => {
  try {
    // Fetch all states from the database
    const states = await States.find();

    // Process the states to get the stateName and corresponding tripNames
    const processedStates = states.map((state) => ({
      _id: state._id,
      stateName: state.stateName,
      trips: state.trips.map((trip) => ({
        _id: trip._id,
        tripName: trip.tripName || "",
      })),
    }));

    // Extract all tripNames from the details
    const tripNames = processedStates.flatMap((state) =>
      state.trips.map((trip) => trip.tripName)
    );

    // Send the processed data and tripNames to the frontend
    res.status(200).json({
      message: "States and trip names fetched successfully",
      data: processedStates,
      // tripNames, // Include the extracted tripNames in the response
    });
  } catch (error) {
    console.error("Error fetching home national banners:", error);
    res.status(500).json({
      message: "Failed to fetch home national banners",
      error: error.message,
    });
  }
};

exports.getHomeNationalChosenPackage = async (req, res) => {
  try {
    const homeNational = await HomeNational.find();

    if (!homeNational || homeNational.length === 0) {
      return res
        .status(404)
        .json({ message: "No home national package found" });
    }

    // Separate packages based on the `isChosen` value
    const chosenPackages = homeNational.filter((pkg) => pkg.isChosen === true);
    const notChosenPackages = homeNational.filter(
      (pkg) => pkg.isChosen === false
    );

    res.status(200).json({
      message: "Home national packages fetched successfully",
      chosenPackages,
      notChosenPackages,
    });
  } catch (error) {
    console.error("Error fetching home national packages:", error);
    res.status(500).json({
      message: "Failed to fetch home national packages",
      error: error.message,
    });
  }
};

exports.deleteHomeNational = async (req, res) => {
  try {
    // Fetch the banner with the given ID
    const banner = await HomeNational.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res
        .status(404)
        .json({ message: "Home international banner not found" });
    }
    // Send a success response
    res.json({ message: "Home international banner deleted successfully" });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      message: "Error deleting home international banner",
      error: error.message,
    });
  }
};

exports.updateHomeNational = async (req, res) => { };

exports.addHomeHoneymoon = async (req, res) => {
  const { entryId, stateId, tripName } = req.body;
  // console.log(entryId, stateId, tripName);
  try {
    const state = await Honeymoon.findById(stateId);
    if (!state) {
      return res.status(404).json({ message: "No state found" });
    }

    const trip = state.trips.find((trip) => trip._id.toString() === entryId);
    if (!trip) {
      return res
        .status(404)
        .json({ message: "No trip found in the specified state" });
    }
    if (!trip._id) {
      return res.status(400).json({ message: "Invalid trip ID" });
    }

    // Ensure trip ID is being assigned correctly
    const newHomeNational = new HomeHoneymoon({
      tripName,
      tripId: trip._id, // Make sure this is correctly referencing the trip's _id
      stateId: state._id,
      isChosen: true,
    });

    // Check for existing package
    const existingPackage = await HomeHoneymoon.findOne({
      tripId: trip._id, // Check against the trip ID
      stateId: state._id,
    });

    if (existingPackage) {
      return res.status(400).json({ message: "Package already chosen" });
    }

    // Save the new HomeNational entry
    await newHomeNational.save();

    res
      .status(200)
      .json({ message: "Package chosen successfully", trip: newHomeNational });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Package already exists" });
    }
    console.error("Error choosing package:", error);
    res.status(500).json({ message: "Failed to choose package", error });
  }
};

exports.getHomeHoneymoon = async (req, res) => {
  try {
    // Fetch all states from the database
    const states = await Honeymoon.find();

    // Process the states to get the stateName and corresponding tripNames
    const processedStates = states.map((state) => ({
      _id: state._id,
      stateName: state.stateName,
      trips: state.trips.map((trip) => ({
        _id: trip._id,
        tripName: trip.tripName || "",
      })),
    }));

    // Extract all tripNames from the details
    const tripNames = processedStates.flatMap((state) =>
      state.trips.map((trip) => trip.tripName)
    );

    // Send the processed data and tripNames to the frontend
    res.status(200).json({
      message: "States and trip names fetched successfully",
      data: processedStates,
      // tripNames, // Include the extracted tripNames in the response
    });
  } catch (error) {
    console.error("Error fetching home national banners:", error);
    res.status(500).json({
      message: "Failed to fetch home national banners",
      error: error.message,
    });
  }
};

exports.deleteHomeHoneymoon = async (req, res) => {
  try {
    // Fetch the banner with the given ID
    const banner = await HomeHoneymoon.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res
        .status(404)
        .json({ message: "Home international banner not found" });
    }
    // Send a success response
    res.json({ message: "Home international banner deleted successfully" });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      message: "Error deleting home international banner",
      error: error.message,
    });
  }
};

exports.updateHomeHoneymoon = async (req, res) => {
  try {
    const { state, batches, duration, location } = req.body;
    const bannerId = req.params.id; // Get the banner ID from the request parameters

    // Initialize an object to hold the updated details
    const updateDetails = { state, batches, duration, location };

    // Handle image upload if present
    if (req.files && req.files.image) {
      // Assuming `req.files.image` is an array of uploaded images
      // Fetch the existing banner
      const existingBanner = await HomeHoneymoon.findById(bannerId);

      // If no banner is found, return a 404 error
      if (!existingBanner) {
        return res
          .status(404)
          .json({ message: "Home international banner not found" });
      }

      // Update the image array with new images
      updateDetails.image = req.files.image.map((file) => file.filename);
    }

    // Update the banner in the database
    const updatedBanner = await HomeHoneymoon.findByIdAndUpdate(
      bannerId,
      updateDetails,
      { new: true }
    );

    // If the banner was successfully updated, return the updated banner
    if (updatedBanner) {
      res
        .status(200)
        .json({ message: "Home banner updated successfully", updatedBanner });
    } else {
      res.status(404).json({ message: "Home international banner not found" });
    }
  } catch (error) {
    console.error("Error updating home banner:", error);
    res
      .status(500)
      .json({ message: "Failed to update home banner", error: error.message });
  }
};

exports.getHomeHoneymoonChosenPackage = async (req, res) => {
  try {
    const homeNational = await HomeHoneymoon.find();

    if (!homeNational || homeNational.length === 0) {
      return res
        .status(404)
        .json({ message: "No home national package found" });
    }

    // Separate packages based on the `isChosen` value
    const chosenPackages = homeNational.filter((pkg) => pkg.isChosen === true);
    const notChosenPackages = homeNational.filter(
      (pkg) => pkg.isChosen === false
    );

    res.status(200).json({
      message: "Home honeymoon packages fetched successfully",
      chosenPackages,
      notChosenPackages,
    });
  } catch (error) {
    console.error("Error fetching home hooneymoon packages:", error);
    res.status(500).json({
      message: "Failed to fetch home honeymoon packages",
      error: error.message,
    });
  }
};

exports.addNavOffer = async (req, res) => {
  try {
    const { title, status } = req.body;
    const newNavOffer = new NavOffer({ title, status });
    await newNavOffer.save();
    res
      .status(200)
      .json({ message: "Navigation offer added successfully", newNavOffer });
  } catch (error) {
    console.error("Error adding navigation offer:", error);
    res.status(500).json({
      message: "Failed to add navigation offer",
      error: error.message,
    });
  }
};

exports.getNavOffer = async (req, res) => {
  try {
    const navOffer = await NavOffer.find();
    if (!navOffer || navOffer.length === 0) {
      return res.status(404).json({ message: "No navigation offer found" });
    }
    res
      .status(200)
      .json({ message: "Navigation offers fetched successfully", navOffer });
  } catch (error) {
    console.error("Error fetching navigation offers:", error);
    res.status(500).json({
      message: "Failed to fetch navigation offers",
      error: error.message,
    });
  }
};

exports.updateNavOffer = async (req, res) => {
  try {
    const { title, status } = req.body;
    const offerId = req.params.id;
    const updatedOffer = await NavOffer.findByIdAndUpdate(
      offerId,
      { title, status },
      { new: true }
    );
    if (!updatedOffer) {
      return res.status(404).json({ message: "Navigation offer not found" });
    }
    res
      .status(200)
      .json({ message: "Navigation offer updated successfully", updatedOffer });
  } catch (error) {
    console.error("Error updating navigation offer:", error);
    res.status(500).json({
      message: "Failed to update navigation offer",
      error: error.message,
    });
  }
};

exports.deleteNavOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    const deletedOffer = await NavOffer.findByIdAndDelete(offerId);
    if (!deletedOffer) {
      return res.status(404).json({ message: "Navigation offer not found" });
    }
    res.json({ message: "Navigation offer deleted successfully" });
  } catch (error) {
    console.error("Error deleting navigation offer:", error);
    res.status(500).json({
      message: "Failed to delete navigation offer",
      error: error.message,
    });
  }
};

// Create a new video
exports.createVideo = async (req, res) => {
  try {
    const { videoLink, title } = req.body;
    const newVideo = new Youtube({ videoLink, title });
    await newVideo.save();
    res.status(201).json({ message: "Video created successfully", newVideo });
  } catch (error) {
    res.status(500).json({ message: "Error creating video", error });
  }
};

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Youtube.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error });
  }
};

// Get a video by ID
exports.getVideoById = async (req, res) => {
  try {
    const video = await Youtube.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: "Error fetching video", error });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const { videoLink, title } = req.body;
    const video = await Youtube.findByIdAndUpdate(
      req.params.id,
      { videoLink, title },
      { new: true }
    );
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json({ message: "Video updated successfully", video });
  } catch (error) {
    res.status(500).json({ message: "Error updating video", error });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Youtube.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting video", error });
  }
};

exports.GalleryPage = async (req, res) => {
  try {
    const imagePaths = req.files.map((file) => file.path);
    console.log(imagePaths);
    const galleryPage = new Gallery({ images: imagePaths });
    await galleryPage.save();
    res
      .status(201)
      .json({ message: "Images uploaded successfully", galleryPage });
  } catch (error) {
    res.status(500).json({ message: "Error uploading images", error });
  }
};

exports.getGalleryPage = async (req, res) => {
  try {
    const galleries = await Gallery.find();
    res.status(200).json(galleries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching images", error });
  }
};

exports.addGalleryPage = async (req, res) => {
  const { id } = req.params;
  try {
    const imagePaths = req.files.map((file) => file.path);
    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      { $push: { images: { $each: imagePaths } } },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Images added successfully", updatedGallery });
  } catch (error) {
    res.status(500).json({ message: "Error adding images", error });
  }
};

exports.deleteGalleryPage = async (req, res) => {
  const { id, imagePath } = req.params;
  try {
    const gallery = await Gallery.findById(id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    gallery.images = gallery.images.filter((img) => img !== imagePath);
    await gallery.save();

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting image", error });
  }
};
