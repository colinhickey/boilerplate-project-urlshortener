require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Basic Configuration
const port = process.env.PORT || 3000;
const db = process.ENV.database;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

let urlEncodedParser = bodyParser.urlencoded({ extended: false });

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

//shortURL schema for the database
const shortUrlSchema = new mongoose.Schema({
  original_url: String,
});

const shortUrl = mongoose.model("shortUrl", shortUrlSchema);

//POST to endpoint and get original_URL and short URL values back
//capture URL
app.post("/api/shorturl", urlEncodedParser, function (req, res) {
  let url = req.body.url;
  //console.log(url);
  //check if valid URL
  if (urlCheck(url)) {
    new shortUrl({ original_url: url });
    return res.json({ original_URL: url, short_url: "work in progress" });
  } else {
    return res.json({ error: "invalid url" });
  }
});

//check if URL is valid
function urlCheck(test) {
  try {
    new URL(test);
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
}
//store it in sequential list with a unique ID

//return the original URL and short URL

//If someone visits shortURL/:number they are rediricted to the original URL
app.get("/api/shorturl/:number", function (req, res) {
  let number = req.params.number;
  console.log("Short URL ID requested: ", number);
  let original_url = "http://www.google.com";
  res.redirect(original_url);
});
