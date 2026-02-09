const mongoose = require("mongoose");
const AssistForm = new mongoose.Schema({
  name: String,
  number: String,
  places: String,
});

module.exports = mongoose.model("AssistForm", AssistForm);
