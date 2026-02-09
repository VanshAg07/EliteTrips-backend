const mongoose = require("mongoose");

const TripContact = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {  
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TripContact", TripContact);