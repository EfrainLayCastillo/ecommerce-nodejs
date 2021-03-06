var passport = require('passport');
var User = require('../models/user');
var Admin = require('../models/admin');
var LocalStrategy  = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null, user.id);
});
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});


// User Sign up strategy
passport.use('local.signup', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function(err, user){
        if (err) {
            return done(err);
        }
        if (user){         
            return done(null, false, {message: 'El correo ya esta utilizado'});
        }

        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if(err){
                return done(err);
            }
            console.log("paso bien");
            
            return done(null, newUser);
        });

    });
}));
//User Sign in Strategy
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Not found user' });
        }
        if(!user.validPassword(password)){
            return done(null, false, { message: 'Wrong password' });
        }
        if(!err){
            return done(null, user);
        }
        Admin.findOne({ 'email': email }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Not found user' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Wrong password' });
            }
            return done(null, user);

        });

    });

}));

//Admin Sign up Strategy
passport.use('local.adminSignup', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    Admin.findOne({'email': email}, function(err, user){
        if (err) {
            return done(err);
        }
        if (user){         
            return done(null, false, {message: 'El correo ya esta utilizado'});
        }

        var newUser = new Admin();
        newUser.email = email;
        newUser.nickname = req.body.nickname;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if(err){
                return done(err);
            }
            console.log("paso bien");
            
            return done(null, newUser);
        });

    });
}));
//Admin Signin Strategy
passport.use('local.adminSignin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    Admin.findOne({ 'email': email }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Not found user' });
        }
        if(!user.validPassword(password)){
            return done(null, false, { message: 'Wrong password' });
        }
        if(!err){
            return done(null, user);
        }
        Admin.findOne({ 'email': email }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Not found user' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Wrong password' });
            }
            return done(null, user);

        });

    });

}));