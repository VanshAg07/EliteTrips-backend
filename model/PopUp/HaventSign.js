const mongoose = require("mongoose");

const HaventSign = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    required: true,
  },
  image: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("HaventSign", HaventSign);