const mongoose = require("mongoose");

const ExploreAdventure = new mongoose.Schema({
  image: [
    {
      type: String,
      required: true,
    },
  ],
  video: [
    {
      type: String,
      required: true,
    },
  ],
  title: {
    type: String,
    required: true,
    enum: ["International", "Team Adventures", "Weekend Trips", "Romantic Escapes", "Experience India"]
  },
});

module.exports = mongoose.model("ExploreAdventure", ExploreAdventure);