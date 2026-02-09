const mongoose = require("mongoose");

const AuthImage = new mongoose.Schema({
  phoneImage: [
    {
      type: String,
    },
  ],
  image: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("AuthImage", AuthImage);
