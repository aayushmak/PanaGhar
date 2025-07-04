const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Signup routes
router.get("/signup", authController.showSignupPage);
router.post("/signup", authController.registerUser);

// Login routes
router.get("/login", authController.showLoginPage);
router.post("/login", authController.loginUser);

// Logout
router.get("/logout", authController.logoutUser);

module.exports = router;
