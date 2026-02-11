const State = require("../model/adminProduct");
const International = require("../model/International");
const Honeymoon = require("../model/Honeymoon");
const OfferHome = require("../model/Offer/OfferSchema");
const baseUrl = "https://elitetrips-backend.onrender.com/upload/";

// helper function to get proper image URL (handles Google Drive URLs and arrays)
const getImageUrl = (image) => {
  if (!image) return null;

  // Handle array - get first element
  if (Array.isArray(image)) {
    image = image[0];
    if (!image) return null;
  }

  // Handle string
  if (typeof image === 'string') {
    if (image.startsWith('http')) {
      // It's already a full URL (Google Drive)
      return image;
    }
    return baseUrl + image;
  }

  return null;
};

exports.getNationalStateImages = async (req, res) => {
  try {
    const { stateName } = req.params; // Get stateName from request parameters
    // Find the state by stateName
    // console.log(stateName)
    const state = await State.findOne({ stateName }).select("stateImage");
    // Check if the state exists
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    // Return the full URL for the state image
    res.json({ imageUrl: getImageUrl(state.stateImage) });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getInternNationalStateImages = async (req, res) => {
  try {
    const { stateName } = req.params; // Get stateName from request parameters
    // Find the state by stateName
    const state = await International.findOne({ stateName }).select(
      "stateImage"
    );
    // Check if the state exists
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    // Return the full URL for the state image
    res.json({ imageUrl: getImageUrl(state.stateImage) });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getHoneymoonStateImages = async (req, res) => {
  try {
    const { stateName } = req.params; // Get stateName from request parameters
    // Find the state by stateName
    const state = await Honeymoon.findOne({ stateName }).select("stateImage");
    // Check if the state exists
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    // Return the full URL for the state image
    res.json({ imageUrl: getImageUrl(state.stateImage) });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOfferHomeStateImages = async (req, res) => {
  try {
    const { stateName } = req.params; // Get stateName from request parameters
    // Find the state by stateName
    const state = await OfferHome.findOne({ stateName }).select("stateImage");
    // Check if the state exists
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    // Return the full URL for the state image
    res.json({ imageUrl: getImageUrl(state.stateImage) });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
