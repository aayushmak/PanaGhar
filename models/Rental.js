// models/Rental.js
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  rentedAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnedAt: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["rented", "returned", "overdue"],
    default: "rented",
  },
});

module.exports = mongoose.model("Rental", rentalSchema);
