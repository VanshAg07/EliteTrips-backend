// middleware/auth.js
const jwt = require("jsonwebtoken");

// Middleware to verify token and role
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Get the token from headers

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded;
    next(); // Token is valid, proceed to the next middleware
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Middleware to check if user is admin
const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // User is admin, proceed
  } else {
    res.status(403).json({ message: "Admin access denied" });
  }
};

module.exports = { verifyToken, verifyAdmin };
