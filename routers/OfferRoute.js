const express = require("express");
const router = express.Router();
const upload = require("../config/uploads");

const OfferController = require("../controllers/OfferController");

router.post(
  "/states",
  upload.fields([{ name: "stateImage", maxCount: 1 }]),
  OfferController.createState
);

router.get("/states", OfferController.getStates);

router.get("/states/:id", OfferController.getStateById);

router.put(
  "/states/:id",
  upload.fields([{ name: "stateImage", maxCount: 1 }]),
  OfferController.updateStateById
);

router.delete("/states/:id", OfferController.deleteStateById);

router.post(
  "/add-offer-package/:stateId",
  upload.fields([
    { name: "tripImages", maxCount: 5 },
    { name: "tripBackgroundImg", maxCount: 5 },
    { name: "pdf", maxCount: 20 },
  ]),
  OfferController.addTripToState
);

router.get(
  "/findStateAndTrip/:stateName/:tripName",
  OfferController.findStateAndTrip
);

router.get("/getTripDetails", OfferController.getAllStates);

module.exports = router;