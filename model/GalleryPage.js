const mongoose = require("mongoose");

const GalleryPage = new mongoose.Schema({
  images: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("GalleryPage", GalleryPage);
