const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// Show upload form
router.get("/upload", (req, res) => {
  res.render("uploadBook", { error: null, success: null });
});

// Handle book upload
router.post("/upload", bookController.handleBookUpload);

module.exports = router;
