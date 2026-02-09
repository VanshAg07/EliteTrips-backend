const mongoose = require("mongoose");

const CorporateContact = new mongoose.Schema({
  fullName: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
  },
  whatsappNumber: {
    type: String,
    // required: true,
  },
  peopleCount: {
    type: String,
    required: true,
  },
  tripType: {
    type: String,
    required: true,
  },
  travelMonth: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CorporateContact", CorporateContact);
