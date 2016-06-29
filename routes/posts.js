var express = require('express');
var knex = require('../db/knex');
var router = express.Router({mergeParams:true});
var bodyParser = require('body-parser');
