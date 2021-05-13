const express = require("express");
const ytSuggest = require("./modules/suggestion");
const app = express.Router();

app.post("/api/suggest", (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(404).send("Empty query.");

  console.log(query);
  ytSuggest(query).then((results) => {
    res.status(200).send(results);
  });
});

module.exports = app;
