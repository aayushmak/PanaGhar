// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const Book = require("../models/Book");

// ✅ Upload form
router.get("/upload", (req, res) => {
  res.render("uploadBook", { error: null, success: null, user: req.session.user || null });
});

// ✅ Handle upload
router.post("/upload", bookController.handleBookUpload);

// ✅ Browse page — fetch and show all books
router.get("/browse", async (req, res) => {
  try {
    const books = await Book.find();

    if (!books || books.length === 0) {
      return res.render("browse", {
        books: [],
        message: "No books found.",
        user: req.session.user || null,
      });
    }

    console.log("✅ Books fetched:", books.length);
    res.render("browse", { books, message: null, user: req.session.user || null });
  } catch (err) {
    console.error("❌ Error fetching books:", err);
    res.render("browse", {
      books: [],
      message: "Server error occurred.",
      user: req.session.user || null,
    });
  }
});

// ✅ Book details page (explicitly /books/:id)
router.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).render("detailsPage", {
        error: "Book not found",
        book: null,
        user: req.session.user || null,
      });
    }

    // ✅ Pass user to EJS to avoid “user is not defined”
    res.render("detailsPage", { book, error: null, user: req.session.user || null });
  } catch (err) {
    console.error("Error loading book details:", err);
    res.status(500).render("detailsPage", {
      error: "Server error loading book details.",
      book: null,
      user: req.session.user || null,
    });
  }
});

module.exports = router;
