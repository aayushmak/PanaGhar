// routes/publicRoutes.js
const express = require("express");
const router = express.Router();

// Landing Page (First page seen by all visitors)
router.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/landingPageUser");
  }
  res.render("landingPage");
});

// Login Page
router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/landingPageUser");
  }
  res.render("logIn");
});

// About Us Page
router.get("/about", (req, res) => {
  res.render("aboutUs");
});

//Billing Page
router.get("/manage", (res, req) => {
  res.render("manageBooks");
})

// Our Team Page
router.get("/team", (req, res) => {
  res.render("team");
});

// Dashboard
router.get("/dashboard", (req, res) => {
  res.render("userDashboard");
});

// Billing
router.get("/billing", (req, res) => {
  res.render("billingPage");
});

// Details Page
router.get("/details", (req, res) => {
  res.render("detailsPage");
});

//Favourite Page
router.get("/favourite", (req, res) => {
  res.render("favouritePage")
})




module.exports = router;
