const mongoose = require("mongoose");

const StateImage = new mongoose.Schema({
  image: [
    {
      type: String,
      required: true,
    },
  ],
  stateName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["National", "International", "Honeymoon"],
    default: "National",
  },
});

module.exports = mongoose.model("StateImage", StateImage);