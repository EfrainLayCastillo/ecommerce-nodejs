var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt-nodejs');


var adminSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    nickname: {type: String, required: true},
    range: {type: Number, default: 0 }
});

adminSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

adminSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('Admin', adminSchema);