const mongoose = require("mongoose");

const HomeHoneymoon = new mongoose.Schema(
  {
    tripName: {
      type: String,
      required: true,
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Trip",
      unique: true,
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Honeymoon",
    },
    isChosen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
); // Optionally include timestamps

module.exports = mongoose.model("HomeHoneymoon", HomeHoneymoon);
