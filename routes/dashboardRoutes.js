// routes/dashboardRoutes.js (or add to your existing routes file)
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

// GET /dashboard - Display user dashboard
router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    // Fetch complete user data from database
    const user = await User.findById(req.session.user._id);
    
    if (!user) {
      return res.redirect("/login");
    }

    // Calculate account age
    const accountAge = getAccountAge(user.createdAt);

    res.render("userDashboard", { 
      user: user,
      accountAge: accountAge,
      error: null,
      success: null
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.render("userDashboard", { 
      user: req.session.user,
      accountAge: "Unknown",
      error: "Failed to load user data",
      success: null
    });
  }
});

// POST /dashboard - Update user profile
router.post("/dashboard", requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, gender, province, id, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.session.user._id,
      {
        firstname: firstName,
        lastname: lastName,
        gender: gender,
        province: province,
        citizenshipId: id,
        phone: phone
      },
      { new: true, runValidators: true }
    );

    // Update session
    req.session.user = updatedUser;

    const accountAge = getAccountAge(updatedUser.createdAt);

    res.render("userDashboard", {
      user: updatedUser,
      accountAge: accountAge,
      error: null,
      success: "Profile updated successfully!"
    });
  } catch (error) {
    console.error("Update error:", error);
    
    const user = await User.findById(req.session.user._id);
    const accountAge = getAccountAge(user.createdAt);

    res.render("userDashboard", {
      user: user,
      accountAge: accountAge,
      error: "Failed to update profile. Please try again.",
      success: null
    });
  }
});

// Helper function to calculate account age
function getAccountAge(createdAt) {
  if (!createdAt) return "Unknown";
  
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
}

module.exports = router;