const mongoose = require("mongoose");

const NavOffer = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
});

module.exports = mongoose.model("NavOffer", NavOffer);