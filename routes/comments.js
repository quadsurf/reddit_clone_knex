const express = require("express")
const router = express.Router({mergeParams: true});
const knex = require("../db/knex")

router.get('/', (req,res) => {
  knex('comments').where({post_id: req.params.post_id}).then((comments) =>{
    knex('posts').where({id: req.params.post_id}).first().then((post) => {
      res.render("comments/index", {comments,post})
    })
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.get('/new', (req,res) => {
  knex('posts').where({id: req.params.post_id}).first().then((post) => {
    res.render("comments/new", {post})
  })
})

router.get('/:id', (req,res) => {
  knex('comments').where({id: req.params.id}).first().then((post) =>{
    res.render("comments/show", {post})
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.get('/:id/edit', (req,res) => {
  knex('comments').where({id: req.params.id}).first().then((comment) =>{
    knex('posts').where({id: comment.post_id}).first().then((post) => {
      res.render("comments/edit", {post,comment})
    })
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.post('/', (req,res) => {
  knex.insert(req.body.comment, "*").into('comments').then((comment) =>{
    knex('comments').where({id: comment[0].id}).update({post_id: req.params.post_id})
      .then(function(){
        res.redirect(`/posts/${req.params.post_id}/comments`)
      })
    });
});

router.patch('/:id', (req,res) => {
  knex('comments').where({id:req.params.id}).update(req.body.comment).then(() =>{
    res.redirect(`/posts/${req.params.post_id}/comments`)
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.delete('/:id', (req,res) => {
  knex('comments').where({id:req.params.id}).returning("*").first().del().then((post) =>{
    res.redirect(`/posts/${req.params.post_id}/comments`)
  }).catch((err) =>{
    res.render("error", {err})
  });
});


module.exports = router