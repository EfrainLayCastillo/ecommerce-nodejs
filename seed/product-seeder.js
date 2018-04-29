var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test', function (err) {
    if (err) return console.log(err);
});

var products =[
    new Product({
        imagePath: 'https://cdn.shopify.com/s/files/1/2313/5135/products/Extra_Thicc_ALT_2000x.png?v=1511317503',
        title: 'Thicc Body',
        description: 'Just for thicc people',
        price: 10,
        model: 'T-shirt'
    }),
    new Product({
        imagePath: 'https://cdn.shopify.com/s/files/1/1310/3983/products/BAD-SEED---T-SHIRT_2048x2048.png?v=1480347032',
        title: 'EXTRA TICC',
        description: 'Just for thicc people',
        price: 25,
        model: 'T-shirt'
    }),
    new Product({
        imagePath: 'https://mms-cloudfront.customink.com/mms/images/catalog/99af4637877c2698d1b5f8faefa4751a/colors/169900/views/alt/front_large_extended.png?ixlib=rails-2.1.4&w=412&h=470&fit=crop&dpr=1&bg=ffffff&fm=pjpg&q=39&auto=compress',
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
