require("dotenv").config(); // Load .env variables

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");

// Express app
const app = express();
const port = process.env.PORT || 4000;

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "defaultSecret",
  resave: false,
  saveUninitialized: true
}));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Body parsing & static files
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", publicRoutes);
app.use("/", authRoutes);

// MongoDB connection (Atlas or Local)
const dbURI = process.env.MONGODB_URI_ATLAS || process.env.MONGODB_URI_LOCAL;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

const bookRoutes = require("./routes/bookRoutes");
app.use(bookRoutes);


module.exports = app;
