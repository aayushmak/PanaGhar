// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const multer = require("multer");
const path = require("path");

// ✅ Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
}).array("images", 4);

// ✅ GET /upload - Show upload form
router.get("/upload", (req, res) => {
  res.render("uploadBook", { 
    error: null, 
    success: null, 
    user: req.session.user || null 
  });
});

// ✅ POST /upload - Handle book upload
router.post("/upload", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.render("uploadBook", { 
        error: err.message, 
        success: null, 
        user: req.session.user || null 
      });
    }

    try {
      // Get uploaded file paths
      const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

      // Create new book
      const newBook = new Book({
        bookName: req.body.bookName,
        genre: req.body.genre,
        author: req.body.author,
        condition: req.body.condition,
        description: req.body.description,
        imageUrls: imageUrls,
        uploadedBy: req.session.user?._id || null,
        status: "available"
      });

      // Save to database
      await newBook.save();
      
      console.log("✅ Book uploaded successfully:", newBook);
      
      // Redirect to manage books 
      res.redirect("/manageBook");
      
    } catch (error) {
      console.error("❌ Database error:", error);
      res.render("uploadBook", { 
        error: "Failed to save book. Please try again.", 
        success: null, 
        user: req.session.user || null 
      });
    }
  });
});

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
    res.render("browse", { 
      books, 
      message: null, 
      user: req.session.user || null 
    });
  } catch (err) {
    console.error("❌ Error fetching books:", err);
    res.render("browse", {
      books: [],
      message: "Server error occurred.",
      user: req.session.user || null,
    });
  }
});

// ✅ Book details page
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

    res.render("detailsPage", { 
      book, 
      error: null, 
      user: req.session.user || null 
    });
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