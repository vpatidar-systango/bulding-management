var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middlewares/middleware.js')
var controller = require("../controller/req&res controller")
var usercontroller=require('../controller/user');
/**
 * Render the SingnUp Page
 */
router.get('/signup', controller.renderSignUpPage);// Router for Signup Page 
/**
 * Render the Welcome Page
 * Differentiates the User (user/Admin/SuperAdmin)By their role in presents in the Model
 */
router.get('/welcome', middleware.isLoggedIn, controller.rederwelcomePage);// Router for Welcome Page 
/**
 * Shows UserProfile
 * And Updates in the Post Request
 */
router.get('/user.Profile', middleware.isLoggedIn,middleware.checkUser,usercontroller.UserProfile);
router.post('/user.updateProfile', usercontroller.updateUProfile);


//-------------------passport local SignUp Authentication----------
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/welcome',
    failureRedirect: '/signup',
    failureFlash: true,
}))
//-------------------passport local Login Authentication----------
router.post('/login', passport.authenticate('local.login',{
    successRedirect: '/welcome',
    failureRedirect: '/signup',
    failureFlash: true,
}));
/**
 * These are the common Router commonly Used by All User in All Page 
 */
router.get('/logout', controller.sessionLogout);//Router for Logout Button
router.post('/checkToggle', controller.statusChange);
router.get('/changePassword',middleware.isLoggedIn, controller.renderCPassword);
router.post('/changePassword',controller.changePassword);

module.exports = router;

