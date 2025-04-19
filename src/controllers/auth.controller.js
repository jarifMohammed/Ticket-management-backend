const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file
const jwt = require("jsonwebtoken");

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    console.log("User saved successfully");

    // Generate the JWT token after successful registration
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Cookie is only sent over HTTPS in production
      sameSite: "Strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send user info in the response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate the JWT token after successful login
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.setHeader("Authorization", `Bearer ${token}`);

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Cookie is only sent over HTTPS in production
      sameSite: "Strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send user info in the response
    res.status(200).json({
      success: true,
      user: { name: user.name, email: user.email, role: user.role },
      token: token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Logout User
exports.logout = (req, res) => {
  const token = req.cookies.token;

  // If token doesn't exist, user is not logged in
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "User already logged out or not logged in",
    });
  }
  // Clear the token (from cookie)
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Cookie is only sent over HTTPS in production
    sameSite: "Strict", // Prevents CSRF attacks
  });

  // Send a response confirming logout
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
