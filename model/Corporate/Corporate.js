const mongoose = require("mongoose");

const CorporateSchema = new mongoose.Schema({
  headingTitle: {
    type: String,
    required: true,
  },
  heading: [
    {
      title: {
        type: String,
        required: true,
      },
      headingDescription: {
        type: String,
        required: true,
      },
      subHeading: {
        type: String,
        required: true,
      },
      points: [
        {
          type: String,
          required: true,
        },
      ],
    },
  ],
  description: {
    type: String,
    required: true,
  },
  headingImage: [
    {
      type: String,
      required: true,
    },
  ],
  image: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("Corporate", CorporateSchema);
