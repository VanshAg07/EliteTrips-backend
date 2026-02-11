const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const TripRoutesMain = require("./routers/tripRoutes");
const adminRoute = require("./routers/admin-router");
const userRoute = require("./routers/userRoutes");
const Honeymoon = require("./routers/honeymoonRoute");
const Gallery = require("./routers/GalleryRoutes");
const Payments = require("./routers/paymentRoutes");
const International = require("./routers/Internnatioanl");
const EditPackage = require("./routers/editableRoutes");
const Review = require("./routers/Review/Review");
const Home = require("./routers/HomeRouter/HomeRouter");
const User = mongoose.model("UserInfo");
const FlipCard = require("./routers/Flipcard/Flipcard");
const Offer = require("./routers/OfferRoute");
const StateImages = require("./routers/PackageImageRoute");
const BackgroundImage = require("./routers/BackgroundImageRoute");
const AuthRoute = require("./routers/AuthRoute");
const Contact = require("./routers/Contact");
const ReelVideo = require("./routers/ReelRoute");
const PopUp = require("./routers/PopupRoutes");
const cors = require("cors");
require("dotenv").config();

const tripRoutes = require("./routers/Trip");

const PORT = process.env.PORT || 5001;

const corsOptions = {
  origin: "*",
  methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoUrl = process.env.mongo;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.error(e));

require("./userDetails");

app.use("/api/auth", AuthRoute);

app.use("/api/admin", adminRoute);

app.use("/api/user", userRoute);

app.use("/api/honeymoon", Honeymoon);

app.use("/api/trip", TripRoutesMain);

app.use("/api/trips", tripRoutes);

app.use("/api/gallery", Gallery);

app.use("/api/payments", Payments);

app.use("/api/international", International);

app.use("/api/edit-packages", EditPackage);

app.use("/api/review", Review);

app.use("/api/home", Home);

app.use("/api/flip-card", FlipCard);

app.use("/api/offer", Offer);

app.use("/api/package-image", StateImages);

app.use("/api/background-images", BackgroundImage);

app.use("/api/contact", Contact);

app.use("/api/reel", ReelVideo);

app.use("/api/popup", PopUp);

app.post("/register", async (req, res) => {
  const { username, email, password, role, phoneNo } = req.body;
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send({ error: "user exists" });
    }
    await User.create({
      username,
      email,
      password: encryptedPassword,
      role,
      phoneNo,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User Not Registered" });
  }

  // Validate password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Optional: Set expiration time
  );

  res.status(200).json({
    status: "ok",
    data: {
      token,
      username: user.username,
    },
  });
});

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Admin login attempt:", { email, password: "***" });

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log("User found:", user ? { email: user.email, role: user.role } : "No user found");

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", error: "Admin not found" });
    }

    // Check if the user has the admin role
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ status: "error", error: "Not authorized as admin" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "error", error: "Invalid password" });
    }

    // Generate a JWT token for the admin
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expiration time (optional)
    );

    // Respond with the token and admin details
    return res.status(200).json({
      status: "ok",
      data: {
        token,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal server error" });
  }
});

app.use("/upload", express.static(path.join(__dirname, "upload")));

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    user
      .findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", error: error });
      });
  } catch (error) { }
});

const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/api/payment/razorpay", async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: orderId,
    };

    // Create an order in Razorpay
    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to create Razorpay order" });
    }

    res.status(200).json({
      success: true,
      amount: order.amount,
      currency: order.currency,
      orderId: order.id,
    });
  } catch (error) {
    if (error.statusCode === 401) {
      console.error(
        "Authentication failed. Please check your Razorpay API keys."
      );
    } else {
      console.error("Error creating Razorpay order:", error);
    }
    res
      .status(500)
      .json({ success: false, message: "Failed to create payment", error });
  }
});
const crypto = require("crypto");
const BookTicket = require("./model/bookTickets");

app.post("/api/payment/verify", async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      customerPhone,
      tripName,
      tripPrice,
      selectedDate,
      selectedSharing,
      customerEmail,
      customerName,
      stateName,
    } = req.body;

    const packageTitle = tripName;
    const totalPrice = tripPrice;
    const bookingDate = selectedDate;
    const sharingType = selectedSharing;
    const body = razorpayOrderId + "|" + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpaySignature;

    if (isAuthentic) {
      // Save booking information to the database
      const booking = new BookTicket({
        customerPhone,
        packageTitle,
        totalPrice,
        bookingDate,
        sharingType,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        customerEmail,
        customerName,
        stateName,
        paymentType,
      });
      await booking.save();
      res.status(200).json({
        success: true,
        message: "Payment verified and booking saved successfully",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
});

app.get("/", (req, res) => {
  res.send("Hello, this is plain text response!");
});

app.listen(PORT, () => {
  console.log(`----Server Started at ${PORT}--------------`);
});
