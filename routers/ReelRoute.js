const express = require("express");
const router = express.Router();
const upload = require("../config/uploads");
const reelVideoController = require("../controllers/ReelController");

// Create a new ReelVideo (with multiple video uploads)
router.post(
  "/reel",
  upload.fields([{ name: "video", maxCount: 5 }]),
  reelVideoController.createReelVideo
);

// Get all ReelVideos
router.get("/reel", reelVideoController.getAllReelVideos);
router.get("/reels", reelVideoController.getReelVideo);

// Get a specific ReelVideo by ID
router.get("/reel/:id", reelVideoController.getReelVideoById);

// Update a ReelVideo by ID (with multiple video uploads if needed)
router.put(
  "/reel/:id",
  upload.fields([{ name: "video", maxCount: 5 }]),
  reelVideoController.updateReelVideo
);

// Delete a ReelVideo by ID
router.delete("/reel/:id", reelVideoController.deleteReelVideo);

router.get("/:title", reelVideoController.getReelUser);
module.exports = router;
