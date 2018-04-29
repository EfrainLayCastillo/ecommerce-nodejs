var express = require('express');
var router = express.Router();

//Product Model mongodb
var Product = require('../models/product');

router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'admin'; // set your layout here
    next(); // pass control to the next handler
    });



router.get('/', function(req, res, next){
  res.render('admin/index');
});

router.route('/upload')
      .get(function(req, res){
        res.render('admin/upload');
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


module.exports = router;
