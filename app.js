var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var index = require('./routes/index');
var user = require('./routes/user');
var admin = require('./routes/admin');
//view engine
var hbs = require('express-handlebars');
//session user
var session = require('express-session');
//session conect
var MongoStore = require('connect-mongo')(session);
//passport
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');

//db
var mongoose = require('mongoose');


var app = express();

mongoose.connect('mongodb://localhost:27017/test', function(err){
  if(err) return console.log(err);
});
require('./config/passport');

// view engine setup
app.engine('hbs', hbs(
  {extname: 'hbs', defaultLayout: 'main',
   partialsDir:__dirname + '/views/partials',
   layoutsDir: __dirname + '/views/layouts'})
  );

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'admin' });


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
//session init
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {
    maxAge: 180 * 60 * 1000
  }
}));
//flash init
app.use(flash());
//passport init
app.use(passport.initialize());
app.use(passport.session());

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
/* global variable to use in routes or from the views*/
app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  console.log(res.session);
  console.log(req.isAuthenticated());
  res.locals.session = req.session;
  next();
});

app.use('/user', user);
app.use('/admin', admin);
app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
