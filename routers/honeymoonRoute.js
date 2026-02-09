const express = require("express");
const router = express.Router();
const upload = require("../config/uploads");

const {
  addTripToDatabase,
  getAllHoneymoonPackages,
  findStateAndTrip,
  createState,
  nameAllStates,
  getAllStates,
  getStateById,
  updateStateById,
  deleteStateById,
  getSimilarTrips,
} = require("../controllers/honeymoonController");

router.post(
  "/states",
  upload.fields([{ name: "stateImage", maxCount: 1 }]),
  createState
);

// Get all states
router.get("/states", getAllStates);

// Get a state by ID
router.get("/state/:id", getStateById);

// Update a state by ID
router.put(
  "/state/:id",
  upload.fields([{ name: "stateImage", maxCount: 1 }]),
  updateStateById
);

// Delete a state by ID
router.delete("/state/:id", deleteStateById);

router.post(
  "/add-honeymoon-package/:stateId",
  upload.fields([
    { name: "tripImages", maxCount: 5 },
    { name: "tripBackgroundImg", maxCount: 5 },
    { name: "pdf", maxCount: 1 },
  ]),
  addTripToDatabase
);
router.get("/get-all-honeymoon", getAllHoneymoonPackages);
router.get("/get-all-honeymoon/:name", nameAllStates);
router.get("/getSimilarTrips/:stateName", getSimilarTrips);

router.get("/findStateAndTrip/:stateName/:tripName", findStateAndTrip);

module.exports = router;
