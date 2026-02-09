const mongoose = require("mongoose");
const YoutubeSchema = new mongoose.Schema({
  videoLink: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Youtube", YoutubeSchema);