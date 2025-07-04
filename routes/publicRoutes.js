const express = require("express");
const router = express.Router();

// Landing Page (First page seen by all visitors)
router.get("/", (req, res) => {
  // If user is already logged in, redirect to their dashboard
  if (req.session.user) {
    return res.redirect("/landingPageUser");
  }

  // If not logged in, show the public landing page
  res.render("landingPage"); // Your EJS view for the landing page
});

// About Us Page
router.get("/about", (req, res) => {
  res.render("aboutUs");
});

// Our Team Page
router.get("/team", (req, res) => {
  res.render("team");
});

// Browse Books Page (public, no login required)
router.get("/books", async (req, res) => {
  // Optional: fetch books from DB if ready
  // const books = await Book.find({ availability: "available" });
  res.render("listingPage", {
    books: [] // replace with real books later
  });
});

module.exports = router;
