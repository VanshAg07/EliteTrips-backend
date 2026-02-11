const States = require("../model/adminProduct");
const International = require("../model/International");
const Honeymoon = require("../model/Honeymoon");
const baseUrl = "https://elitetrips-backend.onrender.com/upload/";

exports.getSearchController = async (req, res) => {
  try {
    // Fetch all documents from each model
    const statesData = await States.find({});
    const internationalData = await International.find({});
    const honeymoonData = await Honeymoon.find({});

    // Function to extract tripNames from the trips array in each document
    const extractTripNames = (data, sourceName) => {
      return data
        .map((item) => {
          if (item.trips && Array.isArray(item.trips)) {
            const tripNames = item.trips.map((trip) => trip.tripName);
            return {
              stateName: item.stateName,
              source: sourceName,
              tripNames: tripNames,
            };
          }
          return null;
        })
        .filter(Boolean); // Remove any null entries
    };
    // Extract tripNames from all three models and label the source
    const statesTripData = extractTripNames(statesData, "National");
    const internationalTripData = extractTripNames(
      internationalData,
      "International"
    );
    const honeymoonTripData = extractTripNames(honeymoonData, "Honeymoon");

    // Combine all the trip data into a single array
    const allTripData = [
      ...statesTripData,
      ...internationalTripData,
      ...honeymoonTripData,
    ];

    res.status(200).json({ tripData: allTripData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching trip names." });
  }
};

// helper function to format date in "MMM'YY" format
const formatMonthYear = (date) => {
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);
  return `${month}'${year}`;
};

exports.getUpcomingTripsController = async (req, res) => {
  try {
    const currentDate = new Date();

    // Fetch state and international trip data
    const statesData = await States.find({
      "trips.tripDate": { $elemMatch: { $gte: currentDate } },
    });

    // const internationalData = await International.find({
    //   "trips.tripDate": { $elemMatch: { $gte: currentDate } },
    // });

    // helper function to extract and organize trips per month
    const extractMonthlyUpcomingTrips = (data, sourceName) => {
      const monthlyTrips = {};
      let totalTripDatesCount = 0;

      data.forEach((item) => {
        if (item.trips && Array.isArray(item.trips)) {
          item.trips.forEach((trip) => {
            const futureDates = trip.tripDate.filter(
              (date) => new Date(date) >= currentDate
            );

            if (futureDates.length > 0) {
              totalTripDatesCount += futureDates.length;

              const monthYearDates = {};

              futureDates.forEach((date) => {
                const monthDate = new Date(date);
                const formattedMonth = formatMonthYear(monthDate);

                if (!monthYearDates[formattedMonth]) {
                  monthYearDates[formattedMonth] = [];
                }

                monthYearDates[formattedMonth].push(new Date(date).toISOString());
              });

              for (const [month, dates] of Object.entries(monthYearDates)) {
                if (!monthlyTrips[month]) {
                  monthlyTrips[month] = [];
                }

                const tripDetails = {
                  tripName: trip.tripName,
                  stateName: item.stateName,
                  source: sourceName,
                  tripLocation: trip.tripLocation,
                  tripDuration: trip.tripDuration,
                  tripImages: trip.tripImages.map((image) => baseUrl + image),
                  allTripDates: dates,
                  allTripDatesCount: dates.length,
                };

                monthlyTrips[month].push(tripDetails);
              }
            }
          });
        }
      });

      return { monthlyTrips, totalTripDatesCount };
    };

    // Extract trips for states and international
    const statesResults = extractMonthlyUpcomingTrips(statesData, "National");
    // const internationalResults = extractMonthlyUpcomingTrips(internationalData, "International");

    // Combine trip data
    const allMonthlyTripData = {};
    let totalTripDatesCount = 0;

    [statesResults].forEach((result) => {
      const { monthlyTrips, totalTripDatesCount: count } = result;
      totalTripDatesCount += count;

      for (const [month, trips] of Object.entries(monthlyTrips)) {
        if (!allMonthlyTripData[month]) {
          allMonthlyTripData[month] = [];
        }
        allMonthlyTripData[month].push(...trips);
      }
    });

    // Create keys for the current month and next 5 months
    const filteredMonthlyTripData = {};
    const monthsToFetch = 5;
    let isCurrentMonthEmpty = false;

    for (let i = 0; i <= monthsToFetch; i++) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() + i);
      const monthKey = formatMonthYear(date);

      // Check for current month and mark as empty if applicable
      if (i === 0 && (!allMonthlyTripData[monthKey] || allMonthlyTripData[monthKey].length === 0)) {
        isCurrentMonthEmpty = true;
        continue; // Skip the current month if empty
      }

      filteredMonthlyTripData[monthKey] = allMonthlyTripData[monthKey] || [];
    }

    res.status(200).json({
      upcomingTrips: filteredMonthlyTripData,
      totalTripDatesCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching upcoming trips." });
  }
};
