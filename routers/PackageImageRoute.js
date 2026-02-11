const express = require("express");
const router = express.Router();
const PackageImage = require("../controllers/PackaeImageController");

router.get("/national/:stateName", PackageImage.getNationalStateImages);
router.get(
  "/international/:stateName",
  PackageImage.getInternNationalStateImages
);
router.get("/honeymoon/:stateName", PackageImage.getHoneymoonStateImages);
router.get("/offer-home/:stateName", PackageImage.getOfferHomeStateImages);

module.exports = router;