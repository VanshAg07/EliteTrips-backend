const express = require("express");
const multer = require("multer");
const upload = require("../config/uploads");
const router = express.Router();
const {
  addRichFlavourInternational,
  addShopInternational,
  addBeautifulPlacesInternational,
  addActivityInternational,
  createState,
  getAllStates,
  getStateById,
  updateStateById,
  deleteStateById,
  editActivityIntern,
  getBestActivitiesIntern,
  getBestActivitiesByIdIntern,
  getShopIntern,
  getShopsByIdIntern,
  editShopIntern,
  getRichFlavourByIdIntern,
  editRichFlavourIntern,
  getFlavourIntern,
  editBeautifulPlacesIntern,
  getBeautifulPlacesByIdIntern,
  getBeautifulPlacesIntern,
  deleteBestActivityIntern,
  deleteBeautifulPlacesIntern,
  deleteRichFlavourIntern,
  deleteShopIntern,
} = require("../controllers/internationalControllers");

const {
  getAllUsers,
  deleteUsers,
} = require("../controllers/admin-controllers");

const {
  addActivity,
  addBeautifulPlaces,
  addRichFlavour,
  addShop,
  editActivity,
  getBestActivities,
  getBestActivitiesById,
  getShop,
  getShopsById,
  editShop,
  getRichFlavourById,
  editRichFlavour,
  getFlavour,
  editBeautifulPlaces,
  getBeautifulPlacesById,
  getBeautifulPlaces,
  deleteBestActivity,
  deleteBeautifulPlaces,
  deleteRichFlavour,
  deleteShop,
} = require("../controllers/tripDetails");

const {
  addInternationalPackage,
} = require("../controllers/internationalControllers");

router.get("/users", getAllUsers);

router.delete("/users/:id", deleteUsers);

router.post(
  "/addActivity",
  upload.fields([{ name: "img", maxCount: 1 }]),
  addActivity
);
router.get("/getActivity", getBestActivities);

router.get("/getActivity/:id", getBestActivitiesById);

router.put(
  "/editActivity/:id",
  upload.fields([{ name: "img", maxCount: 1 }]),
  editActivity
);

router.delete("/deleteActivity/:id", deleteBestActivity);

router.post(
  "/addBeautifulPlaces",
  upload.fields([{ name: "img", maxCount: 1 }]),
  addBeautifulPlaces
);
router.get("/getBeautifulPlaces/:id", getBeautifulPlacesById);

router.get("/getBeautifulPlaces", getBeautifulPlaces);

router.put(
  "/editBeautifulPlaces/:id",
  upload.fields([{ name: "img", maxCount: 1 }]),
  editBeautifulPlaces
);

router.delete("/deleteBeautifulPlaces/:id", deleteBeautifulPlaces);
router.post(
  "/addRichFlavour",
  upload.fields([{ name: "img", maxCount: 1 }]),
  addRichFlavour
);

router.get("/getFlavour/:id", getRichFlavourById);

router.get("/getFlavour", getFlavour);

router.put(
  "/editFlavour/:id",
  upload.fields([{ name: "img", maxCount: 1 }]),
  editRichFlavour
);

router.delete("/deleteRichFlavour/:id", deleteRichFlavour);

router.post("/addShop", upload.fields([{ name: "img", maxCount: 1 }]), addShop);

router.get("/getShop", getShop);

router.get("/getShop/:id", getShopsById);

router.delete("/deleteShop/:id", deleteShop);

router.put(
  "/editShop/:id",
  upload.fields([{ name: "img", maxCount: 1 }]),
  editShop
);

router.post(
  "/international/addRichFlavour",
  upload.fields([{ name: "img", maxCount: 1 }]),
  addRichFlavourInternational
);
router.get("/international/getFlavour/:id", getRichFlavourByIdIntern);

router.delete("/international/deleteFlavour/:id", deleteRichFlavourIntern);

router.get("/international/getFlavour", getFlavourIntern);

router.put(
  "/international/editFlavour/:id",
  upload.fields([{ name: "img", maxCount: 1 }]),
  editRichFlavourIntern
);

router.post(
  "/international/addBeautifulPlaces",
  upload.fields([{ name: "img", maxCount: 1 }]),
  addBeautifulPlacesInternational
);

router.get(
  "/international/getBeautifulPlaces/:id",
  getBeautifulPlacesByIdIntern
);

router.get("/international/getBeautifulPlaces", getBeautifulPlacesIntern);

router.put(
  "/international/editBeautifulPlaces/:id",
  upload.fields([{ name: "img", maxCount: 1 }]),
  editBeautifulPlacesIntern
);
router.delete("/international/deletePlaces/:id", deleteBeautifulPlacesIntern);
router.post(
  "/international/addActivity",
  upload.fields([{ name: "img", maxCount: 1 }]),
  addActivityInternational
);
router.get("/international/getActivity", getBestActivitiesIntern);

router.get("/international/getActivity/:id", getBestActivitiesByIdIntern);

router.delete("/international/deleteActivity/:id", deleteBestActivityIntern);

router.put(
  "/international/editActivity/:id",
  upload.fields([{ name: "img", maxCount: 1 }]),
  editActivityIntern
);

router.post(
  "/international/addShop",
  upload.fields([{ name: "img", maxCount: 1 }]),
  addShopInternational
);

router.get("/international/getShop", getShopIntern);

router.get("/international/getShop/:id", getShopsByIdIntern);

router.put(
  "/international/editShop/:id",
  upload.fields([{ name: "img", maxCount: 1 }]),
  editShopIntern
);

router.delete("/international/deleteShop/:id", deleteShopIntern);
router.post(
  "/international-package/:stateId",
  upload.fields([
    { name: "tripImages", maxCount: 5 },
    { name: "tripBackgroundImg", maxCount: 5 },
    { name: "pdf", maxCount: 20 },
  ]),
  addInternationalPackage
);

router.post(
  "/international-state",
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

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
