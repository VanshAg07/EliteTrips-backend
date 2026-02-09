const mongoose = require("mongoose");

const GaleryNational = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("GaleryNational", GaleryNational);