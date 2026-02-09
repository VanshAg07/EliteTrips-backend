const mongoose = require("mongoose");

const PartnersCorporate = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  logo: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  people: {
    type: String,
    required: true,
  },
  youtubeLink: {
    type: String,
    // required: true,
  },
  image: [
    {
      type: String,
      // required: true,
    },
  ],
});

module.exports = mongoose.model("PartnersCorporate", PartnersCorporate);
