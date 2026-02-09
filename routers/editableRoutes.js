const express = require("express");
const router = express.Router();
const upload = require("../config/uploads");
const {
  editTripDetails,
  getAllStatesWithTrips,
  deleteNationalTrip,
  editTripDetailsInternational,
  getAllStatesWithTripsInternational,
  deleteNationalTripInternational,
  editTripDetailsHoneymoon,
  getAllStatesWithTripsHoneymoon,
  deleteNationalTripHoneymoon,
  editOfferDetails,
  getOffer,
  deleteOffer,
} = require("../controllers/Editable/NationalEdit");

// Route to edit trip details
router.put(
  "/edit-national-package/:stateName/:tripId",
  upload.fields([
    { name: "pdf", maxCount: 20 },
    { name: "tripImages", maxCount: 10 },
    { name: "tripBackgroundImg", maxCount: 1 },
  ]),
  editTripDetails
);

router.get("/get-national-packages", getAllStatesWithTrips);

router.delete(
  "/delete-national-package/:stateName/:tripId",
  deleteNationalTrip
);

router.put(
  "/edit-intern-national-package/:stateName/:tripId",
  upload.fields([
    { name: "pdf", maxCount: 20 },
    { name: "tripImages", maxCount: 10 },
    { name: "tripBackgroundImg", maxCount: 10 },
  ]),
  editTripDetailsInternational
);

router.get("/get-intern-national-packages", getAllStatesWithTripsInternational);

router.delete(
  "/delete-intern-national-package/:stateName/:tripId",
  deleteNationalTripInternational
);

router.put(
  "/edit-honeymoon-package/:stateName/:tripId",
  upload.fields([
    { name: "pdf", maxCount: 20 },
    { name: "tripImages", maxCount: 10 },
    { name: "tripBackgroundImg", maxCount: 10 },
  ]),
  editTripDetailsHoneymoon
);

router.get("/get-honeymoon-packages", getAllStatesWithTripsHoneymoon);

router.delete(
  "/delete-honeymoon-package/:stateName/:tripId",
  deleteNationalTripHoneymoon
);

router.put(
  "/edit-offers-package/:stateName/:tripId",
  upload.fields([
    { name: "pdf", maxCount: 20 },
    { name: "tripImages", maxCount: 10 },
    { name: "tripBackgroundImg", maxCount: 10 },
  ]),
  editOfferDetails
);

router.get("/get-offers-packages", getOffer);

router.delete("/delete-offers-package/:stateName/:tripId", deleteOffer);

module.exports = router;
