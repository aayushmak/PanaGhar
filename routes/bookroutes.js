// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const Book = require("../models/Book");

// Upload form
router.get("/upload", (req, res) => {
  res.render("uploadBook", { error: null, success: null });
});

// Handle upload
router.post("/upload", bookController.handleBookUpload);

// Browse page — fetch and show all books
router.get("/browse", async (req, res) => {
  try {
    const books = await Book.find();

    if (!books || books.length === 0) {
      return res.render("browse", { books: [], message: "No books found." });
    }

    console.log("✅ Books fetched:", books.length);
    res.render("browse", { books, message: null });
  } catch (err) {
    console.error("❌ Error fetching books:", err);
    res.render("browse", { books: [], message: "Server error occurred." });
  }
});

module.exports = router;
