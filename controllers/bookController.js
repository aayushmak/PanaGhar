exports.handleBookUpload = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error("Multer error:", err);
      return res.render("uploadBook", { error: err.message, success: null });
    }

    const { bookName, genre, author, condition, description } = req.body;

    if (!bookName || !genre || !author || !condition || !description) {
      return res.render("uploadBook", {
        error: "All fields are required.",
        success: null
      });
    }

    try {
      // ✅ Assign price based on condition
      let price;
      switch (condition.toLowerCase()) {
        case "excellent":
          price = 300;
          break;
        case "good":
          price = 250;
          break;
        case "average":
          price = 200;
          break;
        case "bad":
          price = 150;
          break;
        default:
          price = 200;
      }

      // ✅ Handle image uploads (default image if none)
      const imagePaths =
        req.files && req.files.length > 0
          ? req.files.map((file) => `/uploads/${file.filename}`)
          : ["/uploads/default-book.png"];

      // ✅ Create new book
      const newBook = new Book({
        bookName,
        genre,
        author,
        condition,
        description,
        imageUrls: imagePaths,
        price, // ✅ Add price field
        uploadedBy: req.session.user ? req.session.user._id : null
      });

      await newBook.save();

      console.log("✅ Book uploaded successfully:", newBook);

      res.render("uploadBook", {
        success: "Book uploaded successfully!",
        error: null
      });
    } catch (saveErr) {
      console.error("❌ Upload error:", saveErr);
      res.render("uploadBook", {
        error: "Something went wrong while uploading the book.",
        success: null
      });
    }
  });
};
