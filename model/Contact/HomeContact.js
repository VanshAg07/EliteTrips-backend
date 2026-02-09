const mongoose = require("mongoose");

const HomeContact = new mongoose.Schema({
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
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("HomeContact", HomeContact);