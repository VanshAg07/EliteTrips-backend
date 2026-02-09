const HomeContact = require("../model/Contact/HomeContact");
const CorporateContact = require("../model/Contact/CorporateContact");
const TripContact = require("../model/Contact/TripContact");
const nodemailer = require("nodemailer");

exports.submitContactHome = async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    // Save the contact form details to the database
    const newContact = new HomeContact({ name, email, phone, message });
    await newContact.save();

    // Configure the email transport using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service (e.g., Gmail, Yahoo, etc.)
      auth: {
        user: "EliteTripsindia@gmail.com", // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with your email password or an app-specific password
      },
    });

    // Create an HTML template for the email
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
        <p>You have received a new contact form submission. Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; border: 1px solid #ddd;">Name:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Email:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; border: 1px solid #ddd;">Phone:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Message:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${message}</td>
          </tr>
        </table>
        <br/>
        <p style="font-size: 0.9em; color: #999;">This is an automated email. Please do not reply to this email.</p>
      </div>
    `;

    // Email options
    const mailOptions = {
      from: email, // The sender's email
      to: "EliteTripsindia@gmail.com", // Replace with the recipient's email
      subject: "New Contact Form Submission",
      html: emailTemplate, // Use the HTML template
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with a success message
    res.status(200).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.submitContactTrip = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    // Save the contact form details to the database
    const newContact = new TripContact({ name, email, phone });
    await newContact.save();

    // Configure the email transport using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service (e.g., Gmail, Yahoo, etc.)
      auth: {
        user: "EliteTripsindia@gmail.com", // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with your email password or an app-specific password
      },
    });

    // Create an HTML template for the email
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
        <p>You have received a new contact form submission. Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; border: 1px solid #ddd;">Name:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Email:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; border: 1px solid #ddd;">Phone:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
          </tr>
        </table>
        <br/>
        <p style="font-size: 0.9em; color: #999;">This is an automated email. Please do not reply to this email.</p>
      </div>
    `;

    // Email options
    const mailOptions = {
      from: email, // The sender's email
      to: "EliteTripsindia@gmail.com", // Replace with the recipient's email
      subject: "New Contact Form Submission",
      html: emailTemplate, // Use the HTML template
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with a success message
    res.status(200).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.submitContactCorporate = async (req, res) => {
  const { fullName, email, whatsappNumber, peopleCount, tripType, travelMonth } = req.body;

  try {
    // Save the contact form details to the database
    const newContact = new CorporateContact({
      fullName,
      email,
      whatsappNumber,
      peopleCount,
      tripType,
      travelMonth,
    });
    await newContact.save();

    // Configure the email transport using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service (e.g., Gmail, Yahoo, etc.)
      auth: {
        user: "EliteTripsindia@gmail.com", // Replace with your email
        pass: "yxpp sdrq ihek xhac", // Replace with your email password or an app-specific password
      },
    });

    // Create an HTML template for the email
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
        <p>You have received a new contact form submission. Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; border: 1px solid #ddd;">Name:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Email:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; border: 1px solid #ddd;">Phone:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${whatsappNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Number of People:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${peopleCount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Trip Type:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${tripType}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Date Of Travel:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${travelMonth}</td>
          </tr>
        </table>
        <br/>
        <p style="font-size: 0.9em; color: #999;">This is an automated email. Please do not reply to this email.</p>
      </div>
    `;

    // Email options
    const mailOptions = {
      from: email, // The sender's email
      to: "EliteTripsindia@gmail.com", // Replace with the recipient's email
      subject: "New Contact Form Submission",
      html: emailTemplate, // Use the HTML template
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with a success message
    res.status(200).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};