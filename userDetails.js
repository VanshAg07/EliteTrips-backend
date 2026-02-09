const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      unique: true,
    },
    phoneNo: {
      type: String,
      require: true,
    },
    password: String,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    resetOTP: {
      type: String,
    },
    resetOTPExpires: {
      type: Date,
    },
    otp: { type: String },
  },
  {
    collection: "UserInfo",
  }
);

const User = mongoose.model("UserInfo", UserDetailsSchema);

module.exports = User;