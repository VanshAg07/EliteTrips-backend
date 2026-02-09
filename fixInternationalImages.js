require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.mongo).then(async () => {
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    
    // Check trips collection for internationals
    const tripsCollection = db.collection('trips');
    const trips = await tripsCollection.find({}).limit(5).toArray();
    console.log('\nTrips sample:');
    for (const trip of trips) {
      console.log('Trip:', trip.tripName);
      console.log('  tripImages:', JSON.stringify(trip.tripImages));
    }
    
    // Fix corrupted URLs - remove "http://localhost:5001/upload/" prefix from Google Drive URLs
    const result = await tripsCollection.updateMany(
      { "tripImages": { $regex: "^http://localhost:5001/upload/https://" } },
      [
        {
          $set: {
            tripImages: {
              $map: {
                input: "$tripImages",
                as: "img",
                in: {
                  $cond: {
                    if: { $regexMatch: { input: "$$img", regex: "^http://localhost:5001/upload/https://" } },
                    then: { $replaceOne: { input: "$$img", find: "http://localhost:5001/upload/", replacement: "" } },
                    else: "$$img"
                  }
                }
              }
            }
          }
        }
      ]
    );
    
    console.log('\nUpdated', result.modifiedCount, 'documents in trips collection');
    
    mongoose.connection.close();
}).catch(err => console.error('Error:', err));
