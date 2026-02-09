const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");

router.get("/getAllTickets", paymentController.getAllTickets);

module.exports = router;
