require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");
const urlParser = require("url");
const mongoose = require("mongoose");

// Basic Configuration
const port = process.env.PORT || 3000;

const uri = process.env.mongo_uri;
//console.log(uri);

mongoose.connect(uri, { useNewUrlParser: true });

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const urlEncodedParser = bodyParser.urlencoded({ extended: true });

//Server running?

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

//schema and model
const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true }
});

const urlModel = mongoose.model("model", urlSchema);

//API Endpoints
app.post("/api/shorturl", urlEncodedParser, function (req, res) {
  let url = req.body.url;
  console.log("URL is: ", req.body.url);
 // let noProtocolUrl = url.replace(/^https?:\/\//, "");
  //console.log("noProtocolUrl: ", noProtocolUrl);
  
  dns.lookup(urlParser.parse(url).hostname, function (err, address) {
    if (!address) {
      //console.log(err);
      res.json({ error: "invalid url" });
    } else {
      let doc = new urlModel({ original_url: urlParser.parse(url).href });
      console.log("doc: ", doc);
      doc.save();
      res.json({original_url: doc.original_url, short_url: doc.id})
    }
  });
});

app.get("/api/shorturl/:number", function (req, res) {
  let number = req.params.number;
  console.log("number: ", number);
  urlModel.findById(number, function (err, result) {
    console.log("docs returned from find: ", result);
    console.log("original url from find result: ", result.original_url);
    if (result == []) {
      console.log("docs was an empty array")
      res.json({error: "Invalid URL"});
    } else {
      console.log("trying to redirect user...");
      res.redirect(result.original_url);
    }
  });
});
