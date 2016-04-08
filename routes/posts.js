const express = require("express")
const router = express.Router({mergeParams: true});
const knex = require("../db/knex")
const Promise = require("bluebird")
const _ = require("lodash")

router.get('/', (req,res) => {
  knex('posts').where({user_id: req.params.user_id}).then((all_posts) =>{
    Promise.map(all_posts, (post) =>{
      return knex.select("tags.name").from("posts").where({"posts.id": post.id})
        .leftOuterJoin("post_tags", "posts.id", "post_tags.post_id")
        .leftOuterJoin("tags", "post_tags.tag_id", "tags.id")
        .then(function(tags){
            post.tags = tags
            return post;
        })
      }).then((posts) => {
        knex('users').where({id: req.params.user_id}).first().then((user) => {
          res.render("posts/index", {posts,user})
        })
      })
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.get('/new', (req,res) => {
  knex('users').where({id: req.params.user_id}).first().then((user) => {
    knex('tags').then((tags) => {
      res.render("posts/new", {user, tags})
    })
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
  knex.select("posts.id as post_id", "posts.title", "posts.body", "posts.user_id", "users.username").from('posts').where({"posts.id": req.params.id}).join("users", "posts.user_id","users.id").first().then((post) => {
    knex('post_tags').where({post_id: post.post_id}).pluck("tag_id").then((ids) => {
      knex('tags').then((tags) => {
      ids.map(Number).map(v => _.find(tags, {id:v})).map(v => Object.assign(v, {isChecked: true}))
      res.render("posts/edit", {post, tags})
      })
    })
  })
});

router.post('/', (req,res) => {
  knex.insert(req.body.post,"*").into('posts').then((post) =>{
    knex('posts').where({id: post[0].id}).update({user_id: req.params.user_id})
      .then(function(){
      if(req.body.tags){
        if(Array.isArray(req.body.tags.ids)){
          Promise.map(req.body.tags.ids, (id) => {
            return knex.insert({tag_id: id, post_id: post[0].id}).into('post_tags')
          })
          .then(function(){
            res.redirect(`/users/${req.params.user_id}/posts`)
          })
        }
        else{
          knex.insert({tag_id: req.body.tags.ids, post_id: post[0].id}).into('post_tags').then(() => {
              res.redirect(`/users/${post[0].user_id}/posts`)
          })
        }
      }
      else {
        res.redirect(`/users/${req.params.user_id}/posts`)
      }
    });
  });
});

router.patch('/:id', (req,res) => {
  // Have to watch out for edge cases when there are updates to 0 or 1 tag
  knex('posts').update(req.body.post, "*").where({id:req.params.id}).then((post) =>{
    knex("post_tags").where({post_id:post[0].id}).del().then(() =>{
      if(req.body.tags){
        if(Array.isArray(req.body.tags.ids)){
          Promise.map(req.body.tags.ids, (id) => {
            return knex.insert({tag_id: id, post_id: post[0].id}).into('post_tags')
          }).then(() => {
            res.redirect(`/users/${post[0].user_id}/posts`)
          })
        }
        else{
          knex.insert({tag_id: req.body.tags.ids, post_id: post[0].id}).into('post_tags').then(() => {
              res.redirect(`/users/${post[0].user_id}/posts`)
          })
        }
      }
      else {
        res.redirect(`/users/${post[0].user_id}/posts`)
      }
    })
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.delete('/:id', (req,res) => {
  knex('posts').where({id:req.params.id}).first().del().then(() =>{
    knex('post_tags').where({id:req.params.id}).del().then(() => {
      res.redirect(`/users/${req.params.user_id}/posts`)
    })
  }).catch((err) =>{
    res.render("error", {err})
  });
});


module.exports = router