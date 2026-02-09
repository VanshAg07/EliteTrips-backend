const OfferSchema = require("../model/Offer/OfferSchema");
const baseUrl = "https://elitetrips-backend.onrender.com/upload/";

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
    const newState = new OfferSchema({ stateName });
    
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

exports.getStates = async (req, res) => {
  try {
    const states = await OfferSchema.find({});
    res.status(200).json(states);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving states", error: error.message });
  }
};

exports.getStateById = async (req, res) => {
  try {
    const state = await OfferSchema.findById(req.params.id);
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
    
    const updatedState = await OfferSchema.findByIdAndUpdate(
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
    const deletedState = await OfferSchema.findByIdAndDelete(req.params.id);
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

    // // Debug: Log the incoming request data
    // console.log("Request files:", req.files);
    // console.log("Request body:", req.body);

    // Initialize the PDFs array
    tripDetails.pdfs = [];

    // Check for uploaded files
    if (req.files) {
      // Handle tripImages (multiple images)
      if (req.files.tripImages) {
        tripDetails.tripImages = req.files.tripImages.map(
          (file) => file.filename
        );
      }

      // Handle tripBackgroundImg (single image)
      if (req.files.tripBackgroundImg) {
        tripDetails.tripBackgroundImg = req.files.tripBackgroundImg[0].filename;
      }

      // Handle multiple PDF uploads (array of PDF files)
      if (req.files.pdf) {
        // Ensure pdfStatus is an array
        const pdfStatuses = Array.isArray(req.body.pdfStatus)
          ? req.body.pdfStatus
          : [req.body.pdfStatus];

        // Ensure tripDetails.pdfs is initialized as an array
        if (!tripDetails.pdf) {
          tripDetails.pdf = [];
        }
        console.log(req.files.pdf);
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
    const state = await OfferSchema.findById(stateId);
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

exports.findStateAndTrip = async (req, res) => {
  let { stateName, tripName } = req.params;

  // Convert any "-" in tripName back to "/"
  tripName = tripName.replace(/-/g, "/");

  try {
    // Fetch the state and its associated trips (populated)
    const state = await OfferSchema.findOne({
      stateName: new RegExp(`^${stateName}$`, "i"),
    }).populate("trips");

    // If no state is found, return a 404 error
    if (!state) {
      return res.status(404).json({
        message: `No state found with the name: ${stateName}`,
      });
    }

    // Find the specific trip by tripName
    const trip = state.trips.find((trip) => trip.tripName === tripName);

    // If no trip is found, return a 404 error
    if (!trip) {
      return res.status(404).json({
        message: `No trip found with the exact name: ${tripName} in state: ${stateName}`,
      });
    }

    // Base URL for fetching images and files

    // Append the base URL to media fields (tripImages, pdf, tripBackgroundImg)
    const tripImages = trip.tripImages.map((image) => `${baseUrl}${image}`);
    const tripBackgroundImg = `${baseUrl}${trip.tripBackgroundImg}`;

    // Filter for active PDF files
    const activePdf = trip.pdf.find((pdfItem) => pdfItem.status === "active");
    const tripPdf = activePdf ? `${baseUrl}${activePdf.filename}` : null;

    // Filter trip dates to include only dates that are today or in the future
    const filteredTripDates = trip.tripDate.filter(
      (date) => new Date(date) >= new Date()
    );

    res.status(200).json({
      state: {
        stateName: state.stateName,
      },
      trip: {
        tripName: trip.tripName,
        tripPrice: trip.tripPrice,
        tripQuantity: trip.tripQuantity,
        tripDate: filteredTripDates, // Send only the filtered dates
        tripLocation: trip.tripLocation,
        tripDuration: trip.tripDuration,
        tripInclusions: trip.tripInclusions,
        tripExclusions: trip.tripExclusions,
        tripItinerary: trip.tripItinerary,
        tripImages: tripImages, // Send the updated image URLs
        pdf: tripPdf, // Send the active PDF URL
        tripDescription: trip.tripDescription,
        tripBackgroundImg: tripBackgroundImg, // Send the updated background image URL
        sharing: trip.sharing,
        otherInfo: trip.otherInfo,
        pickAndDrop: trip.pickAndDrop,
        overView: trip.overView,
        tripBookingAmount: trip.tripBookingAmount,
        tripSeats: trip.tripSeats,
        customised: trip.customised,
        tripDates: trip.tripDates,
        tripOfferPrice: trip.tripOfferPrice,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAllStates = async (req, res) => {
  try {
    const states = await OfferSchema.find().populate("trips");
    const updatedStates = states.map((state) => {
      return {
        stateName: state.stateName,
        trips: state.trips
          .map((trip) => {
            // Filter tripDates array for future dates
            const filteredTripDates = trip.tripDates.filter(
              (dateObj) =>
                new Date(dateObj.tripDate).setHours(0, 0, 0, 0) >=
                new Date().setHours(0, 0, 0, 0)
            );

            // Exclude the trip if no valid future dates are found
            if (filteredTripDates.length === 0) {
              return null;
            }

            // Use the first available future date
            const tripDateToSend = filteredTripDates[0].tripDate;
            const tripDateCounts = filteredTripDates.length;

            return {
              tripName: trip.tripName,
              tripImages: trip.tripImages.map((image) => baseUrl + image), // Prepend baseUrl to each image path
              tripDate: tripDateToSend, // Send the first valid future date
              tripLocation: trip.tripLocation,
              tripDuration: trip.tripDuration, // Assuming tripDuration is an array, include it directly
              tripPrice: trip.tripPrice,
              tripOfferPrice: trip.tripOfferPrice,
              tripDateCount: tripDateCounts > 0 ? tripDateCounts : undefined, // Send count if greater than 0
            };
          })
          .filter((trip) => trip !== null), // Filter out null trips (no valid dates)
      };
    });

    // Filter out states with no valid trips
    const filteredStates = updatedStates.filter(
      (state) => state.trips.length > 0
    );

    res.status(200).json(filteredStates);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};