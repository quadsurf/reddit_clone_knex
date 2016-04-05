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

// module.exports = function (meetupId) {
//   return knex('meetups').where({id: meetupId}).first().then(function (meetup) {
//     return knex('memberships').where({meetup_id: meetupId}).pluck('user_id').then(function (userIds) {
//       return knex('users').whereIn('id', userIds).then(function (users) {
//         return {
//           meetup: meetup,
//           members: users
//         }
//       });
//     });
//   })
// }

router.get('/:id/edit', (req,res) => {
  // REFACTOR WITH PLUCK user_id
  knex.select("posts.id as post_id","posts.title","posts.body","posts.user_id","users.username","tags.id ","tags.name").from('posts')
      .join("users","posts.user_id","users.id")
      .leftOuterJoin("post_tags", "posts.id", "post_tags.post_id")
      .leftOuterJoin("tags", "post_tags.tag_id", "tags.id")
      .where({"posts.id": req.params.id})
      .then((post) => {

      post = Object.assign(post[0], {tags: post.map(v => {
        return {
          name: v.name,
          id: v.id
        }
      })
    })

    knex.select("name","id").from("tags").then((all_tags) => {
        var checked_tags = _.difference(post.tags, all_tags).map(function(val){
            return Object.assign(val, {isChecked: true})
        })
        var tags = _.uniqBy(checked_tags.concat(all_tags),"name")
        res.render("posts/edit", {post,tags})
    })
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.post('/', (req,res) => {
  knex.insert(req.body.post,"*").into('posts').then((post) =>{
    knex('posts').where({id: post[0].id}).update({user_id: req.params.user_id})
      .then(function(){
        require("locus")
        eval(locus)
        Promise.map(req.body.tags.ids, (id) => {
          return knex.insert({tag_id: id, post_id: post[0].id}).into('post_tags')
        })
        .then(function(){
          res.redirect(`/users/${req.params.user_id}/posts`)
        })
    });
  });
});

router.patch('/:id', (req,res) => {
  knex('posts').where({id:req.params.id}).update(req.body.post).returning("*").first().then((post) =>{

    knex("post_tags").where({post_id:post.id}).del().then(() =>{
      Promise.map(req.body.tags.ids, (id) => {
        return knex.insert({tag_id: id, post_id: post.id}).into('post_tags')
      }).then(() => {
        res.redirect(`/users/${post.user_id}/posts`)
      })
    })
  }).catch((err) =>{
    res.render("error", {err})
  });
});

router.delete('/:id', (req,res) => {
  knex('posts').where({id:req.params.id}).returning("*").first().del().then((post) =>{
    knex('post_tags').where({id:req.params.id}).del().then(() => {
      res.redirect(`/users/${req.params.user_id}/posts`)
    })
  }).catch((err) =>{
    res.render("error", {err})
  });
});


module.exports = router