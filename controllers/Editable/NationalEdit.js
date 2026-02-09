const State = require("../../model/adminProduct");
const International = require("../../model/International");
const Honeymoon = require("../../model/Honeymoon");
const OfferSchema = require("../../model/Offer/OfferSchema");

exports.editTripDetails = async (req, res) => {
  try {
    const { stateName, tripId } = req.params;

    // Parse updated data if it's a JSON string
    const updatedData = JSON.parse(req.body.tripDetails || "{}");
    console.log("Parsed updatedData:", updatedData); // Debugging line

    const state = await State.findOne({ stateName });
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    const trip = state.trips.id(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    trip.set(updatedData);
    if (req.files) {
      if (req.files.tripImages) {
        trip.tripImages = req.files.tripImages.map((file) => file.filename);
      }
      if (req.files.tripBackgroundImg) {
        trip.tripBackgroundImg = req.files.tripBackgroundImg[0].filename;
      }
      if (req.files.pdf) {
        const pdfStatuses = Array.isArray(req.body.pdfStatus) ? req.body.pdfStatus : [req.body.pdfStatus];
        trip.pdf = req.files.pdf.map((file, index) => ({
          filename: file.filename,
          status: pdfStatuses[index] || "active"
        }));
      }
    }

    // Ensure Mongoose detects changes in the nested subdocument
    state.markModified('trips');

    // Save changes to the state
    await state.save();

    res.status(200).json({ message: "Trip details updated successfully", trip });
  } catch (error) {
    console.error("Error updating trip details:", error);
    res.status(500).json({ message: "An error occurred while updating the trip details" });
  }
};

exports.getAllStatesWithTrips = async (req, res) => {
  try {
    // Find all states with populated trips
    const states = await State.find().populate("trips"); // Adjust according to your schema if needed

    if (!states || states.length === 0) {
      return res.status(404).json({ message: "No states found" });
    }

    // Map through states and add base URL to trip images and PDFs
    const updatedStates = states.map((state) => ({
      ...state.toObject(), // Convert mongoose document to plain object
      trips: state.trips.map((trip) => ({
        ...trip.toObject(), // Convert trip to plain object
      })),
    }));

    // Send the updated states and trips data to the frontend
    res.status(200).json({
      message: "States and trips fetched successfully",
      states: updatedStates,
    });
  } catch (error) {
    console.error("Error fetching states and trips:", error);
    res.status(500).json({
      message: "An error occurred while fetching the states and trips",
    });
  }
};

exports.deleteNationalTrip = async (req, res) => {
  try {
    const { tripId, stateName } = req.params;
    const state = await State.findOne({ stateName });
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    const trip = state.trips.id(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    state.trips.pull(trip);
    await state.save();
    res.status(200).json({ message: "National trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting national trip:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the national trip" });
  }
};

exports.editTripDetailsInternational = async (req, res) => {
  try {
    const { stateName, tripId } = req.params;

    // Parse updated data if it's a JSON string
    const updatedData = JSON.parse(req.body.tripDetails || "{}");
    // console.log("Parsed updatedData:", updatedData); // Debugging line

    const state = await International.findOne({ stateName });
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    const trip = state.trips.id(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Apply updates to the trip
    trip.set(updatedData);

    // Handle file uploads
    if (req.files) {
      if (req.files.tripImages) {
        trip.tripImages = req.files.tripImages.map((file) => file.filename);
      }
      if (req.files.tripBackgroundImg) {
        trip.tripBackgroundImg = req.files.tripBackgroundImg[0].filename;
      }
      if (req.files.pdf) {
        const pdfStatuses = Array.isArray(req.body.pdfStatus) ? req.body.pdfStatus : [req.body.pdfStatus];
        trip.pdf = req.files.pdf.map((file, index) => ({
          filename: file.filename,
          status: pdfStatuses[index] || "active"
        }));
      }
    }

    // Ensure Mongoose detects changes in the nested subdocument
    state.markModified('trips');

    // Save changes to the state
    await state.save();

    res.status(200).json({ message: "Trip details updated successfully", trip });
  } catch (error) {
    console.error("Error updating trip details:", error);
    res.status(500).json({ message: "An error occurred while updating the trip details" });
  }
};

exports.getAllStatesWithTripsInternational = async (req, res) => {
  try {
    // Find all states with populated trips
    const states = await International.find().populate("trips"); // Adjust according to your schema if needed

    if (!states || states.length === 0) {
      return res.status(404).json({ message: "No states found" });
    }

    // Map through states and add base URL to trip images and PDFs
    const updatedStates = states.map((state) => ({
      ...state.toObject(), // Convert mongoose document to plain object
      trips: state.trips.map((trip) => ({
        ...trip.toObject(), // Convert trip to plain object
      })),
    }));

    // Send the updated states and trips data to the frontend
    res.status(200).json({
      message: "States and trips fetched successfully",
      states: updatedStates,
    });
  } catch (error) {
    console.error("Error fetching states and trips:", error);
    res.status(500).json({
      message: "An error occurred while fetching the states and trips",
    });
  }
};

exports.deleteNationalTripInternational = async (req, res) => {
  try {
    const { tripId, stateName } = req.params;
    const state = await International.findOne({ stateName });
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    const trip = state.trips.id(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    state.trips.pull(trip);
    await state.save();
    res.status(200).json({ message: "National trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting national trip:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the national trip" });
  }
};

exports.editTripDetailsHoneymoon = async (req, res) => {
  try {
    const { stateName, tripId } = req.params;

    // Parse updated data if it's a JSON string
    const updatedData = JSON.parse(req.body.tripDetails || "{}");
    // console.log("Parsed updatedData:", updatedData); // Debugging line

    const state = await Honeymoon.findOne({ stateName });
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    const trip = state.trips.id(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Apply updates to the trip
    trip.set(updatedData);

    // Handle file uploads
    if (req.files) {
      if (req.files.tripImages) {
        trip.tripImages = req.files.tripImages.map((file) => file.filename);
      }
      if (req.files.tripBackgroundImg) {
        trip.tripBackgroundImg = req.files.tripBackgroundImg[0].filename;
      }
      if (req.files.pdf) {
        const pdfStatuses = Array.isArray(req.body.pdfStatus) ? req.body.pdfStatus : [req.body.pdfStatus];
        trip.pdf = req.files.pdf.map((file, index) => ({
          filename: file.filename,
          status: pdfStatuses[index] || "active"
        }));
      }
    }

    // Ensure Mongoose detects changes in the nested subdocument
    state.markModified('trips');

    // Save changes to the state
    await state.save();

    res.status(200).json({ message: "Trip details updated successfully", trip });
  } catch (error) {
    console.error("Error updating trip details:", error);
    res.status(500).json({ message: "An error occurred while updating the trip details" });
  }
};

exports.getAllStatesWithTripsHoneymoon = async (req, res) => {
  try {
    // Find all states with populated trips
    const states = await Honeymoon.find().populate("trips"); // Adjust according to your schema if needed

    if (!states || states.length === 0) {
      return res.status(404).json({ message: "No states found" });
    }

    // Map through states and add base URL to trip images and PDFs
    const updatedStates = states.map((state) => ({
      ...state.toObject(), // Convert mongoose document to plain object
      trips: state.trips.map((trip) => ({
        ...trip.toObject(), // Convert trip to plain object
      })),
    }));

    // Send the updated states and trips data to the frontend
    res.status(200).json({
      message: "States and trips fetched successfully",
      states: updatedStates,
    });
  } catch (error) {
    console.error("Error fetching states and trips:", error);
    res.status(500).json({
      message: "An error occurred while fetching the states and trips",
    });
  }
};

exports.deleteNationalTripHoneymoon = async (req, res) => {
  try {
    const { tripId, stateName } = req.params;
    const state = await Honeymoon.findOne({ stateName });
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    const trip = state.trips.id(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    state.trips.pull(trip);
    await state.save();
    res.status(200).json({ message: "National trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting national trip:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the national trip" });
  }
};

exports.editOfferDetails = async (req, res) => {
  try {
    const { stateName, tripId } = req.params;

    // Parse updated data if it's a JSON string
    const updatedData = JSON.parse(req.body.tripDetails || "{}");
    // console.log("Parsed updatedData:", updatedData); // Debugging line

    const state = await OfferSchema.findOne({ stateName });
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    const trip = state.trips.id(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Apply updates to the trip
    trip.set(updatedData);

    // Handle file uploads
    if (req.files) {
      if (req.files.tripImages) {
        trip.tripImages = req.files.tripImages.map((file) => file.filename);
      }
      if (req.files.tripBackgroundImg) {
        trip.tripBackgroundImg = req.files.tripBackgroundImg[0].filename;
      }
      if (req.files.pdf) {
        const pdfStatuses = Array.isArray(req.body.pdfStatus) ? req.body.pdfStatus : [req.body.pdfStatus];
        trip.pdf = req.files.pdf.map((file, index) => ({
          filename: file.filename,
          status: pdfStatuses[index] || "active"
        }));
      }
    }

    // Ensure Mongoose detects changes in the nested subdocument
    state.markModified('trips');

    // Save changes to the state
    await state.save();

    res.status(200).json({ message: "Trip details updated successfully", trip });
  } catch (error) {
    console.error("Error updating trip details:", error);
    res.status(500).json({ message: "An error occurred while updating the trip details" });
  }
};

exports.getOffer = async (req, res) => {
  try {
    // Find all states with populated trips
    const states = await OfferSchema.find().populate("trips"); // Adjust according to your schema if needed

    if (!states || states.length === 0) {
      return res.status(404).json({ message: "No states found" });
    }

    // Map through states and add base URL to trip images and PDFs
    const updatedStates = states.map((state) => ({
      ...state.toObject(), // Convert mongoose document to plain object
      trips: state.trips.map((trip) => ({
        ...trip.toObject(), // Convert trip to plain object
      })),
    }));

    // Send the updated states and trips data to the frontend
    res.status(200).json({
      message: "States and trips fetched successfully",
      states: updatedStates,
    });
  } catch (error) {
    console.error("Error fetching states and trips:", error);
    res.status(500).json({
      message: "An error occurred while fetching the states and trips",
    });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const { tripId, stateName } = req.params;
    const state = await OfferSchema.findOne({ stateName });
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    const trip = state.trips.id(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    state.trips.pull(trip);
    await state.save();
    res.status(200).json({ message: "National trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting national trip:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the national trip" });
  }
};