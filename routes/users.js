const express = require("express")
const router = express.Router();
const knex = require("../db/knex")

router.get('/', (req,res) => {
  knex('users').then((users) =>{
    res.render("users/index", {users})
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.get('/new', (req,res) => {
  res.render("users/new")
})

router.get('/:id', (req,res) => {
  knex('users').where({id: req.params.id}).first().then((user) =>{
    res.render("users/show", {user})
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.get('/:id/edit', (req,res) => {
  knex('users').where({id: req.params.id}).first().then((user) =>{
    res.render("users/edit", {user})
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.post('/', (req,res) => {
  knex('users').insert(req.body.user).then(() =>{
    res.redirect('/users')
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.patch('/:id', (req,res) => {
  knex('users').where({id:req.params.id}).update(req.body.user).then(() =>{
    res.redirect('/users')
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.delete('/:id', (req,res) => {
  knex('users').where({id:req.params.id}).del().then(() =>{
    res.redirect('/users')
  }).catch((err) =>{
    res.render("error", {err})
  });
});


module.exports = router;