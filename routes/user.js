var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var csrfProtect = csrf();

//model data
var Order = require('../models/order');
var Cart = require('../models/cart');

router.use(csrfProtect);

/* GET users listing. */
/*filter that have from router is only when is login*/
router.get('/profile', isLoggedIn, function (req, res, next) {
  Order.find({user: req.user}, function(err, order){
    if(err){
      return res.send(err);
    }
    var cart;
    order.forEach(order => {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', {orders: order});

  });
});
router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});

/*this router filter when is not log in*/
router.use('/', notLoggedIn);

router.get('/signup', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.oldUrl) {
    var Url = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(Url);
  } else {
    res.redirect('/user/profile');
  }
});

router.get('/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next){
  if(req.session.oldUrl){
    var Url = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(Url);
  }else{
    res.redirect('/user/signup');
  }
});


module.exports = router;

function isLoggedIn(req, res, next){
  req.app.locals.layout = 'main';
  if(req.isAuthenticated()){
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