const express = require("express");
const router = express.Router();

const {
  getAllInternationalPackages,
  nameAllStates,
  findStateAndTrip,
  getSimilarTrips
} = require("../controllers/internationalControllers");

router.get("/get-all-international", getAllInternationalPackages);

router.get("/get-all-international/:name", nameAllStates);

router.get("/getSimilarTrips/:stateName", getSimilarTrips);

router.get("/findStateAndTrip/:stateName/:tripName", findStateAndTrip);

module.exports = router;