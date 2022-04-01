//require moudles
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
const port = 3000;

//set up view engine and serve static files
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Mongoose connection|Schema |Model

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/userDB");
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET_KEY,
  excludeFromEncryption: ["email"],
});

const User = mongoose.model("User", userSchema);

//TODO
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

//register save newUser
app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save((err, docs) => {
    if (err) {
      res.send("Register failed " + err);
    } else {
      res.render("secrets");
    }
  });
});

//login & validator
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, (err, foundUser) => {
    if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      } else {
        res.send("Wrong user name or password. " + err);
      }
    }
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
