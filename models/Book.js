const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  genre: { type: String, required: true },
  author: { type: String, required: true },
  condition: { type: String, required: true },
  description: { type: String, required: true },
  imageUrls: [String],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Book", bookSchema);
