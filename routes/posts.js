const express = require("express")
const router = express.Router({mergeParams: true});
const knex = require("../db/knex")

router.get('/', (req,res) => {
  knex('posts').where({user_id: req.params.user_id}).then((posts) =>{
    knex('users').where({id: req.params.user_id}).first().then((user) => {
      res.render("posts/index", {posts,user})
    })
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.get('/new', (req,res) => {
  knex('users').where({id: req.params.user_id}).first().then((user) => {
    res.render("posts/new", {user})
  })
})

router.get('/:id', (req,res) => {
  knex('posts').where({id: req.params.id}).first().then((post) =>{
    res.render("posts/show", {post})
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.get('/:id/edit', (req,res) => {
  knex('posts').where({id: req.params.id}).first().then((post) =>{
    knex('users').where({id: post.user_id}).first().then((user) => {
      res.render("posts/edit", {post,user})
    })
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.post('/', (req,res) => {
  knex.insert(req.body.post,"*").into('posts').then((post) =>{
    knex('posts').where({id: post[0].id}).update({user_id: req.params.user_id})
      .then(function(){
        res.redirect(`/users/${req.params.user_id}/posts`)
      })
    });
});

router.patch('/:id', (req,res) => {
  knex('posts').where({id:req.params.id}).update(req.body.post).then(() =>{
    res.redirect(`/users/#{post.user_id}/posts`)
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.delete('/:id', (req,res) => {
  knex('posts').where({id:req.params.id}).returning("*").first().del().then((post) =>{
    res.redirect(`/users/${req.params.user_id}/posts`)
  }).catch((err) =>{
    res.render("error", {err})
  });
});


module.exports = router