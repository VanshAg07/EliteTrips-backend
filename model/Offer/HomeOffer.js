const mongoose = require("mongoose");

const offerHomePage = new mongoose.Schema({
  image: [
    {
      type: String,
      required: true,
    },
  ],
  status: {
    type: Boolean,
    required: true,
  },
  link: {
    type: String,
    // required: true,
  },
  phoneImage: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("OfferHomePage", offerHomePage);
