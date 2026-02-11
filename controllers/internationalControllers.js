const International = require("../model/International");
const InternationalActivities = require("../model/InternationalParts/InternationalActivities");
const InternationalFlavours = require("../model/InternationalParts/InternationalFlavours");
const InternationalPlaces = require("../model/InternationalParts/InternationalPlaces");
const InternationalShops = require("../model/InternationalParts/InternationalShops");
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

    const newState = new International({ stateName });

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
    const states = await International.find();
    res.status(200).json(states);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving states", error: error.message });
  }
};

exports.getStateById = async (req, res) => {
  try {
    const state = await International.findById(req.params.id);
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

    const updatedState = await International.findByIdAndUpdate(
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
    const deletedState = await International.findByIdAndDelete(req.params.id);
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

exports.addInternationalPackage = async (req, res) => {
  try {
    const { stateId } = req.params;
    const tripDetails = req.body;
    tripDetails.pdfs = [];

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
    const state = await International.findById(stateId);
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

exports.getAllInternationals = async (req, res) => {
  try {
    const internationals = await International.find();
    res.json(internationals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addActivityInternational = async (req, res) => {
  try {
    const activityData = req.body;
    if (req.files && req.files.img && req.files.img.length > 0) {
      const imgFile = req.files.img[0];
      activityData.img = imgFile.filename;
    }
    const activity = new InternationalActivities(activityData);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error("Error adding activity:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.editActivityIntern = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the activity ID is passed as a route parameter
    const updatedData = req.body;

    // editActivityCheck if a new image is provided
    if (req.files && req.files.img && req.files.img.length > 0) {
      const imgFile = req.files.img[0];
      updatedData.img = imgFile.filename;
    }

    const activity = await InternationalActivities.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error("Error editing activity:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getBestActivitiesIntern = async (req, res) => {
  try {
    const activities = await InternationalActivities.find();
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

exports.getBestActivitiesByIdIntern = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await InternationalActivities.findById(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching activity by ID:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBestActivityIntern = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await InternationalActivities.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(400).json({ error: error.message });
  }
};
exports.addBeautifulPlacesInternational = async (req, res) => {
  try {
    const { stateName, location, title, description } = req.body;
    const imgFile = req.files["img"] ? req.files["img"][0] : null;
    const activityData = {
      stateName,
      location,
      title,
      description,
      img: imgFile.filename,
    };
    const activity = new InternationalPlaces(activityData);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error("Error adding place:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getBeautifulPlacesIntern = async (req, res) => {
  try {
    const activities = await InternationalPlaces.find();
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

exports.getBeautifulPlacesByIdIntern = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await InternationalPlaces.findById(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching activity by ID:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.editBeautifulPlacesIntern = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the activity ID is passed as a route parameter
    const updatedData = req.body;

    // editActivityCheck if a new image is provided
    if (req.files && req.files.img && req.files.img.length > 0) {
      const imgFile = req.files.img[0];
      updatedData.img = imgFile.filename;
    }

    const activity = await InternationalPlaces.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error("Error editing activity:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBeautifulPlacesIntern = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await InternationalPlaces.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.addRichFlavourInternational = async (req, res) => {
  try {
    const flavourData = req.body;
    if (req.files && req.files.img && req.files.img.length > 0) {
      const imgFile = req.files.img[0];
      flavourData.img = imgFile.filename;
    }
    const flavour = new InternationalFlavours(flavourData);
    await flavour.save();
    res.status(201).json(flavour);
  } catch (error) {
    console.error("Error adding rich flavour:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getFlavourIntern = async (req, res) => {
  try {
    const activities = await InternationalFlavours.find();
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};
exports.getRichFlavourByIdIntern = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await InternationalFlavours.findById(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching activity by ID:", error);
    res.status(400).json({ error: error.message });
  }
};
exports.deleteRichFlavourIntern = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await InternationalFlavours.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(400).json({ error: error.message });
  }
};
exports.editRichFlavourIntern = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the activity ID is passed as a route parameter
    const updatedData = req.body;

    // editActivityCheck if a new image is provided
    if (req.files && req.files.img && req.files.img.length > 0) {
      const imgFile = req.files.img[0];
      updatedData.img = imgFile.filename;
    }

    const activity = await InternationalFlavours.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error("Error editing activity:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.addShopInternational = async (req, res) => {
  try {
    const shopData = req.body;
    if (req.files && req.files.img && req.files.img.length > 0) {
      const imgFile = req.files.img[0];
      shopData.img = imgFile.filename;
    }
    const shop = new InternationalShops(shopData);
    await shop.save();
    res.status(201).json(shop);
  } catch (error) {
    console.error("Error adding shop:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getShopIntern = async (req, res) => {
  try {
    const activities = await InternationalShops.find();
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

exports.deleteShopIntern = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await InternationalShops.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(400).json({ error: error.message });
  }
};
exports.getShopsByIdIntern = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await InternationalShops.findById(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching activity by ID:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.editShopIntern = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the activity ID is passed as a route parameter
    const updatedData = req.body;

    // editActivityCheck if a new image is provided
    if (req.files && req.files.img && req.files.img.length > 0) {
      const imgFile = req.files.img[0];
      updatedData.img = imgFile.filename;
    }

    const activity = await InternationalShops.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error("Error editing activity:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getAllInternationalPackages = async (req, res) => {
  try {
    const states = await International.find().populate("trips");
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
              tripImages: trip.tripImages.map((image) => getImageUrl(image)), // Use getImageUrl to handle Google Drive URLs
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

exports.findStateAndTrip = async (req, res) => {
  let { stateName, tripName } = req.params;

  // Convert any "-" in tripName back to "/"
  tripName = tripName.replace(/-/g, "/");

  try {
    // Fetch the state and its associated trips (populated)
    const state = await International.findOne({
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
    const tripImages = trip.tripImages.map((image) => getImageUrl(image));
    const tripBackgroundImg = getImageUrl(trip.tripBackgroundImg);

    // Filter for active PDF files
    const activePdf = trip.pdf && trip.pdf.find((pdfItem) => pdfItem.status === "active");
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
        tripOfferPrice: trip.tripOfferPrice,
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
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.nameAllStates = async (req, res) => {
  const { name } = req.params;

  try {
    // Find states by stateName (case-insensitive) and populate trips
    const states = await International.find({
      stateName: new RegExp(name, "i"),
    }).populate("trips");

    // If no states are found, return a 404 error
    if (!states || states.length === 0) {
      return res
        .status(404)
        .json({ message: `No states found with the name: ${name}` });
    }

    // Base URL for fetching images and files

    // Modify each state and its trips to include only valid trip dates and full URLs for media fields
    const modifiedStates = states.map((state) => {
      // Update the trips to filter out any with no valid future trip dates
      const updatedTrips = state.trips
        .map((trip) => {
          // Filter trip dates to only include dates that are today or in the future
          const filteredTripDates = trip.tripDate.filter(
            (date) =>
              new Date(date).setHours(0, 0, 0, 0) >=
              new Date().setHours(0, 0, 0, 0)
          );

          // If there are no valid dates, exclude this trip
          if (filteredTripDates.length === 0) {
            return null;
          } // Use the first available future date
          const tripDateToSend = filteredTripDates[0];
          const tripDateCounts = filteredTripDates.length;

          // Return the trip with the filtered dates and updated URLs for media fields
          return {
            ...trip._doc, // Spread the original trip document
            tripImages: trip.tripImages.map((image) => getImageUrl(image)),
            tripDate: tripDateToSend, // Include only the valid dates
            tripDateCount: tripDateCounts > 0 ? tripDateCounts : undefined, // Include the count if greater than 0
          };
        })
        .filter((trip) => trip !== null); // Remove trips that were excluded

      // Return the state along with the modified trips
      return {
        ...state._doc, // Spread the original state document
        trips: updatedTrips,
      };
    });

    // Filter out states with no valid trips
    const filteredStates = modifiedStates.filter(
      (state) => state.trips.length > 0
    );

    // Send the modified states in the response
    res.status(200).json(filteredStates);
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getSimilarTrips = async (req, res) => {
  const { stateName } = req.params;
  // console.log(stateName)
  try {
    // Find the state by stateName (case-insensitive) and populate trips
    const state = await International.findOne({
      stateName: new RegExp(stateName, "i"),
    }).populate("trips");

    // If the state is not found, return a 404 error
    if (!state) {
      return res
        .status(404)
        .json({ message: `No state found with the name: ${stateName}` });
    }

    // Get the trip criteria based on the found state's trips
    const { trips } = state;
    if (trips.length === 0) {
      return res
        .status(404)
        .json({ message: `No trips found for the state: ${stateName}` });
    }

    // Base URL for fetching images and files

    // Fetch trips from other states, excluding the specified state
    const similarStates = await International.find({
      stateName: { $ne: stateName }, // Exclude the current state
    }).populate("trips");

    // Prepare the response in the desired structure
    const packages = similarStates.map((otherState) => {
      // Map trips from each state
      const trips = otherState.trips
        .map((trip) => {
          // Filter future trip dates
          const futureDates = trip.tripDate.filter(
            (date) =>
              new Date(date).setHours(0, 0, 0, 0) >=
              new Date().setHours(0, 0, 0, 0)
          );

          // Exclude trips with no future dates
          if (futureDates.length === 0) {
            return null;
          }

          // Return the trip with updated URLs and the first available future date
          return {
            ...trip._doc, // Spread the original trip document
            tripImages: trip.tripImages.map((image) => `${baseUrl}${image}`),
            tripDate: futureDates[0], // The nearest future date
            tripDateCount: futureDates.length,
          };
        })
        .filter((trip) => trip !== null); // Remove trips that don't meet criteria

      // Return an object for each package with stateName and its corresponding trips
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
