const express = require("express");
const router = express.Router();
const BackgroundImageController = require("../controllers/BackgroundImageController");
const upload = require("../config/uploads");

router.post(
  "/images",
  upload.fields([{ name: "image", maxCount: 1 }]),
  BackgroundImageController.createBackground
);

router.get("/images", BackgroundImageController.getAllBackground);

router.get("/images/:id", BackgroundImageController.findByIdBackground);

router.put(
  "/images/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  BackgroundImageController.updateBackground
);

router.delete("/images/:id", BackgroundImageController.deleteBackground);

module.exports = router;