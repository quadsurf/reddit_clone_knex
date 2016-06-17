var express = require('express');
var router = express.Router({mergeParams:true});
var knex = require('../db/knex');
// var models = require("../models/models");

require('locus');

var Knex = function() {
  return knex('users');
}

//READ ALL
router.get('/',function(req,res){
  Knex().then(function(result,err){
    // console.log(result);
    res.render('users/index',{users:result});
  })
})

//CREATE
router.get('/new',function(req,res){
  res.render('users/new');
});

router.post('/',function(req,res){
  // get form data
  var user = req.body;
  // insert data to db
	// created_at: knex.fn.now()
  Knex().insert({
    fullname: user.fullname,
    username: user.username,
		imgurl: user.imgurl,
		password: user.password,
		about: user.about,
		email: user.email
  }, 'id').then(function(result,err){
    // redirect to /users
    res.redirect('/users')
  });
});

// READ ONE
router.get('/:id',function(req,res){
  // get ID from params
  var userId = req.params.id

  // query database for the ID
  Knex().where('id',userId).first().then(function(result,err){
    var user = result;
    res.render('users/show',{user:user});
  })
});

// READ ONE with bookshelf


// UPDATE PART 1
router.get('/:id/edit',function(req,res){
  // get ID from params
  var userId = req.params.id;
  // query DB for the ID
  Knex().where('id',userId)
  .first()
  // render edit page with user details
  .then((result,err) => {
    var user = result;
    res.render('users/edit', {user:user});
  })

});

// UPDATE PART 2
router.post('/:userId', (req,res) => {
  // get form info from req.body + params
  var username = req.body.username,
      id = req.params.userId,
      fullname = req.body.fullname,
			password = req.body.password,
      about = req.body.about,
      email = req.body.email,
			imgurl = req.body.imgurl;
  // update db with form info and param.id
  Knex().where('id', id).update({
    fullname: fullname,
		username: username,
		imgurl: imgurl,
		password: password,
		about: about,
		email: email
  }, 'id')
  // redirect to user show page
  .then((result,err) => {
    res.redirect('/users/'+id);
  })
});

// DELETE
router.delete('/:userId', (req,res) => {
  //get info from req.params
  var userId = req.params.userId;
  //update db with form info and param id
  Knex().where('id', userId)
  .first()
  .del()
  //redirect to users read all page
  .then((result,err) => {
		res.redirect('../users');
  })
})




module.exports = router;
