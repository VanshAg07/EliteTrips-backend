const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../userDetails");
require("dotenv").config();
// Generate OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const otpStore = {};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "EliteTripsindia@gmail.com",
    pass: "yxpp sdrq ihek xhac",
  },
});

// Request password reset
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(user);
    const otp = generateOTP();
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password OTP",
      text: `Your password reset OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email" });
      }
      // console.log("Email sent:", info.response);
      res.status(200).json({ message: "OTP sent to your email" });
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email, resetOTP: otp });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > user.resetOTPExpires) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetOTP = null;
    user.resetOTPExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP in memory (for demonstration purposes)
  otpStore[email] = otp;

  // Send email with OTP
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code for Account Verification",
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f7fa;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 20px 0;
            }
            .header h1 {
              font-size: 32px;
              color: #005c5c;
              margin: 0;
            }
            .body-text {
              font-size: 16px;
              line-height: 1.6;
              margin: 15px 0;
            }
            .otp-code {
              font-size: 22px;
              font-weight: bold;
              color: #005c5c;
              background-color: #f1f1f1;
              padding: 10px;
              border-radius: 6px;
              display: inline-block;
              margin: 10px 0;
              text-align: center;
              display: block;
              margin: 20px auto;
              max-width: 200px;
            }
            .footer {
              font-size: 14px;
              color: #888;
              text-align: center;
              margin-top: 30px;
            }
            .footer a {
              color: #005c5c;
              text-decoration: none;
            }
            .footer p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Welcome to EliteTrips!</h1>
            </div>
            <div class="body-text">
              <p>Dear User,</p>
              <p>Thank you for choosing EliteTrips! To complete your account verification process, please enter the following One-Time Password (OTP) on our website:</p>
              <div class="otp-code">${otp}</div>
              <p><strong>Important:</strong> This OTP is valid for the next 10 minutes. If you didn't request this OTP, please disregard this email.</p>
              <p>If you need any assistance, feel free to <a href="mailto:support@EliteTrips.com">contact us</a>.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 EliteTrips. All rights reserved.</p>
              <p><a href="https://EliteTrips.com/Termcondition">Terms & Conditions</a> | <a href="https://EliteTrips.com/Privcy">Privacy Policy</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ status: "ok", message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP: ", error);
    res.status(500).json({ status: "error", error: "Failed to send OTP." });
  }
};


exports.sendOtpAdmin = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists and has the role of admin
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Admin user not found with this email." });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in memory (for demonstration purposes)
    otpStore[email] = otp;

    // Send email with OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code for Signup",
      html: `
        <h1>Welcome to EliteTrips!</h1>
        <p>Your OTP for account verification is <strong>${otp}</strong>.</p>
        <p>This OTP is valid for 10 minutes.</p>
        <p>Thank you for choosing us for your travel needs!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ status: "ok", message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP: ", error);
    res.status(500).json({ status: "error", error: "Failed to send OTP." });
  }
};

exports.verifyUserOtp = async (req, res) => {
  const { email, otp } = req.body;

  // Check if the OTP matches the one stored in memory
  if (otpStore[email] && otpStore[email] === otp) {
    // OTP verified successfully
    delete otpStore[email]; // Clear OTP after successful verification
    return res.json({ status: "ok", message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ status: "error", error: "Invalid OTP" });
  }
};
