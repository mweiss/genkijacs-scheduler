'use strict';

var express = require('express');
var db = require('../models/index');
var router = express.Router();

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

router.post('/teachers/edit', function(req, res) {
  console.log('testing teacher edits');
  res.send('["test"]');
});

module.exports = router;
