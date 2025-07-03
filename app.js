// var createError = require("http-errors");
const express = require("express");
// var path = require("path");
// var cookieParser = require("cookie-parser");
// var logger = require("morgan");
const mongoose = require("mongoose");
const port = process.env.PORT || 4000;
// require("dotenv").config();

const app = express();

app.get("/",(req, res) => {
  res.send("hii")
});

app.listen(port, () => {
  console.log(`server is running at ${port}`)
})

