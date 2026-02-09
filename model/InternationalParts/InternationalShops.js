const mongoose = require("mongoose");
const shop = new mongoose.Schema({
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

const InternationalShops = mongoose.model("InternationalShops", shop);

module.exports = InternationalShops;
