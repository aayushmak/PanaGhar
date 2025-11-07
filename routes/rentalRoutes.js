const express = require("express");
const router = express.Router();

router.get("/rental", (res, req) => {
  res.render("myRentals")
})

module.exports = router;