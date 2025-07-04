const User = require("../models/User");

// Show Signup Page
exports.showSignupPage = (req, res) => {
  res.render("signUp"); // Make sure this matches your EJS file
};

// Handle Signup Form
exports.registerUser = async (req, res) => {
  const { firstname, lastname, email, phoneno, password, confirmpassword } = req.body;

  try {
    // NOTE: In production, hash the password using bcrypt
    const user = new User({ firstname, lastname, email, phoneno, password, confirmpassword });
    await user.save();
    req.session.user = user;
    res.redirect("/landingPageUser");
  } catch (err) {
    console.error("Signup error:", err);
    res.redirect("/signup");
  }
};

// Show Login Page
exports.showLoginPage = (req, res) => {
  res.render("logIn"); // Make sure this matches your EJS file
};

// Handle Login Form
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password }); // ⚠️ No password hashing here yet
    if (!user) return res.redirect("/login");

    req.session.user = user;
    res.redirect("/landingPageUser");
  } catch (err) {
    console.error("Login error:", err);
    res.redirect("/login");
  }
};

// Handle Logout
exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

// Show Landing Page After Login
exports.landingPageUser = (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect("/login"); // Safety check
  res.render("landingPageUser", { user }); // Make sure landingPageUser.ejs exists
};
