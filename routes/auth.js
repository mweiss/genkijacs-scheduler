'use strict';

var express = require('express');
var passport = require('passport');

var router = express.Router();

/* logedin */
router.get("/loggedin", function (req, res) {
  console.log("loggedin", req.user, req.isAuthenticated());
  res.send(req.isAuthenticated() ? req.user : '0');
});

/* login */
router.get('/login', passport.authenticate('local'), function(req, res) {
  console.log("login", req.user, req.isAuthenticated());
  res.send(req.user);
});

/* logout */
router.get("/logout", function (req, res) {
  console.log("logout");
  req.logOut();
  res.sendStatus(200);
});

module.exports = router;