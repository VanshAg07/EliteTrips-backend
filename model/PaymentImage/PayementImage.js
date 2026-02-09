const mongoose = require("mongoose");

const PaymentImage = new mongoose.Schema({
  image: [
    {
      type: String,
      required: true,
    },
  ],
  status:{
    type: String,
    enum: ["active", "non-active"],
    default: "non-active",
    required: true,
  }
});

module.exports = mongoose.model("PaymentImage", PaymentImage);