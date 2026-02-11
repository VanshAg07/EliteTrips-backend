const Honeymoon = require("../model/Honeymoon");
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

// helper function to get proper image URL (handles Google Drive URLs)
const getImageUrl = (image) => {
  if (!image) return image;

  // If it's an array, get the first element
  if (Array.isArray(image)) {
    image = image[0];
    if (!image) return '';
  }

  // Now handle the string
  if (typeof image === 'string' && image.startsWith('http')) {
    return image;
  }
  return baseUrl + image;
};

exports.createState = async (req, res) => {
  try {
    const { stateName, stateImageUrl } = req.body;

    if (!stateName) {
      return res.status(400).json({ message: "State name is required" });
    }

    const newState = new Honeymoon({ stateName });

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
    const states = await Honeymoon.find();
    res.status(200).json(states);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving states", error: error.message });
  }
};

exports.getStateById = async (req, res) => {
  try {
    const state = await Honeymoon.findById(req.params.id);
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

    const updatedState = await Honeymoon.findByIdAndUpdate(
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
    const deletedState = await Honeymoon.findByIdAndDelete(req.params.id);
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

exports.addTripToDatabase = async (req, res) => {
  try {
    const { stateId } = req.params;
    const tripDetails = req.body;

    // Check for Google Drive URLs for images
    if (req.body.tripImagesUrls) {
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

      // Handle PDF upload (single PDF) - PDF is now optional
      if (req.files.pdf) {
        // Ensure pdfStatus is an array
        const pdfStatuses = Array.isArray(req.body.pdfStatus)
          ? req.body.pdfStatus
          : [req.body.pdfStatus];

        // Ensure tripDetails.pdfs is initialized as an array
        if (!tripDetails.pdf) {
          tripDetails.pdf = [];
        }
        req.files.pdf.forEach((file, index) => {
          const pdf = {
            filename: file.filename,
            status: pdfStatuses[index] || "active",
          };
          tripDetails.pdf.push(pdf);
        });
      }
    }

    // Find the state by ID
    const state = await Honeymoon.findById(stateId);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    // Add trip details to the state's trips array
    state.trips.push(tripDetails);
    await state.save();
    res.status(201).json({ message: "Trip added to database", Honeymoon });
  } catch (error) {
    console.error("Error adding trip:", error);
    res
      .status(500)
      .json({ message: "Error adding trip to database", error: error.message });
  }
};

exports.getAllHoneymoonPackages = async (req, res) => {
  const baseUrl = "https://elitetrips-backend.onrender.com/upload/";
  try {
    const states = await Honeymoon.find().populate("trips");
    // Map through each state and its trips to add baseUrl to tripImages and pdf
    const updatedStates = states.map((state) => {
      return {
        stateName: state.stateName,
        trips: state.trips.map((trip) => ({
          tripName: trip.tripName,
          tripImages: trip.tripImages.map((image) => getImageUrl(image)), // Handle Google Drive URLs
          pdf: trip.pdf ? baseUrl + trip.pdf : null, // Prepend baseUrl to pdf path
          tripDate: trip.tripDate, // Assuming tripDates is an array, include it directly
          tripLocation: trip.tripLocation,
          tripDuration: trip.tripDuration, // Assuming tripDuration is an array, include it directly
          tripPrice: trip.tripPrice,
        })),
      };
    });
    res.status(200).json(updatedStates);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.findStateAndTrip = async (req, res) => {
  let { stateName, tripName } = req.params;
  tripName = tripName.replace(/-/g, "/");

  try {
    // Query the Honeymoon model for the matching state
    const honeymoonState = await Honeymoon.findOne({
      stateName: new RegExp(`^${stateName}$`, "i"),
    }).populate("trips");

    // Check if the state exists
    if (!honeymoonState) {
      return res.status(404).json({
        message: "State not found for the given state name.",
      });
    }
    // Find the trip inside the state's trips array (case insensitive)
    const honeymoonTrip = honeymoonState.trips.find(
      (trip) => trip.tripName === tripName
    );

    // Check if the trip exists within the state's trips array
    if (!honeymoonTrip) {
      return res.status(404).json({
        message: "Trip not found for the given state and trip name.",
      });
    }

    // Construct the image URLs for tripBackgroundImg, tripImages, and pdf
    let tripBackgroundImgUrl = getImageUrl(honeymoonTrip.tripBackgroundImg);

    let tripImagesUrls =
      honeymoonTrip.tripImages && honeymoonTrip.tripImages.length
        ? honeymoonTrip.tripImages.map((image) => getImageUrl(image))
        : [];

    let pdfUrls =
      honeymoonTrip.pdf && honeymoonTrip.pdf.length
        ? honeymoonTrip.pdf.map((pdfFile) => baseUrl + pdfFile)
        : [];

    // Send the response with the trip details
    res.status(200).json({
      stateName: honeymoonState.stateName,
      tripName: honeymoonTrip.tripName,
      tripDescription: honeymoonTrip.tripDescription,
      tripDuration: honeymoonTrip.tripDuration,
      tripBackgroundImg: tripBackgroundImgUrl,
      tripImages: tripImagesUrls,
      pdf: pdfUrls,
      pickAndDrop: honeymoonTrip.pickAndDrop,
      tripInclusions: honeymoonTrip.tripInclusions,
      tripExclusions: honeymoonTrip.tripExclusions,
      tripItinerary: honeymoonTrip.tripItinerary,
      overView: honeymoonTrip.overView,
    });
  } catch (error) {
    console.error("Error finding state and trip:", error);
    res.status(500).json({
      message: "Server error occurred while fetching the trip details.",
      error: error.message,
    });
  }
};

exports.nameAllStates = async (req, res) => {
  const { name } = req.params;

  try {
    // Find states by stateName (case-insensitive) and populate trips
    const states = await Honeymoon.find({
      stateName: new RegExp(name, "i"),
    }).populate("trips");

    // If no states are found, return a 404 error
    if (!states || states.length === 0) {
      return res
        .status(404)
        .json({ message: `No states found with the name: ${name}` });
    }

    // Modify each state and its trips to include the full URL for images, PDFs, etc.
    const modifiedStates = states.map((state) => {
      // Update the trips with full URLs for media fields
      const updatedTrips = state.trips.map((trip) => ({
        ...trip._doc, // spread the original trip document
        tripImages: trip.tripImages.map((image) => getImageUrl(image)),
      }));

      // Return the state along with the modified trips
      return {
        ...state._doc, // spread the original state document
        trips: updatedTrips,
      };
    });

    // Send the modified states in the response
    res.status(200).json(modifiedStates);
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.editHoneymoonPackages = async (req, res) => { };

exports.getSimilarTrips = async (req, res) => {
  const { stateName } = req.params;
  // console.log(stateName);
  try {
    // Find the state by stateName (case-insensitive)
    const state = await Honeymoon.findOne({
      stateName: new RegExp(stateName, "i"),
    }).populate("trips");

    // If the state is not found, return a 404 error
    if (!state) {
      return res
        .status(404)
        .json({ message: `No state found with the name: ${stateName}` });
    }

    // Base URL for fetching images and files
    const baseUrl = "https://elitetrips-backend.onrender.com/upload/";

    // Fetch all other states except the given stateName
    const otherStates = await Honeymoon.find({
      stateName: { $ne: stateName }, // Exclude the current state
    }).populate("trips");

    // Prepare the response in the desired structure
    const packages = otherStates.map((otherState) => {
      // Map the trips from each other state, modifying the image URLs
      const trips = otherState.trips.map((trip) => {
        // Return the trip object with modified image URLs
        return {
          ...trip._doc, // Spread the original trip document
          tripImages: trip.tripImages.map((image) => getImageUrl(image)), // Handle Google Drive URLs
        };
      });

      // Return an object for each state with the stateName and its corresponding trips
      return {
        stateName: otherState.stateName,
        trips: trips,
      };
    });

    // Filter out states with no trips
    const filteredPackages = packages.filter((pkg) => pkg.trips.length > 0);

    // If no similar trips found, return an empty array with a message
    if (filteredPackages.length === 0) {
      return res.status(200).json({
        message: `No similar trips found in other states for the state: ${stateName}`,
        packages: [],
      });
    }

    // Send the filtered packages in the response
    res.status(200).json(filteredPackages);
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
