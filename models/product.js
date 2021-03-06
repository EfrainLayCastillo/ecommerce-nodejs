var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bones = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: { type: String, required: true },
    price: {type: Number, required: true},
    model: {type: String, required: true}
});

module.exports = mongoose.model('Product', bones);
