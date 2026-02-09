const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.post("/request-password-reset", AuthController.requestPasswordReset);

router.post("/verify-otp", AuthController.verifyOTP);

router.post("/verifyOtp", AuthController.verifyUserOtp);

router.put("/reset-password", AuthController.resetPassword);

router.post("/send-otp", AuthController.sendOtp);

router.post("/sendOtp", AuthController.sendOtpAdmin);

module.exports = router;