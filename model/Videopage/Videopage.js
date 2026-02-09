const mongoose = require("mongoose");

const VideoPage = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Indian", "International", "Honeymoon"],
    required: true,
  },
  backgroundVideo: {
    type: String,
    // required: true,
  },
  backgroundImage: {
    type: String,
  },
  mediaType: {
    type: String,
    enum: ["video", "image"],
    default: "video",
  },
});

module.exports = mongoose.model("VideoPage", VideoPage);