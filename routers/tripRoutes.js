const express = require("express");
const router = express.Router();
const stateController = require("../controllers/Trip");
const upload = require("../config/uploads");

// Create a new state
router.post(
  "/state",
  upload.fields([{ name: "stateImage", maxCount: 1 }]),
  stateController.createState
);

// Get all states
router.get("/states", stateController.getAllStates);

// Get a state by ID
router.get("/state/:id", stateController.getStateById);

// Update a state by ID
router.put(
  "/state/:id",
  upload.fields([{ name: "stateImage", maxCount: 1 }]),
  stateController.updateStateById
);

// Delete a state by ID
router.delete("/state/:id", stateController.deleteStateById);

router.post(
  "/state/:stateId/trip",
  upload.fields([
    { name: "tripImages", maxCount: 5 },
    { name: "tripBackgroundImg", maxCount: 5 },
    { name: "pdf", maxCount: 20 },
  ]),
  stateController.addTripToState
);

router.delete(
  "/state/:stateId/trip/:tripId",
  stateController.deleteTripFromState
);

module.exports = router;
