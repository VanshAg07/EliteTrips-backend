const mongoose = require("mongoose");

const GalleryInternational = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tripImages: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("GalleryInternational", GalleryInternational);
