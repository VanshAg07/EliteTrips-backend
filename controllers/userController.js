const State = require("../model/adminProduct");
const BestActivity = require("../model/bestActivities");
const BeautifulPlaces = require("../model/bestPlaces");
const RichFlavour = require("../model/richFlavour");
const Shop = require("../model/shop");
const InternationalActivities = require("../model/InternationalParts/InternationalActivities");
const InternationalFlavours = require("../model/InternationalParts/InternationalFlavours");
const InternationalPlaces = require("../model/InternationalParts/InternationalPlaces");
const InternationalShops = require("../model/InternationalParts/InternationalShops");
const baseUrl = "http://localhost:5001/upload/";

// Helper function to convert Google Drive URL or prepend baseUrl
const getImageUrl = (image) => {
  if (!image) return image;
  
  // If it's an array, get the first element
  if (Array.isArray(image)) {
    image = image[0];
    if (!image) return '';
  }
  
  // Now handle the string
  if (typeof image === 'string' && image.startsWith('http')) {
    // It's already a full URL (Google Drive)
    return image;
  }
  return baseUrl + image;
};

exports.getAllStates = async (req, res) => {
  try {
    const states = await State.find().populate("trips");
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
              tripImages: trip.tripImages.map((image) => getImageUrl(image)), // Handle Google Drive URLs
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


exports.nameAllStates = async (req, res) => {
  const { name } = req.params;

  try {
    // Find states by stateName (case-insensitive) and populate trips
    const states = await State.find({
      stateName: new RegExp(name, "i"),
    }).populate("trips");

    // If no states are found, return a 404 error
    if (!states || states.length === 0) {
      return res
        .status(404)
        .json({ message: `No states found with the name: ${name}` });
    }

    // Modify each state and its trips to include only valid future trip dates and full URLs for media fields
    const modifiedStates = states.map((state) => {
      // Update the trips to filter out any with no valid future trip dates
      const updatedTrips = state.trips
        .map((trip) => {
          // Filter tripDates to only include future dates
          const filteredTripDates = trip.tripDates.filter(
            (dateObj) =>
              new Date(dateObj.tripDate).setHours(0, 0, 0, 0) >
              new Date().setHours(0, 0, 0, 0)
          );

          // If there are no valid future dates, exclude this trip
          if (filteredTripDates.length === 0) {
            return null;
          }

          // Use the first available future date
          const tripDateToSend = filteredTripDates[0].tripDate;
          const tripDateCounts = filteredTripDates.length;

          // Return the trip with the filtered future dates and updated URLs for media fields
          return {
            ...trip._doc, // Spread the original trip document
            tripImages: trip.tripImages.map((image) => getImageUrl(image)),
            tripDate: tripDateToSend, // Include only the valid future dates
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
  try {
    // Find the state by stateName (case-insensitive) and populate trips
    const state = await State.findOne({
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
    const similarStates = await State.find({
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
            tripImages: trip.tripImages.map((image) => getImageUrl(image)),
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

exports.findStateAndTrip = async (req, res) => {
  let { stateName, tripName } = req.params;

  // Convert any "-" in tripName back to "/"
  tripName = tripName.replace(/-/g, "/");

  try {
    // Fetch the state and its associated trips (populated)
    const state = await State.findOne({
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
    const activePdf = trip.pdf.find((pdfItem) => pdfItem.status === "active");
    const tripPdf = activePdf ? `${baseUrl}${activePdf.filename}` : null;

    // Filter tripDates to include only present or future dates
    const today = new Date().setHours(0, 0, 0, 0);
    const filteredTripDates = trip.tripDates.filter((tripDateObj) => {
      const tripDate = new Date(tripDateObj.tripDate).setHours(0, 0, 0, 0);
      return tripDate >= today;
    });

    res.status(200).json({
      state: {
        stateName: state.stateName,
      },
      trip: {
        tripName: trip.tripName,
        tripPrice: trip.tripPrice,
        tripOfferPrice: trip.tripOfferPrice,
        tripQuantity: trip.tripQuantity,
        tripDate: filteredTripDates.map((td) => td.tripDate), // Send only filtered dates
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
        tripDates: filteredTripDates, // Send only the valid trip dates
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getPackage = async (req, res) => {
  const { tripName, name } = req.params;
  try {
    const state = await State.findOne({ stateName: name });
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    const packageDetails = state.trips.find(
      (trip) => trip.tripName === tripName
    );
    if (!packageDetails) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json(packageDetails);
  } catch (error) {
    console.error("Error fetching package details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getBestActivities = async (req, res) => {
  const { name } = req.params;
  try {
    const activities = await BestActivity.find({ stateName: name });

    if (!activities || activities.length === 0) {
      return res
        .status(404)
        .json({ message: "No activities found for this state" });
    }
    // Add baseUrl to the image field of each activity
    const formattedActivities = activities.map((activity) => ({
      ...activity._doc, // Extract the document if it's in mongoose model format
      img: `${baseUrl}${activity.img}`, // Assuming `img` is the image field
    }));

    return res.status(200).json({
      message: "Best activities fetched successfully",
      activities: formattedActivities, // Send the formatted activities
    });
  } catch (error) {
    console.error("Error fetching best activities:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getBeautifulPlaces = async (req, res) => {
  const { name } = req.params;
  try {
    const places = await BeautifulPlaces.find({ stateName: name });

    if (!places || places.length === 0) {
      return res
        .status(404)
        .json({ message: "No places found for this state" });
    }
    // Add baseUrl to the image field of each place
    const formattedPlaces = places.map((place) => ({
      ...place._doc, // Extract the document if it's in mongoose model format
      img: `${baseUrl}${place.img}`, // Assuming `img` is the image field
    }));

    return res.status(200).json({
      message: "Beautiful places fetched successfully",
      places: formattedPlaces, // Send the formatted places
    });
  } catch (error) {
    console.error("Error fetching best places:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getRichFlavour = async (req, res) => {
  const { name } = req.params;
  try {
    const activities = await RichFlavour.find({ stateName: name });

    if (!activities || activities.length === 0) {
      return res
        .status(404)
        .json({ message: "No Rich Flavour found for this state" });
    }
    const formattedActivities = activities.map((activity) => ({
      ...activity._doc,
      img: `${baseUrl}${activity.img}`,
    }));

    return res.status(200).json({
      message: "Rich Flavour fetched successfully",
      activities: formattedActivities,
    });
  } catch (error) {
    console.error("Error fetching best activities:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getShops = async (req, res) => {
  const { name } = req.params;

  try {
    // Query the shops where stateName matches the name parameter
    const shops = await Shop.find({ stateName: name });

    if (!shops || shops.length === 0) {
      return res.status(404).json({ message: "No shops found" });
    }

    

    const formattedShops = shops.map((shop) => ({
      ...shop._doc,
      img: `${baseUrl}${shop.img}`,
    }));

    return res.status(200).json({
      message: "Shops fetched successfully",
      shops: formattedShops,
    });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getInternActivities = async (req, res) => {
  const { name } = req.params;
  try {
    const activities = await InternationalActivities.find({ stateName: name });

    if (!activities || activities.length === 0) {
      return res
        .status(404)
        .json({ message: "No activities found for this state" });
    }

    

    // Add baseUrl to the image field of each activity
    const formattedActivities = activities.map((activity) => ({
      ...activity._doc, // Extract the document if it's in mongoose model format
      img: `${baseUrl}${activity.img}`, // Assuming `img` is the image field
    }));

    return res.status(200).json({
      message: "Best activities fetched successfully",
      activities: formattedActivities, // Send the formatted activities
    });
  } catch (error) {
    console.error("Error fetching best activities:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getInternPlaces = async (req, res) => {
  const { name } = req.params;
  try {
    const places = await InternationalPlaces.find({ stateName: name });
    

    if (!places || places.length === 0) {
      return res
        .status(404)
        .json({ message: "No places found for this state" });
    }

    // Add baseUrl to the image field of each place
    const formattedPlaces = places.map((place) => ({
      ...place._doc, // Extract the document if it's in mongoose model format
      img: `${baseUrl}${place.img}`, // Assuming `img` is the image field
    }));

    return res.status(200).json({
      message: "Beautiful places fetched successfully",
      places: formattedPlaces, // Send the formatted places
    });
  } catch (error) {
    console.error("Error fetching best places:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getInternFlavour = async (req, res) => {
  const { name } = req.params;
  try {
    const activities = await InternationalFlavours.find({ stateName: name });

    if (!activities || activities.length === 0) {
      return res
        .status(404)
        .json({ message: "No Rich Flavour found for this state" });
    }

    

    const formattedActivities = activities.map((activity) => ({
      ...activity._doc,
      img: `${baseUrl}${activity.img}`,
    }));

    return res.status(200).json({
      message: "Rich Flavour fetched successfully",
      activities: formattedActivities,
    });
  } catch (error) {
    console.error("Error fetching best activities:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getInternShops = async (req, res) => {
  const { name } = req.params;

  try {
    // Query the shops where stateName matches the name parameter
    const shops = await InternationalShops.find({ stateName: name });

    if (!shops || shops.length === 0) {
      return res.status(404).json({ message: "No shops found" });
    }

    

    const formattedShops = shops.map((shop) => ({
      ...shop._doc,
      img: `${baseUrl}${shop.img}`,
    }));

    return res.status(200).json({
      message: "Shops fetched successfully",
      shops: formattedShops,
    });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};