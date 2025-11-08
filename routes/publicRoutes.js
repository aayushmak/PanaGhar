// routes/publicRoutes.js
const express = require("express");
const router = express.Router();

// Landing Page (First page seen by all visitors)
router.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/landingPageUser");
  }
  res.render("landingPage");
});

// Login Page
router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/landingPageUser");
  }
  res.render("logIn");
});

// About Us Page
router.get("/about", (req, res) => {
  res.render("aboutUs");
});

//Billing Page
router.get("/manage", (res, req) => {
  res.render("manageBooks");
})

// Our Team Page
router.get("/team", (req, res) => {
  res.render("team");
});

// Dashboard
router.get("/dashboard", (req, res) => {
  res.render("userDashboard");
});


router.get("/details/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).send("Book not found");

    res.render("detailsPage", {
      book,
      user: req.session.user || null, // ✅ pass the user (or null if not logged in)
    });
  } catch (err) {
    console.error("Error loading details page:", err);
    res.status(500).send("Server error loading book details");
  }
});


//Favourite Page
router.get("/favourite", (req, res) => {
  res.render("favouritePage")
})

router.get("rental", (res, req) => {
  res.render("myRentals")
})


module.exports = router;
