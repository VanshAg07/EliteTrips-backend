const mongoose = require("mongoose");

const SignIn = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: [
    {
      type: String,
    },
  ],
  status: {
    type: Boolean,
  },
});

module.exports = mongoose.model("AssistPop", SignIn);