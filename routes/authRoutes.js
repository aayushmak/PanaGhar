const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Signup Routes
router.get("/signup", authController.showSignupPage);
router.post("/signup", authController.registerUser);

// Login Routes
router.get("/login", authController.showLoginPage);
router.post("/login", authController.loginUser);

// Logout
router.get("/logout", authController.logoutUser);

// Personalized Landing Page After Login
router.get("/landingPageUser", authController.landingPageUser);

module.exports = router;
