const mongoose = require("mongoose");

const footerIcons = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  url: {
    type: String,
    // required: true,
  },
  iconImage: [
    {
      type: String,
      // required: true,
    },
  ],
});

module.exports = mongoose.model("FooterIcons", footerIcons);
