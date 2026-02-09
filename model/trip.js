// models/Trip.js
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    pdf: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
