const mongoose = require("mongoose");

const GalleryHome = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("GalleryHome", GalleryHome);