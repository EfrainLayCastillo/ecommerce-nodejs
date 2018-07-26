var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var csrfProtect = csrf();


router.use(csrfProtect);


//Admin User
var Admin = require('../models/admin');
//Product Model mongodb
var Product = require('../models/product');

/*router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'admin'; // set your layout here
    next(); // pass control to the next handler
    });*/

router.get('/', isLoggedIn,  function(req, res, next){
  res.render('dashboard/index');
});
router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.route('/upload', isLoggedIn)
      .get(function(req, res){
        res.render('dashboard/upload');
      })
      .post(function(req, res){

        var data = {
          title: req.body.title,
          price: req.body.price,
          description: req.body.description,
          model: req.body.model,
          imagePath: req.body.imagePath
        };
        console.log(JSON.stringify(data));
        var merch = new Product(data);

        merch.save(function(err){
          if (!err) {
            res.redirect('/admin');
          }else {
            console.log(err);
            res.render(String(err));
          }
        });


      });


router.use('/', notLoggedIn);

router.get('/signup', function (req, res, next) {
  var messages = req.flash('error');
  res.render('admin/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.adminSignup', {
  failureRedirect: '/admin/signup',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.oldUrl) {
    var Url = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(Url);
  } else {
    res.redirect('/admin/signin'); //admin profile
  }
});

router.get('/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('admin/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local.adminSignin', {
  failureRedirect: '/admin/signin',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.oldUrl) {
    var Url = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect('/admin');
  } else {
    res.redirect('/admin');
  }
});



module.exports = router;

function isLoggedIn(req, res, next) {
  req.app.locals.layout = 'admin';
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
function notLoggedIn(req, res, next) {
  req.app.locals.layout = 'main';
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}