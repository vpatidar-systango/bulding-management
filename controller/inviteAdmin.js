var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('../models/user');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var mailconfig = require('../config/mailconfig');
var admin = require('../models/user');

module.exports = {
  /**
       * Method:inviteAdmin
       * @param:(Object)res,res,next
       * task:generating rendom Token of 32bytes,
       *      save general deatils(getting from the form) of Admin in the Db,which will Invited
       *      FIND THE DISTINCT Admin FROM BY THEIR _ID
       *      sends the Email to distinct Address comes from Form
       *      render to the same Page
       */
  inviteAdmin: async function (req, res, next) {
    try{
    /**
     * Generating Token  */
    let token = crypto.randomBytes(32).toString('hex');
    var body = req.body;
    //var user = await User.findOne({ }) //email: req.body.email
    // console.log(token);
    /**
     * creating New User
     */
    var user = new User();
    user.inviteToken = token;//save the token in the new Admin db
    user.inviteTokenExpires = Date.now() + 3600000; // 1 hour
    user.requestsend = "Notaccept";
    user.status = "InActive";
    user.username = req.body.username;
    user.email = req.body.email;
    user.buildingdetails = "Notfilled";
    user.role = "Admin";
    user.save();
    /** creating a source of transport with the hel of node mailer function
     * set service as a gmail & username password
    */
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.sender,
        pass: process.env.pass,
      }
    });
    const inviteToken = token;
    /**
     * set up the MAil body
     */
    var mailOptions = {
      from: process.env.sender,
      to: body.email,
      subject: mailconfig.inviteAdmin.subject,
      text: mailconfig.inviteAdmin.header +
        'https://' + req.headers.host + '/superAdmin.inviteAdminLink/' + token + '\n\n' +
        mailconfig.inviteAdmin.footer
    };
    //Sends the mail by using this method:    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.redirect('/superAdmin.inviteAdmin');//redirect to the next
      }
    });
  }catch(error){
    console.log(error);
}

  },//end function

  /**
 * Method:inviteAdminGet
 * @param:(Object)res,res
 * task:Match Up the token from the Admin db and req parameter ,
 *     If token dos'nt match then send to the signup page
 *     otherwise render to the next page
 */
  InviteAdminGet: async function (req, res) {
    try{
    var user = await User.findOne({ inviteToken: req.params.token, inviteTokenExpires: { $gt: Date.now() } })
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      console.log("token match nhi hua hai");
      return res.redirect('/signup');
    }
    // user.inviteRequest = true;
    // user.save();
    console.log("token match hoo gaya hai");
    res.render('inviteAdmin', {
      user: req.user,
      token: req.params.token,
    });
  }catch(error){
    console.log(error);
}
  },
  /**
   *   // Render Admin SignUp Page
   */
  renderinvitedAdminSignup: function (req, res) {
    // console.log("req. is logout")
    // req.logout();
    res.render('adminSignup');
  },
/**
       * Method:inviteAdminSignup
       * @param:(Object)res,res,next
       * task:get the all entries from the signup page,compare to the existing db
       *      and updates All of the details of the new Admin which has get invitation
       *      (at their email address) 
       *         */

  invitedAdminSignup: async function (req, res, next) {
    try{
    var user = await User.findOne({ email: req.body.email })
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      //console.log(" Not ye thisssssss");
      return res.redirect('back');
    }
    user.username = req.body.username;
    user.lastname = req.body.lname;
    user.email = req.body.email;
    user.requestsend = "accept";
    user.status = "Active";
    user.password = user.encryptPassword(req.body.password);

    await User.findByIdAndUpdate(user._id, user);

    res.redirect('/inviteUser');
   // console.log("ye thisssssss");

    return (null, user);
  }catch(error){
    console.log(error);
}

  },
  /**
       * Method:ReInviteAdmin
       * @param:(Object)res,res,next
       * task:generating rendom Token of 32bytes,
       *      Find Admin By their Id come from the router side 
       *      save general deatils(getting from the form) of Admin in the Db,which will Invited
       *      FIND THE DISTINCT Admin FROM BY THEIR _ID
       *      sends the Email to distinct Address comes from Form
       *      render to the same Page
       */
  ReInviteAdmin: async function (req, res, next) {
    
    try{/**
     * Generating Token  */
    let token = crypto.randomBytes(32).toString('hex');
    var body = req.body;
    var user = await User.findOne({ email: req.body.email }) //email: req.body.email
    console.log(token);
    // var user = new User();
    user.inviteToken = token;
    user.inviteTokenExpires = Date.now() + 3600000; // 1 hour
    user.requestsend = "Notaccept";
    user.username = req.body.username;
    user.email = req.body.email;
    user.status = "InActive";
    user.role = "Admin";
    console.log(user._id);
    await User.findOneAndUpdate(user._id, user);

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: mailconfig.inviteAdmin.sender,
        pass: mailconfig.inviteAdmin.pass,
      }
    });
    const inviteToken = token;
    var mailOptions = {
      from: mailconfig.inviteAdmin.sender,
      to: body.email,
      subject: mailconfig.inviteAdmin.subject,
      text: mailconfig.inviteAdmin.header +
        'https://' + req.headers.host + '/inviteAdminLink/' + token + '\n\n' +
        mailconfig.inviteAdmin.footer
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.redirect('/ReInvite');
      }
    });
  }catch(error){
    console.log(error);
  }
  }//end function


}