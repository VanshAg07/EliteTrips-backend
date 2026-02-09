const mongoose = require("mongoose");

const beautifulPlaces = new mongoose.Schema({
  stateName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    // required: true,
  },
  title: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  img: {
    type: String,
    // required:true
  },
});
const BeautifulPlaces = mongoose.model("BeautifulPlaces", beautifulPlaces);

module.exports = BeautifulPlaces;
