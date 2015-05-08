var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var passport = require('passport');

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var print = require('./routes/print');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//auth
require('./config/passport')(passport);
app.use(session({secret: 'genkijacs',     
                 resave: true,
                 saveUninitialized: true
                }));
app.use(passport.initialize());
app.use(passport.session());

// TODO: change this to only use the javascript it outputs
app.use(express.static(path.join(__dirname, 'ui')));

// pages without authentication
app.use('/auth', auth);
// authenticate
/*
app.all('*',function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        next(new Error(401)); // 401 Not Authorized
    }
});
*/

//pages where autentication is needed
app.use('/', routes);
app.use('/users', users);
app.use('/print', print);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
