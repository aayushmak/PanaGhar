// var createError = require("http-errors");
const express = require("express");
var path = require("path");
// var cookieParser = require("cookie-parser");
// var logger = require("morgan");
const mongoose = require("mongoose");
const port = process.env.PORT || 4000;
const session = require("express-session");
// require("dotenv").config();

const app = express();


const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");


app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: true
}));

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");
// app.use(express.static("public"));
// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", authRoutes);

// app.get("/",(req, res) => {
//   res.send("hii ")
// });

app.listen(port, () => {
  console.log(`server is running at ${port}`)
})

app.use("/", publicRoutes);

mongoose.connect("mongodb://localhost:27017/PanaGhar",{
}).then(() => {
  console.log(`connection successful`);
}).catch((e) => {
  console.log(`no connection`);
})

module.exports = app;