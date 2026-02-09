const mongoose = require("mongoose");

const reviews = new mongoose.Schema({
    googleReview:{
        type: String,
        required: true
    },
    facebookReview:{
        type: String,
        required: true
    },
    instagramReview:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Review", reviews);