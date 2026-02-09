const mongoose = require("mongoose");

const tripDetailsSchema = new mongoose.Schema(
  {
    tripName: {
      type: String,
      // required: true,
    },
    tripLocation: {
      type: String,
      // required: true,
    },
    tripDuration: {
      type: String,
      // required: true,
    },
    tripInclusions: [
      {
        type: String,
        // required: true,
      },
    ],
    tripExclusions: [
      {
        type: String,
        // required: true,
      },
    ],
    tripItinerary: [
      {
        title: {
          type: String,
          // required: true
        },
        points: {
          type: [String],
          // required: true
        },
      },
    ],
    tripImages: [
      {
        type: String,
        // required: true,
      },
    ],
    pdf: [
      {
        filename: {
          type: String,
        },
        status: {
          type: String,
          enum: ["active", "non-active"],
          default: "active",
        },
      },
    ],
    tripDescription: [
      {
        type: String,
        // required: true,
      },
    ],
    tripBackgroundImg: {
      type: String,
      // required: true,
    },
    pickAndDrop: {
      type: String,
      // required: true,
    },
    overView: {
      type: String,
    },
    status: {
      type: String,
      // required: true,
      enum: ["active", "non-active"],
      default: "active",
    },
  },
  { timestamps: true }
);

const HoneymoonSchema = new mongoose.Schema(
  {
    stateName: {
      type: String,
      // required: true,
    },
    stateImage: [
      {
        type: String,
        // required: true,
      },
    ],
    trips: [tripDetailsSchema],
  },
  { timestamps: true }
);

const Honeymoon = mongoose.model("Honeymoon", HoneymoonSchema);

module.exports = Honeymoon;
