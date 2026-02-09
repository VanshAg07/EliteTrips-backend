const mongoose = require("mongoose");

const heroImageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // For Google Drive URL
  },
}, { timestamps: true });

module.exports = mongoose.model("HeroImage", heroImageSchema);
