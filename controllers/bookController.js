const Book = require("../models/Book");
const path = require("path");
const fs = require("fs");

// Use multer to handle image uploads
const multer = require("multer");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "public", "uploads");
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

// File filter (optional, restrict to images only)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
}).array("images", 4); // Max 4 images

// Controller function
exports.handleBookUpload = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error("Multer error:", err);
      return res.render("uploadBook", { error: err.message, success: null });
    }

    const { bookName, genre, author, condition, description } = req.body;

    // Validate manually just in case
    if (!bookName || !genre || !author || !condition || !description) {
      return res.render("uploadBook", {
        error: "All fields are required.",
        success: null
      });
    }

    try {
      const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

      const newBook = new Book({
        bookName,
        genre,
        author,
        condition,
        description,
        imageUrls: imagePaths,
        uploadedBy: req.session.user ? req.session.user._id : null
      });

      await newBook.save();

      res.render("uploadBook", {
        success: "Book uploaded successfully!",
        error: null
      });
    } catch (saveErr) {
      console.error("Upload error:", saveErr);
      res.render("uploadBook", {
        error: "Something went wrong while uploading.",
        success: null
      });
    }
  });
};
