'use strict';

var express = require('express');
var db = require('../models/index');
var router = express.Router();
var db = require('../models/index');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET teachers */
router.get('/teachers', function(req, res) {
  db.User.all({ include: [{ all: true }]}).then(function (result) {
    res.send(JSON.stringify(result));
  });
});

router.post('/teachers', function(req, res) {
  console.log('TODO: implement edit/insert into teachers');
  res.status(200).json(null);
});

module.exports = router;
