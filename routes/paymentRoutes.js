const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const Book = require("../models/Book");

// ✅ Middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }
  next();
}

// ✅ Signature generator for eSewa
function generateEsewaSignature({ total_amount, transaction_uuid, product_code }, secretKey) {
  const data = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  return crypto.createHmac("sha256", secretKey).update(data).digest("base64");
}

// ✅ Payments Page - shows only rented/overdue books for logged-in user
router.get("/payments", isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const currentDate = new Date();

    // Find books rented by the current user
    const books = await Book.find({
      rentedBy: userId,
      status: { $in: ["rented", "overdue"] },
    }).lean();

    // Update overdue status if 7+ days passed
    for (const book of books) {
      if (
        book.status === "rented" &&
        book.rentedAt &&
        new Date(book.rentedAt).getTime() + 7 * 24 * 60 * 60 * 1000 < currentDate.getTime()
      ) {
        await Book.findByIdAndUpdate(book._id, { status: "overdue" });
        book.status = "overdue";
      }
    }

    // ✅ Render with safe error/success
    res.render("payment", {
      books,
      user: req.session.user,
      error: null,
      success: req.query.message || null,
    });
  } catch (error) {
    console.error("❌ Payment page error:", error);
    res.render("payment", {
      books: [],
      user: req.session.user,
      error: "Failed to load payment information.",
      success: null,
    });
  }
});

// ✅ Billing Page (requires login)
router.get("/billing", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).send("Missing book ID");

    const book = await Book.findById(id);
    if (!book) return res.status(404).send("Book not found");

    res.render("billingPage", { book, user: req.session.user });
  } catch (err) {
    console.error("Error loading billing page:", err);
    res.status(500).send("Server error loading billing page");
  }
});

// ✅ eSewa Payment Redirect
router.get("/esewa/pay/:bookId", isLoggedIn, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).send("Book not found");

    const total_amount = book.price;
    const transaction_uuid = `book_${book._id}_${Date.now()}`;
    const product_code = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
    const secretKey = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";

    const signature = generateEsewaSignature(
      { total_amount, transaction_uuid, product_code },
      secretKey
    );

    res.render("esewaRedirect", {
      total_amount,
      transaction_uuid,
      product_code,
      signature,
      book,
      successUrl: `${process.env.BASE_URL}/esewa/success?bookId=${book._id}`,
      failureUrl: `${process.env.BASE_URL}/esewa/failure?bookId=${book._id}`,
    });
  } catch (err) {
    console.error("Error preparing eSewa payment:", err);
    res.status(500).send("Server error preparing payment");
  }
});

// ✅ eSewa Success Callback
router.get("/esewa/success", async (req, res) => {
  try {
    let { bookId } = req.query;
    if (!bookId) return res.status(400).send("Missing book ID");
    if (bookId.includes("?")) bookId = bookId.split("?")[0];

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).send("Book not found");

    book.status = "rented";
    book.rentedAt = new Date();
    if (req.session.user) book.rentedBy = req.session.user._id;
    await book.save();

    res.redirect("/payments?message=Payment Successful! Book rented.");
  } catch (err) {
    console.error("❌ Error updating book status:", err);
    res.status(500).send("Payment processed, but failed to update book status.");
  }
});

// ✅ eSewa Failure Callback
router.get("/esewa/failure", (req, res) => {
  console.log("❌ Payment failed");
  res.redirect("/payments?message=Payment Failed. Please try again.");
});

// ✅ My Rentals Page
router.get("/rental", isLoggedIn, async (req, res) => {
  try {
    const rentedBooks = await Book.find({
      rentedBy: req.session.user._id,
      status: "rented",
    }).lean();

    res.render("myRentals", { books: rentedBooks, user: req.session.user });
  } catch (err) {
    console.error("Error loading myRentals page:", err);
    res.status(500).send("Server error loading rental data");
  }
});

module.exports = router;
