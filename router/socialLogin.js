var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middlewares/middleware.js')
var controller = require("../controller/socialLogin")

//----------------------facebook Authentication-------------------
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/welcome',
    failureRedirect: '/signup',
    failureFlash: true,
}));

//----------------------Google Authentication----------------------
router.get('/auth/google', passport.authenticate('google', { scope: "https://www.googleapis.com/auth/plus.login" }));
router.get('/auth/google/callback',passport.authenticate('google', {
        successRedirect: '/welcome',
        failureRedirect: '/signup'
    }));

module.exports = router;