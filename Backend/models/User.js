const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never return password in queries
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Prefer not to say", ""],
      default: "",
    },
    bio: {
      type: String,
      maxlength: [150, "Bio cannot exceed 150 characters"],
      trim: true,
    },
    settings: {
      general: {
        language:    { type: String, default: 'English' },
        theme:       { type: String, enum: ['Light', 'Dark', 'System'], default: 'Light' },
        currency:    { type: String, default: 'INR (₹)' },
        dateFormat:  { type: String, default: 'DD MMM YYYY' },
        weightUnit:  { type: String, default: 'Kilogram (kg)' },
        volumeUnit:  { type: String, default: 'Liter (L)' },
        distanceUnit:{ type: String, default: 'Kilometer (km)' },
        smartRecommendations: { type: Boolean, default: true },
        autoCategorize:       { type: Boolean, default: true },
        lowStockAlerts:       { type: Boolean, default: true },
        priceDropAlerts:      { type: Boolean, default: false },
      },
      notifications: {
        email:      { type: Boolean, default: true },
        push:       { type: Boolean, default: true },
        sms:        { type: Boolean, default: false },
        weekly:     { type: Boolean, default: true },
        expiry:     { type: Boolean, default: true },
        pricedrop:  { type: Boolean, default: false },
        newfeature: { type: Boolean, default: true },
        offers:     { type: Boolean, default: false },
      },
      privacy: {
        analytics:          { type: Boolean, default: true },
        crashReports:       { type: Boolean, default: true },
        personalized:       { type: Boolean, default: true },
        publicProfile:      { type: Boolean, default: false },
      },
      displayPreferences: {
        defaultView:  { type: String, default: 'Overview' },
        itemsPerPage: { type: String, default: '20' },
        defaultSort:  { type: String, default: 'Date' },
        smartRecs:    { type: Boolean, default: true },
        autoCat:      { type: Boolean, default: true },
        analytics:    { type: Boolean, default: false },
        digest:       { type: Boolean, default: true },
      },
      budget: {
        monthlyLimit: { type: Number, default: 8000 },
        categories: {
          type: [{
            label:  { type: String },
            budget: { type: Number },
            color:  { type: String },
          }],
          default: [
            { label: 'Groceries',         budget: 3000, color: '#154539' },
            { label: 'Daily Needs',        budget: 1500, color: '#3B82F6' },
            { label: 'Snacks & Beverages', budget: 800,  color: '#F59E0B' },
            { label: 'Household',          budget: 1000, color: '#8B5CF6' },
          ],
        },
      },
      connectedApps: {
        type: [{
          name:      { type: String },
          emoji:     { type: String },
          color:     { type: String },
          connected: { type: Boolean, default: false },
          since:     { type: String },
        }],
        default: [
          { name: 'Blinkit',         emoji: '🛒', color: '#FBBF24', connected: false, since: 'Not connected' },
          { name: 'Zepto',           emoji: '⚡', color: '#8B5CF6', connected: false, since: 'Not connected' },
          { name: 'Swiggy Instamart',emoji: '🍔', color: '#F97316', connected: false, since: 'Not connected' },
          { name: 'BigBasket',       emoji: '🧺', color: '#10B981', connected: false, since: 'Not connected' },
          { name: 'JioMart',         emoji: '🏪', color: '#3B82F6', connected: false, since: 'Not connected' },
        ],
      },
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// ─── Hash password before saving ───────────────────────────────────────────────
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance method: compare passwords ────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ─── Instance method: return safe user object (no password) ────────────────────
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
