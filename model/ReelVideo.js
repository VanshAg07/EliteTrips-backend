const mongoose = require("mongoose");

const ReelVideo = new mongoose.Schema({
  videoTitle: {
    type: String,
    required: true,
  },
  video: [
    {
      type: String,
      required: true,
    },
  ],
  urlLink:{
    type: String,
    required: true,
  },
  videoSubtitle:{
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("ReelVideo", ReelVideo);
