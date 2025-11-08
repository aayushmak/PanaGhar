// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
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
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rental",
    required: false, // optional link to rental record
  },
  transactionId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["eSewa", "Khalti", "Card", "Cash"],
    default: "eSewa",
  },
  status: {
    type: String,
    enum: ["success", "failed", "pending"],
    default: "success",
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
