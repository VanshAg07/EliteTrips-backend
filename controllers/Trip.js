const State = require("../model/adminProduct");

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

exports.createState = async (req, res) => {
  try {
    const { stateName, stateImageUrl } = req.body;

    if (!stateName) {
      return res.status(400).json({ message: "State name is required" });
    }

    const newState = new State({ stateName });

    // Check if Google Drive URL is provided
    if (stateImageUrl) {
      const convertedUrl = convertGoogleDriveUrl(stateImageUrl);
      newState.stateImage = [convertedUrl];
    }
    // Fallback to file upload if no URL provided
    else if (req.files && req.files.stateImage) {
      newState.stateImage = req.files.stateImage.map((file) => file.filename);
    }

    // Save the new state to the database
    const savedState = await newState.save();

    res.status(201).json(savedState);
  } catch (error) {
    console.error("Error creating state:", error);
    res
      .status(500)
      .json({ message: "Error creating state", error: error.message });
  }
};

exports.getAllStates = async (req, res) => {
  try {
    const states = await State.find();
    res.status(200).json(states);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving states", error: error.message });
  }
};

exports.getStateById = async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    res.status(200).json(state);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving state", error: error.message });
  }
};

exports.updateStateById = async (req, res) => {
  try {
    const { stateName, stateImageUrl } = req.body;
    const updateData = {};
    
    if (stateName) {
      updateData.stateName = stateName;
    }
    
    // Check if Google Drive URL is provided
    if (stateImageUrl) {
      const convertedUrl = convertGoogleDriveUrl(stateImageUrl);
      updateData.stateImage = [convertedUrl];
    }
    // Fallback to file upload if no URL provided
    else if (req.files && req.files.stateImage) {
      updateData.stateImage = req.files.stateImage.map((file) => file.filename);
    }
    
    const updatedState = await State.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedState) {
      return res.status(404).json({ message: "State not found" });
    }
    res.status(200).json(updatedState);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating state", error: error.message });
  }
};

exports.deleteStateById = async (req, res) => {
  try {
    const deletedState = await State.findByIdAndDelete(req.params.id);
    if (!deletedState) {
      return res.status(404).json({ message: "State not found" });
    }
    res.status(200).json({ message: "State deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting state", error: error.message });
  }
};
exports.addTripToState = async (req, res) => {
  try {
    const { stateId } = req.params;
    const tripDetails = req.body;
    // console.log("Request files:", req.files);
    console.log("Request body:", req.body);

    // Initialize the PDFs array
    tripDetails.pdfs = [];

    // Check for Google Drive URLs for images
    if (req.body.tripImagesUrls) {
      // Parse the URLs if they come as a JSON string
      let imageUrls = req.body.tripImagesUrls;
      if (typeof imageUrls === 'string') {
        try {
          imageUrls = JSON.parse(imageUrls);
        } catch (e) {
          imageUrls = [imageUrls];
        }
      }
      tripDetails.tripImages = imageUrls.map(url => convertGoogleDriveUrl(url));
    }
    
    // Check for Google Drive URL for background image
    if (req.body.tripBackgroundImgUrl) {
      tripDetails.tripBackgroundImg = convertGoogleDriveUrl(req.body.tripBackgroundImgUrl);
    }

    // Check for uploaded files
    if (req.files) {
      // Handle tripImages (multiple images) - only if not using Google Drive URLs
      if (req.files.tripImages && !req.body.tripImagesUrls) {
        tripDetails.tripImages = req.files.tripImages.map(
          (file) => file.filename
        );
      }

      // Handle tripBackgroundImg (single image) - only if not using Google Drive URL
      if (req.files.tripBackgroundImg && !req.body.tripBackgroundImgUrl) {
        tripDetails.tripBackgroundImg = req.files.tripBackgroundImg[0].filename;
      }

      // Handle multiple PDF uploads (array of PDF files) - PDF is now optional
      if (req.files.pdf) {
        // Ensure pdfStatus is an array
        const pdfStatuses = Array.isArray(req.body.pdfStatus)
          ? req.body.pdfStatus
          : [req.body.pdfStatus];

        // Ensure tripDetails.pdfs is initialized as an array
        if (!tripDetails.pdf) {
          tripDetails.pdf = [];
        }
        // console.log(req.files.pdf);
        req.files.pdf.forEach((file, index) => {
          const pdf = {
            filename: file.filename, // Access the filename directly from file
            status: pdfStatuses[index] || "active", // Default to "active" if not specified
          };
          tripDetails.pdf.push(pdf); // Push the pdf object into the tripDetails.pdfs array
        });
      }
    }

    // Find the state by ID
    const state = await State.findById(stateId);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    // Add trip details to the state's trips array
    state.trips.push(tripDetails);
    await state.save();

    res.status(201).json({ message: "Trip added to state", state });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding trip to state", error: error.message });
  }
};

exports.deleteTripFromState = async (req, res) => {
  try {
    const { stateId, tripId } = req.params;

    const state = await State.findById(stateId);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    state.trips = state.trips.filter((trip) => trip._id.toString() !== tripId);
    await state.save();

    res.status(200).json({ message: "Trip deleted successfully", state });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting trip", error: error.message });
  }
};
