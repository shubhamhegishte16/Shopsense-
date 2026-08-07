const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// @route  POST /api/auth/signup
// @desc   Register a new user
// @access Public
router.post("/signup", signup);

// @route  POST /api/auth/login
// @desc   Login user and return JWT
// @access Public
router.post("/login", login);

// @route  GET /api/auth/me
// @desc   Get current logged-in user
// @access Private
router.get("/me", protect, getMe);

module.exports = router;
