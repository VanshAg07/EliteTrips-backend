const mongoose = require("mongoose");

const ourTeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  image: [
    {
      type: String,
      required: true,
    },
  ],
  linkedIn: {
    type: String,
    required: true,
  },
  instagram: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const OurTeam = mongoose.model("OurTeam", ourTeamSchema);
module.exports = OurTeam;
