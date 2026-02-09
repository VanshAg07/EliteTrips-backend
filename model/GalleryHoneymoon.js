const mongoose = require("mongoose");

const GalleryHoneymoon = new mongoose.Schema({
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

module.exports = mongoose.model("GalleryHoneymoon", GalleryHoneymoon);