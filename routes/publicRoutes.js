// routes/publicRoutes.js
const express = require("express");
const router = express.Router();
const Book = require("../models/Book"); // adjust path if needed


router.get("/", async (req, res) => {
  try {
    // Fetch top 4 featured books for the slider
    const featuredBooks = await Book.find({ status: "available" })
      .limit(4);

    // Fetch top 8 books for the "Top Books" section
    const topBooks = await Book.find({ status: "available" }).limit(8);

    // Check if user is logged in
    const user = req.session.user || null;

    res.render("landingPage", { user, topBooks, featuredBooks });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.render("landingPage", { user: null, topBooks: [], featuredBooks: [] });
  }
});

// Login Page
router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/landingPageUser");
  }
  res.render("logIn");
});

router.get("/about", (req, res) => {
  res.render("aboutUs", {
    user: req.session.user || null
  });
});




// Our Team Page
router.get("/team", (req, res) => {
  res.render("team", {
    user: req.session.user || null
  });
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

// router.get("/rental", (res, req) => {
//   res.render("myRentals")
// })

// Manage Books Page
router.get("/manageBook", async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect("/login");

    // Fetch all books uploaded by this user
    const books = await Book.find({ uploadedBy: user._id }).lean();

    res.render("manageBooks", { user, books });
  } catch (err) {
    console.error("Error fetching user books:", err);
    res.render("manageBooks", { user: null, books: [] });
  }
});



module.exports = router;
