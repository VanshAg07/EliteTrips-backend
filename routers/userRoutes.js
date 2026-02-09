const express = require("express");
const router = express.Router();

const {
  getPackage,
  getAllStates,
  getBestActivities,
  getBeautifulPlaces,
  getRichFlavour,
  getShops,
  nameAllStates,
  findStateAndTrip,
  getInternActivities,
  getInternPlaces,
  getInternFlavour,
  getInternShops,
  getSimilarTrips
} = require("../controllers/userController");

router.get("/getTripDetails", getAllStates);
router.get("/getTripDetails/:name", nameAllStates);
router.get("/getSimilarTrips/:stateName", getSimilarTrips);
router.get("/findStateAndTrip/:stateName/:tripName", findStateAndTrip);

// Get Package using the params using tripName and name of the state
router.get("/getPackage/:tripName/:name", getPackage);
router.get("/getBestActivities/:name", getBestActivities);
router.get("/getBeautifulPlaces/:name", getBeautifulPlaces);
router.get("/getRichFlavour/:name", getRichFlavour);
router.get("/getShops/:name", getShops);
router.get("/getInternActivities/:name", getInternActivities);
router.get("/getInternPlaces/:name", getInternPlaces);
router.get("/getInternFlavour/:name", getInternFlavour);
router.get("/getInternShops/:name", getInternShops);

module.exports = router;