const mongoose = require("mongoose");

const bestActivity = new mongoose.Schema({
  stateName: { type: String, required: true },
  time: {
    type: String,
    // required: true,
  },
  title: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  img: {
    type: String,
    // required:true
  },
});
const InternationalActivities = mongoose.model(
  "InternationalActivities",
  bestActivity
);

module.exports = InternationalActivities;
