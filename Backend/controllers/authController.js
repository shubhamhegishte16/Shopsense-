const jwt = require("jsonwebtoken");
const User = require("../models/User");

// â”€â”€â”€ Helper: generate JWT token â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// â”€â”€â”€ Helper: send token response â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);
  const safeUser = user.toSafeObject();

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: safeUser,
  });
};

// â”€â”€â”€ POST /api/auth/signup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide full name, email and password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({ fullName, email, password });
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 201, res, "Account created successfully! Welcome to ShopSense AI.");
  } catch (error) {
    console.error("Signup Error:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// â”€â”€â”€ POST /api/auth/login â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // Intercept hardcoded admin login
    if (email.toLowerCase() === "admin@shopsense.com") {
      if (password !== "admin123") {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      // Ensure the admin user exists in the DB
      let adminUser = await User.findOne({ email: "admin@shopsense.com" });
      if (!adminUser) {
        adminUser = await User.create({
          fullName: "Admin",
          email: "admin@shopsense.com",
          password: "admin123", // Will be hashed by pre-save hook
          role: "admin",
        });
      } else if (adminUser.role !== "admin") {
        adminUser.role = "admin";
        await adminUser.save({ validateBeforeSave: false });
      }

      adminUser.lastLogin = new Date();
      await adminUser.save({ validateBeforeSave: false });

      return sendTokenResponse(adminUser, 200, res, "Admin login successful!");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.accountStatus === "suspended") {
      return res.status(403).json({
        success: false,
        message: user.suspensionReason
          ? "Your account has been suspended. Reason: " + user.suspensionReason
          : "Your account has been suspended. Please contact support.",
      });
    }

    if (user.accountStatus === "deleted") {
      return res.status(403).json({
        success: false,
        message: "This account is no longer active.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res, "Login successful! Welcome back.");
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// â”€â”€â”€ GET /api/auth/me â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user: user.toSafeObject(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// ─── POST /api/auth/admin-login ──────────────────────────────────────────────
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    if (email.toLowerCase() !== "admin@shopsense.com" || password !== "admin123") {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    // Ensure the admin user exists in the DB so that `protect` middleware can find it
    let adminUser = await User.findOne({ email: "admin@shopsense.com" });
    if (!adminUser) {
      adminUser = await User.create({
        fullName: "Admin",
        email: "admin@shopsense.com",
        password: "admin123", // Will be hashed by pre-save hook
        role: "admin",
      });
    } else if (adminUser.role !== "admin") {
      adminUser.role = "admin";
      await adminUser.save({ validateBeforeSave: false });
    }

    adminUser.lastLogin = new Date();
    await adminUser.save({ validateBeforeSave: false });

    sendTokenResponse(adminUser, 200, res, "Admin login successful!");
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

module.exports = { signup, login, getMe, adminLogin };

