const ReelVideo = require("../model/ReelVideo");
const { processMediaUrls } = require("../config/googleDriveConfig");

// Create a new ReelVideo
exports.createReelVideo = async (req, res) => {
  try {
    const { videoTitle, urlLink, videoSubtitle, video } = req.body;

    let videoPaths = [];

    // Handle URL-based video inputs (Google Drive/Photos)
    if (video) {
      if (typeof video === 'string') {
        try {
          const parsed = JSON.parse(video);
          videoPaths = Array.isArray(parsed) ? processMediaUrls(parsed) : processMediaUrls([video]);
        } catch (e) {
          // If not JSON, treat as newline-separated URLs
          videoPaths = processMediaUrls(video.split('\n').filter(url => url.trim()));
        }
      } else if (Array.isArray(video)) {
        videoPaths = processMediaUrls(video);
      }
    }
    // Backward compatibility: Handle file uploads
    else if (req.files && req.files.video) {
      videoPaths = req.files.video.map((file) => file.filename);
    }

    const newReelVideo = new ReelVideo({
      videoTitle,
      video: videoPaths,
      urlLink,
      videoSubtitle,
    });

    await newReelVideo.save();
    res
      .status(201)
      .json({ message: "Reel video created successfully", newReelVideo });
  } catch (error) {
    console.error("Error creating reel video:", error);
    res.status(500).json({
      message: "Failed to create reel video",
      error: error.message || error,
    });
  }
};

// Get all ReelVideos
exports.getAllReelVideos = async (req, res) => {
  try {
    const reelVideos = await ReelVideo.find();
    res.status(200).json(reelVideos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reel videos", error });
  }
};
exports.getReelVideo = async (req, res) => {
  try {
    // Select only video and videoTitle fields
    const reelVideo = await ReelVideo.find().select(
      "video videoTitle videoSubtitle urlLink"
    );

    if (!reelVideo || reelVideo.length === 0)
      return res.status(404).json({ message: "Reel video not found" });

    res.status(200).json(reelVideo); // Send the filtered data
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reel video", error });
  }
};

// Get a specific ReelVideo by ID
exports.getReelVideoById = async (req, res) => {
  try {
    const reelVideo = await ReelVideo.findById(req.params.id);
    if (!reelVideo)
      return res.status(404).json({ message: "Reel video not found" });
    res.status(200).json(reelVideo);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reel video", error });
  }
};
// Delete a ReelVideo by ID
exports.deleteReelVideo = async (req, res) => {
  try {
    const deletedReelVideo = await ReelVideo.findByIdAndDelete(req.params.id);
    if (!deletedReelVideo)
      return res.status(404).json({ message: "Reel video not found" });

    res
      .status(200)
      .json({ message: "Reel video deleted successfully", deletedReelVideo });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete reel video", error });
  }
};

exports.updateReelVideo = async (req, res) => {
  try {
    const { videoTitle, urlLink, videoSubtitle, video } = req.body;

    // Fetch the existing reel video data from the database
    const reelVideo = await ReelVideo.findById(req.params.id);

    if (!reelVideo) {
      return res.status(404).json({ message: "Reel video not found" });
    }

    let newVideoPaths = [];

    // Handle URL-based video inputs (Google Drive/Photos)
    if (video) {
      if (typeof video === 'string') {
        try {
          const parsed = JSON.parse(video);
          newVideoPaths = Array.isArray(parsed) ? processMediaUrls(parsed) : processMediaUrls([video]);
        } catch (e) {
          newVideoPaths = processMediaUrls(video.split('\n').filter(url => url.trim()));
        }
      } else if (Array.isArray(video)) {
        newVideoPaths = processMediaUrls(video);
      }
      reelVideo.video = newVideoPaths;
    }
    // Backward compatibility: Handle file uploads
    else if (req.files && req.files.video) {
      newVideoPaths = req.files.video.map((file) => file.filename);
      reelVideo.video = newVideoPaths;
    }

    // Update other fields
    if (videoTitle) reelVideo.videoTitle = videoTitle;
    if (urlLink) reelVideo.urlLink = urlLink;
    if (videoSubtitle) reelVideo.videoSubtitle = videoSubtitle;

    // Save the updated reel video document
    const updatedReelVideo = await reelVideo.save();

    res.status(200).json({
      message: "Reel video updated successfully",
      updatedReelVideo,
    });
  } catch (error) {
    console.error("Error updating reel video:", error);
    res.status(500).json({
      message: "Failed to update reel video",
      error: error.message || error,
    });
  }
};

exports.getReelUser = async (req, res) => {
  try {
    const { title } = req.params;

    // Find the video by title (case-insensitive)
    const reelVideo = await ReelVideo.findOne({
      videoTitle: { $regex: new RegExp(`^${title}$`, "i") },
    });

    if (!reelVideo) {
      return res.status(404).json({ message: "Reel video not found" });
    }

    res.status(200).json(reelVideo);
  } catch (error) {
    console.error("Error fetching reel video by title:", error);
    res.status(500).json({
      message: "Failed to fetch reel video",
      error: error.message || error,
    });
  }
};
