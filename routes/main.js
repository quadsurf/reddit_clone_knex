const express = require("express")
const router = express.Router();
const knex = require("../db/knex")

router.get("/", (req,res) => {
  res.redirect("/users");
});

router.get('/posts', (req,res) => {
  res.render("main/all_posts")
});

router.get('/search', (req,res) => {
  res.send("TODO!")
});

module.exports = router