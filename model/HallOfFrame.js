const mongoose = require("mongoose");

const HallOfFrame = new mongoose.Schema({
  image: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("HallOfFrame", HallOfFrame);