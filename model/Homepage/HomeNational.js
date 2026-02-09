const mongoose = require('mongoose');

const HomeNationalSchema = new mongoose.Schema({
  tripName: {
    type: String,
    required: true,
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Trip',
    unique: true,
  },
  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'States',
  },
  isChosen: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('HomeNational', HomeNationalSchema);