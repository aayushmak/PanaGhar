const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const Book = require("../models/Book");



// ✅ My Rentals Page — shows only currently rented books
router.get("/rental", async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const userId = req.session.user._id;

    const rentedBooks = await Book.find({
      rentedBy: userId,
      status: "rented",
    }).lean();

    res.render("myRentals", { books: rentedBooks, user: req.session.user });
  } catch (err) {
    console.error("Error loading myRentals page:", err);
    res.status(500).send("Server error loading rental data");
  }
});

module.exports = router;
