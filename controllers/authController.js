const User = require("../models/User");

// Show Signup Page
exports.showSignupPage = (req, res) => {
  res.render("signup"); // signup.ejs
};

// Handle Signup Submission
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new User({ name, email, password }); // TODO: hash password in future
    await user.save();
    req.session.user = user;
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Signup failed:", err);
    res.redirect("/signup");
  }
};

// Show Login Page
exports.showLoginPage = (req, res) => {
  res.render("login"); // login.ejs
};

// Handle Login Submission
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password }); // TODO: hash compare
    if (!user) return res.redirect("/login");

    req.session.user = user;
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Login failed:", err);
    res.redirect("/login");
  }
};

// Logout
exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/"); // Back to landing page
  });
};
