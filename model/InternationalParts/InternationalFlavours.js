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

const InternationalFlavours = mongoose.model(
  "InternationalFlavours",
  richFlavour
);

module.exports = InternationalFlavours;
