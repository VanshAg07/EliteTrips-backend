const BookTicket = require('../model/bookTickets'); // Your model for tickets

// Controller to get all tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await BookTicket.find(); // Fetch all tickets
    res.status(200).json(tickets); // Return tickets as JSON
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error" }); // Handle errors
  }
};

module.exports = { getAllTickets };
