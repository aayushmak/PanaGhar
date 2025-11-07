const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  genre: { type: String, required: true },
  author: { type: String, required: true },
  condition: { type: String, required: true },
  description: { type: String, required: true },
  imageUrls: { type: [String], default: [] },
  price: { type: Number },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now }
});

// Pre-save hook to set price according to condition
bookSchema.pre('save', function (next) {
  switch (this.condition.toLowerCase()) {
    case 'excellent':
      this.price = 300;
      break;
    case 'good':
      this.price = 250;
      break;
    case 'average':
      this.price = 200;
      break;
    case 'bad':
      this.price = 150;
      break;
    default:
      this.price = 0;
  }
  next();
});

module.exports = mongoose.model("Book", bookSchema);
