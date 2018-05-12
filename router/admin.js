var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middlewares/middleware.js')
var controller = require("../controller/req&res controller");
var usercontroller=require("../controller/user");
var admincontroller=require("../controller/admin")
var inviteUser = require("../controller/inviteUser");
var inviteAdmin = require("../controller/inviteAdmin");
var buildingcontroller=require("../controller/building");
/**
 * SuperAdmin will be able to Invite User:
 * (get)Render the form,(post)sends the mail-link and fill details in db
 */
router.get('/admin.inviteUser', middleware.checkAdmin,admincontroller.renderaddUserPage);//Router for Logout Button
router.post('/admin.inviteUser', inviteUser.inviteUser);//sending mail for inviting people
/*get Request from mail-link
 */
router.get('/admin.inviteUserLink/:token', inviteUser.InviteGet);//link token of invited people and render invited link
/**
 * Render SignUpPage,And filled  the details in db Only at the time of Invitation
 */
router.get('/admin.UserSignup', inviteUser.renderinvitedUserSignup); 
router.post('/admin.usersignup', inviteUser.invitedSignup);
/**
 * See List Of All Users Whose role is Admin
 */
router.get('/admin.AllUser',middleware.isLoggedIn,middleware.checkAdmin,admincontroller.seeAll);
/**
 * Shows superAdminProfile
 * And Updates in the Post Request
 */
router.get('/admin.AdminProfile', middleware.isLoggedIn,middleware.checkAdmin,admincontroller.AdminProfile);
router.post('/admin.updateProfile', admincontroller.updateAProfile);
/**
 * Shows/fillup the Building details
 * And Updates in the Post Request
 */
router.get('/admin.buildingdetails',middleware.isLoggedIn, admincontroller.renderBuildingDetails);
router.post('/admin.buildingdetails', buildingcontroller.buildingdetails);
/**
 * Render the ReInvite Page with already filled data
 *ReInvite the Admin whose is NotActive Onwards 
 */
router.get('/admin.ReInviteUser/:id', admincontroller.renderReInviteUserPage);
router.post('/admin.ReInviteUser',inviteUser.ReInviteUser);
/**
 * Delete the User from the OverAll Db
 */
router.get('/admin.deleteUser/:id', admincontroller.deleteUser);

module.exports = router;
