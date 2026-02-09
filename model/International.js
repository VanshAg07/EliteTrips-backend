const mongoose = require("mongoose");

const tripDetailsSchema = new mongoose.Schema(
  {
    tripName: {
      type: String,
      // required: true,
    },
    tripPrice: {
      type: String,
      // required: true,
    },
    tripOfferPrice: {
      type: String,
      // required: true,
    },
    tripDate: [
      {
        type: Date,
        // required: true,
      },
    ],
    tripLocation: {
      type: String,
      // required: true,
    },
    tripDuration: {
      type: String,
      // required: true,
    },
    tripBookingAmount: {
      type: Number,
      // required: true,
    },
    tripSeats: {
      type: Number,
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
    sharing: [
      {
        title: {
          type: String,
          enum: ["Double", "Triple", "Quad"],
          // required: true
        },
        price: {
          type: Number,
          // required: true
        },
      },
    ],
    otherInfo: [
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
    tripBackgroundImg: [
      {
        type: String,
        // required: true,
      },
    ],
    pickAndDrop: {
      type: String,
      // required: true,
    },
    customised: {
      type: Boolean,
      // required: true,
      default: false,
    },
    tripDates: [
      {
        tripDate:{
          type: String,
          // required: true
        },
        tripSeats:{
          type: String,
          // required: true
        }
      },
    ],
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

const InternationalSchema = new mongoose.Schema(
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

const International = mongoose.model("International", InternationalSchema);

module.exports = International;
