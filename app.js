// Load environment variables
require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");


// Import routes
const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes")
const paymentRoutes = require("./routes/paymentRoutes")


// Initialize Express
const app = express();
const port = process.env.PORT || 4000;

// ------------------------------
// 🔐 Session Middleware
// ------------------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: true,
  })
);

// ------------------------------
// 🧩 View Engine Setup (EJS)
// ------------------------------
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ------------------------------
// 📦 Middleware Setup
// ------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "public")));

// ------------------------------
// 🛣️ Route Setup
// ------------------------------
app.use("/", publicRoutes);
app.use("/", authRoutes);
app.use("/", bookRoutes);
app.use("/", rentalRoutes)
app.use("/", dashboardRoutes)
app.use("/", paymentRoutes)

app.use(express.static("public")); // or "assets" depending on your folder


// ------------------------------
// 🌐 MongoDB Connection
// ------------------------------
const dbURI = process.env.MONGODB_URI_ATLAS || process.env.MONGODB_URI_LOCAL;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------------------
// 🚀 Start Server
// ------------------------------
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

const Book = require("./models/Book");

Book.updateMany(
  { status: { $exists: false } },
  { $set: { status: "available" } }
)
  .then((result) => {
    console.log(`✅ Updated ${result.modifiedCount} books to have status 'available'`);
  })
  .catch((err) => console.error("❌ Error updating books:", err));
  
module.exports = app;
