const mongoose = require("mongoose");

const BackgroundImage = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      "National",
      "International",
      "Honeymoon",
      "Weekend",
      "Blogs",
      "Offer",
      "About Us",
    ],
  },
  image: [
    {
      type: String,
      required: true,
    },
  ],
  heading: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("BackgroundImage", BackgroundImage);