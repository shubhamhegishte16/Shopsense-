const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ─── Protect routes — verify JWT token ─────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (without password)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
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

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// ─── Restrict to certain roles ─────────────────────────────────────────────────
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };

