var express = require('express');
var router = express.Router();
//module db
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'main'; // set your layout here
    next(); // pass control to the next handler
    });
/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err, data){
    var productChunks = [];
    var chunkSize = 3;
    for(var i = 0; i < data.length; i += chunkSize){
      productChunks.push(data.slice(i, i+chunkSize));
    }
    res.render('shop/index', { title: 'Express', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
  });  
});
router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {});

  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/detail/:id', function(req, res, next){
  var productId = req.params.id;

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    console.log(product);
    res.render('shop/detail',{item: product});
  });

});

router.get('/shopping-cart', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/shopping-cart', {products:null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart',{products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/reduce/:id', function (req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduce(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');

});
router.get('/remove/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeAll(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');

});

router.get('/checkout', isLoggedIn, function(req, res, next){
  if (!req.session.cart) {
    return res.render('shop/shopping-cart');
  }
  var errMsg = req.flash('error')[0];
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout',{total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout',isLoggedIn,function(req, res, next){
  if (!req.session.cart) {
    return res.render('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")(
    "sk_test_KsER2zavPUPDb5LvmGHC3baw"
  );

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charged"
  }, function (err, charge) {
    // asynchronously called
    if(err){
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result){
      req.flash('success', 'successfuly bought product');
      req.session.cart = null;
      res.redirect('/');
    });
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}