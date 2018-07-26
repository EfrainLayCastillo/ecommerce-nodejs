var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test', function (err) {
    if (err) return console.log(err);
});

var products =[
    new Product({
        imagePath: 'http://via.placeholder.com/1024x576?placeholder=Dummy',
        title: 'Thicc Body',
        description: 'Just for thicc people',
        price: 10,
        model: 'T-shirt'
    }),
    new Product({
        imagePath: 'http://via.placeholder.com/1024x576?placeholder=Dummy',
        title: 'EXTRA TICC',
        description: 'Just for thicc people',
        price: 25,
        model: 'T-shirt'
    }),
    new Product({
        imagePath: 'http://via.placeholder.com/1024x576?placeholder=Dummy',
        title: 'Simple like this',
        description: 'Just for thicc people',
        price: 19,
        model: 'T-shirt'
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result){
        done++;
        if( done === products.length){
            exit();
        }
    });

}
function exit(){
    mongoose.disconnect(function (err) {
        if (err) return console.log(err);
    })
}
