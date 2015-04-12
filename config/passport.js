'use strict';

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var db = require('../models/index');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log('deserialize user');
    
    db.User.findOne(id).success(function(user) {
      done(null, user);
    }).error(function(err){
      return done(err);
    });
  });  
  
  passport.use(new LocalStrategy({
    // set the field name here
    usernameField: 'email',
    passwordField: 'password'
  },
                                   
  function(username, password, done) {
    db.User.findOne({ where: {email: username}})
      .success(function(user){     
        if(!user)
          // if the user is not exist
          return done(null, false, {message: "The user is not exist"});
        else if(!user.password == password)
          // if password does not match
          return done(null, false, {message: "Wrong password"});
        else
          // if everything is OK, return null as the error
          // and the authenticated user
          return done(null, user);
      })
      .error(function(err){
        // if command executed with error
        return done(err);
      });
    }                           
  ));
};