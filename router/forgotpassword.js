var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var controller=require('../controller/forgotPassword');

/**
 *Router for  forgot password get  from Login Page 
 */
router.get('/forgot',controller.forgotGet);//Router for forgotButton
/**
 * forgot password Post Request
 */
router.post('/forgot',controller.forgotPost);
/**
 * Reset password get Request comes from gmail token link
 */
router.get('/reset/:token',controller.resetGet);
/**
 * Successfull password change email verification link
 */
router.post('/reset',controller.resetPost);

module.exports = router;
