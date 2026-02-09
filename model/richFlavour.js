const mongoose = require("mongoose");
const richFlavour = new mongoose.Schema({
  stateName: { type: String, required: true },
  title: {
    type: String,
    required: true,
  },
  foodType: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    // required:true
  },
});


const RichFlavour = mongoose.model("RichFlavour", richFlavour);

module.exports = RichFlavour;
