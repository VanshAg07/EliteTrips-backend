const mongoose = require("mongoose");

const FlipcardItemSchema = new mongoose.Schema({
  stateName: {
    type: String,
    required: true,
  },
  flipcardImage: [
    {
      type: String,
      required: true,
    },
  ],
  flipPrice: {
    type: Number,
    required: true,
  },
  flipOfferPrice: {
    type: Number,
    // required: true,
  },
});

const FlipcardSchema = new mongoose.Schema({
  national: [FlipcardItemSchema],
  international: [FlipcardItemSchema],
  honeymoon: [FlipcardItemSchema],
});

module.exports = mongoose.model("Flipcard", FlipcardSchema);
