const mongoose = require("mongoose");

const homeVideo = new mongoose.Schema({
  video: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("HomeVideo", homeVideo);