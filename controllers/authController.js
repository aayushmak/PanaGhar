const User = require("../models/User");
const Book = require("../models/Book");
const bcrypt = require("bcrypt");

// ✅ Show Signup Page
exports.showSignupPage = (req, res) => {
  res.render("signUp", { error: null, user: req.session.user || null });
};

// ✅ Handle Signup Form
exports.registerUser = async (req, res) => {
  const { firstname, lastname, email, phoneno, password, confirmpassword } = req.body;

  try {
    if (password !== confirmpassword) {
      return res.render("signUp", {
        error: "Passwords do not match.",
        user: req.session.user || null,
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.render("signUp", {
        error: "Email already in use.",
        user: req.session.user || null,
      });
    }

    const existingPhone = await User.findOne({ phoneno });
    if (existingPhone) {
      return res.render("signUp", {
        error: "Phone number already registered.",
        user: req.session.user || null,
      });
    }

    // ✅ Create and save user
    const user = new User({
      firstname,
      lastname,
      email,
      phoneno,
      password, // bcrypt hash handled in schema
    });

    await user.save();

    console.log(`✅ User registered: ${email}`);
    res.redirect("/login");
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.render("signUp", {
      error: "Something went wrong. Please try again.",
      user: req.session.user || null,
    });
  }
};

// ✅ Show Login Page
exports.showLoginPage = (req, res) => {
  res.render("logIn", { error: null, user: req.session.user || null });
};

// ✅ Handle Login Form
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("logIn", {
        error: "User not found.",
        user: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("logIn", {
        error: "Incorrect password.",
        user: null,
      });
    }

    req.session.user = user;
    console.log(`✅ Login successful for: ${user.email}`);
    res.redirect("/landingPageUser");
  } catch (err) {
    console.error("❌ Login error:", err);
    res.render("logIn", {
      error: "Something went wrong. Please try again.",
      user: null,
    });
  }
};

// ✅ Logout
exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

// Landing Page (for everyone)
exports.landingPage = async (req, res) => {
  try {
    const topBooks = await Book.find().limit(4).lean(); // fetch books
    res.render("landingPage", {
      user: req.session.user || null,
      topBooks, // pass it here
    });
  } catch (err) {
    console.error("Landing page error:", err);
    res.render("landingPage", {
      user: req.session.user || null,
      topBooks: [], // fallback
    });
  }
};

// Landing Page for logged-in users
exports.landingPageUser = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect("/login");

  try {
    const topBooks = await Book.find().limit(4).lean();
    res.render("landingPageUser", { user, topBooks });
  } catch (err) {
    console.error("Landing page user error:", err);
    res.render("landingPageUser", { user, topBooks: [] });
  }
};

exports.landingPageUser = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect("/login");

  try {
    // Fetch featured books
    const featuredBooks = await Book.find({ status: "available" })
      .sort({ createdAt: -1 }) // most recent
      .limit(4);

    // Fetch top books
    const topBooks = await Book.find({ status: "available" })
      .sort({ rating: -1 })
      .limit(8);

    res.render("landingPageUser", { user, featuredBooks, topBooks });
  } catch (err) {
    console.error("Error fetching books for user landing page:", err);
    res.render("landingPageUser", { user, featuredBooks: [], topBooks: [] });
  }
};