var passport = require('passport');
var LocalStrategy = require('passport-local');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../models/user');
var passportconfig = require('../config/passportconfig');


// ---------------------Facebook Login Strategy----------------------
passport.use(new FacebookStrategy({
    clientID: passportconfig.facebookAuth.clientID,
    clientSecret: passportconfig.facebookAuth.clientSecret,
    callbackURL: passportconfig.facebookAuth.callbackURL,
}, function (token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(async function () {

        // find the user in the database based on their facebook id
        var user = await User.findOne({ 'facebook_id': profile.id })

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
       
        // if the user is found, then log them in
        if (user) {
            return done(null, user); // user found, return that user
        } else {
            console.log(profile)
            // if there is no user found with that facebook id, create them
            var newUser = new User();

            // set all of the facebook information in our user model
            newUser.facebook_id = profile.id; // set the users facebook id                   
            newUser.facebook_token = token; // we will save the token that facebook provides to the user                    
            newUser.facebook_name = profile.displayName; // look at the passport user profile to see how names are returned
            // newUser.facebook_email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
            newUser.provider = profile.provider;
            // save our user to the database
            newUser.save(function (err) {
                if (err){
                    throw err;
                    return done(err);

                }

                // if successful, return the new user
                return done(null, newUser);
            });
        }
    });
}));


//------------------Google  Authentication Strategy----------------
passport.use(new GoogleStrategy({
    clientID: passportconfig.googleAuth.clientID,
    clientSecret: passportconfig.googleAuth.clientSecret,
    callbackURL: passportconfig.googleAuth.callbackURL,

}, function (token, refreshToken, profile, done) {
    // console.log(profile)
    process.nextTick(async function () {
        var user = await User.findOne({ 'google_id': profile.id })
            if (user) {
            console.log("user " + user)
            return done(null, user);
        } else {
            console.log("new user")

            // if the user isnt in our database, create a new user
            var newUser = new User();

            // set all of the relevant information
            newUser.google_id = profile.id;
            newUser.google_token = token;
            newUser.google_name = profile.displayName;
            //  newUser.google_email = profile.emails[0].value; // pull the first email
            newUser.provider = profile.provider;
            // save the user
            newUser.save(function (err) {
                if (err) {
                    console.log("save err " + err);
                    throw err;
                    return done(err);
                }
                return done(null, newUser);
            });
        }
    });

}));

