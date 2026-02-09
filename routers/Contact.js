const express = require("express");
const router = express.Router();

const ContactController = require("../controllers/ContactController");

router.post("/contact-home", ContactController.submitContactHome);

router.post("/contact-trip", ContactController.submitContactTrip);

router.post("/contact-corporate", ContactController.submitContactCorporate);

module.exports = router;