const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./userDetails");
require("dotenv").config();

// Admin credentials
const ADMIN_EMAIL = "admin@EliteTrips.com";
const ADMIN_PASSWORD = "Admin@123456";
const ADMIN_USERNAME = "Admin";
const ADMIN_PHONE = "9999999999";

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.mongo || "mongodb://localhost:27017/Travel", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email:", ADMIN_EMAIL);
      console.log("Password:", ADMIN_PASSWORD);
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    const admin = new User({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      phoneNo: ADMIN_PHONE,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("\n═══════════════════════════════════");
    console.log("    ADMIN LOGIN CREDENTIALS");
    console.log("═══════════════════════════════════");
    console.log("Email:    ", ADMIN_EMAIL);
    console.log("Password: ", ADMIN_PASSWORD);
    console.log("═══════════════════════════════════\n");
    console.log("⚠️  Please change this password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
