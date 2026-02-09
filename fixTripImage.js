const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.mongo;

mongoose.connect(mongoURI).then(async () => {
  console.log('Connected to MongoDB');
  
  const State = require('./model/adminProduct');
  
  // Find the Delhi state and update the trip
  const state = await State.findOne({ stateName: /Delhi/i });
  
  if (state && state.trips.length > 0) {
    // Update the trip images and background image with the correct file path
    state.trips[0].tripImages = ['trip-image.png'];
    state.trips[0].tripBackgroundImg = 'trip-image.png';  // String, not array
    
    await state.save();
    console.log('Trip updated successfully!');
    console.log('New tripImages:', state.trips[0].tripImages);
    console.log('New tripBackgroundImg:', state.trips[0].tripBackgroundImg);
  } else {
    console.log('No state or trip found');
  }
  
  mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
