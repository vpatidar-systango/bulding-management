var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middlewares/middleware.js')
var controller = require("../controller/req&res controller");
var inviteAdminController = require("../controller/inviteAdmin");
var superAdmincontroller=require('../controller/superAdmin');
var middleware = require('../middlewares/middleware.js')


/**
 * SuperAdmin will be able to Invite Admin:
 * (get)Render the form,(post)sends the mail-link and fill details in db
 */
router.get('/superAdmin.inviteAdmin',middleware.isLoggedIn,middleware.checkSuperAdmin,superAdmincontroller.renderaddAdmin);//Router for Logout Button
router.post('/superAdmin.inviteAdmin',inviteAdminController.inviteAdmin);//sending mail for inviting people
/*get Request from mail-link
 */
router.get('/superAdmin.inviteAdminLink/:token',inviteAdminController.InviteAdminGet);//link token of invited people and render invited link
/**
 * Render SignUpPage,And filled  the details in db At the time of invitation
 */
router.get('/superAdmin.AdminSignup',inviteAdminController.renderinvitedAdminSignup);// Render signup form for user 
router.post('/superAdmin.AdminSignup',inviteAdminController.invitedAdminSignup);

// router.post('/signup',passport.authenticate('local.adminsignup', {
//     successRedirect: '/admin.buildingdetails',
//     failureRedirect: '/welcome',
//     failureFlash: true,
// }));

/**
 * See List Of All Users Whose role is Admin
 */
router.get('/superAdmin.AllAdmin',middleware.checkSuperAdmin,middleware.isLoggedIn,superAdmincontroller.AllAdmin);
/**
 * Render the ReInvite Page with already filled data
 *ReInvite the Admin whose is NotActive Onwards 
 */
router.get('/superAdmin.ReInviteAdmin/:id', superAdmincontroller.renderReInviteAdminPage);
router.post('/superAdmin.ReInviteAdmin',inviteAdminController.ReInviteAdmin);
/**
 * Shows superAdminProfile
 * And Updates in the Post Request
 */
router.get('/superAdmin.SProfile',superAdmincontroller.SProfile);
router.post('/superAdmin.updateSProfile', superAdmincontroller.updateSProfile);
/**
 * Delete the User from the OverAll Db
 */
router.get('/superAdmin.deleteAdmin/:id', superAdmincontroller.deleteAdmin);

module.exports = router;
