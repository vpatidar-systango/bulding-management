var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('../models/user');
var passportconfig = require('../config/passportconfig');


//------------------passport Serialization/deserialization--------
passport.serializeUser(function (user, done) {
    done(null, user.id)
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (error, user) {
        done(error, user);
    })
});

/**
 *Local Strategy Of Passport For SignUp/Creating User
 */
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordfeild: 'password',
    passReqToCallback: true,
}, async function (req, username, password, done) {
    let body = req.body;
   // console.log("hii");
    var user = await User.findOne({ 'username': username })
    if (user) {
        req.flash('MsgError', 'user already exist');
        return (done, false)
    }
    var newUser = new User();
    newUser.username = req.body.username;
    newUser.lastname = req.body.lname;
    newUser.email = req.body.email;
    newUser.role = "User";
    newUser.password = newUser.encryptPassword(req.body.password);

    console.log(newUser);
    newUser.save(function (error) {
        if (error) {
            return done(error);
        }
        return done(null, newUser);
    })
})
);
/**
 *Local Strategy Of Passport For Login User
 */
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordfeild: 'password',
    passReqToCallback: true,
}, async function (req, email, password, done, res) {
    let body = req.body;
    try {
        if (body.email && body.password) {
            var user = await User.findOne({ 'email': email })

            if (!user) {
                req.flash('LoginError', 'username is not found');
                return done(null, false);
            }

            if (!user.validPassword(req.body.password)) {
                req.flash('PassError', 'password is not correct');
                return done(null, false);
            }
            console.log("user-------")
            if (user.status == 'InActive') {
                console.log(user.status);
                req.flash('msgError', 'You are Temperarily DeActivated by Admin');
                return done(null, false);
            }
            if (user) {
                console.log("your user role is :" + user.role);
                // res.redirect('/addUser');
                return done(null, user, user.role);
            }
        } else {
            return res.send("fill all fields");
        }
    } catch (error) {
        console.log(error);
        return done(error);
    }
}));
//-------------------------------------------------------------------------------------
/**
 *Local Strategy Of Passport For SignUp/Creating User
 */
passport.use('local.adminsignup', new LocalStrategy({
    usernameField: 'username',
    passwordfeild: 'password',
    passReqToCallback: true,
}, async function (req, username, password, done) {
    let body = req.body;
    console.log("hii");

    var admin = await User.findOne({ 'username': username })
    if (admin) {
        req.flash('MsgError', 'user already exist');
        return (done, false)
    }
    var newadmin = new User();
    newadmin.username = req.body.username;
    newadmin.lastname = req.body.lname;
    newadmin.email = req.body.email;
    newadmin.role = "Admin";
    newadmin.password = newadmin.encryptPassword(req.body.password);

    console.log(newadmin);
    newadmin.save(function (error) {
        if (error) {
            return done(error);
        }
        return done(null, newadmin);
    })
})
);
