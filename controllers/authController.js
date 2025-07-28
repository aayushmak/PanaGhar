const User = require("../models/User");
const bcrypt = require("bcrypt");

// Show Signup Page
exports.showSignupPage = (req, res) => {
  res.render("signUp", { error: null });
};

// Handle Signup Form
exports.registerUser = async (req, res) => {
  const { firstname, lastname, email, phoneno, password, confirmpassword } = req.body;

  try {
    if (password !== confirmpassword) {
      return res.render("signUp", { error: "Passwords do not match." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.render("signUp", { error: "Email already in use." });
    }

    const existingPhone = await User.findOne({ phoneno });
    if (existingPhone) {
      return res.render("signUp", { error: "Phone number already registered." });
    }

    // ✅ NO need to hash here, schema handles it
    const user = new User({
      firstname,
      lastname,
      email,
      phoneno,
      password,
      confirmpassword
    });

    await user.save();
    req.session.user = user;
    res.redirect("/login");
  } catch (err) {
    console.error("Signup error:", err);
    res.render("signUp", { error: "Something went wrong. Please try again." });
  }
};

// Show Login Page
exports.showLoginPage = (req, res) => {
  res.render("logIn", { error: null });
};

// Handle Login Form
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("logIn", { error: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("logIn", { error: "Incorrect password." });
    }

    req.session.user = user;
    res.redirect("/landingPageUser");
    console.log("Login successful for:", user.email);
  } catch (err) {
    console.error("Login error:", err);
    res.render("logIn", { error: "Something went wrong. Please try again." });
  }
};

// Logout
exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

// Landing Page After Login
exports.landingPageUser = (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect("/login");
  console.log("Rendering landing page for:", user.email);
  res.render("landingPageUser", { user });
};
