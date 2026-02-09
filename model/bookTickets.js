const mongoose = require("mongoose");

const bookTicket = new mongoose.Schema(
  {
    customerName: {
      type: String,
      // required: true,
    },
    customerEmail: {
      type: String,
      //   required: true,
    },
    customerPhone: {
      type: Number,
      //   required: true,
    },
    packageTitle: {
      type: String,
      //   required: true,
    },
    quantity: {
      type: Number,
      // required: true,
    },
    transport: {
      type: String,
      // required: true,
    },
    totalPrice: {
      type: Number,
      //   required: true,
    },
    bookingDate: {
      type: String,
      // required: true,
    },
    sharingType: {
      type: String,
      // required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
    advancePayment: {
      type: Number,
      default: 0,
    },
    paymentType: {
      type: String,
      enum: ["bookingAmount", "fullPayment"],
    },
    stateName: {
      type: String,
    },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true },
    razorpaySignature: { type: String, required: true },
  },
  { timestamps: true }
);

const BookTicket = mongoose.model("BookTicket", bookTicket);

module.exports = BookTicket;
