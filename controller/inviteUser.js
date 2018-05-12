var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('../models/user');
var Building = require('../models/building');

var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var mailconfig = require('../config/mailconfig');


module.exports = {
  /**
       * Method:inviteUser
       * @param:(Object)res,res,next
       * task:generating rendom Token of 32bytes,
       *      save general deatils(getting from the form) of user in the Db,which will Invited
       *      FIND THE DISTINCT user FROM BY THEIR _ID
       *      sends the Email to distinct Address comes from Form
       *      render to the same Page
       */
  inviteUser: async function (req, res, next) {
    try{
    // * Generating Token  */
    let token = crypto.randomBytes(32).toString('hex');
    //console.log(token);
    var body = req.body;
    var Adminid=req._passport.session.user;
    console.log("Admin Id ="+Adminid);

    var building=await Building.find({Adminid:Adminid});
   // console.log(building);
    //console.log("building Id"+building);
    //console.log(building.buildingname);

    

    var user = await User.findOne({ email: req.body.email })
    /**
         * creating New User
         */
    var user = new User();
    user.inviteToken = token;//save the token in the new Admin db
    user.inviteTokenExpires = Date.now() + 3600000; // 1 hour
    user.requestsend = "Notaccept";
    user.username = req.body.username;
    user.status = "InActive";
    user.email = req.body.email;
    user.role = "User";
    user.buildingName=[building];
    

    /** creating a source of transport with the hel of node mailer function
         * set service as a gmail & username password
        */
    user.save(function (err) {
      console.log(user.buildingname);

    });

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
      subject: process.env.inviteUserSubject,
      text: process.env.inviteUserHeader +
        'https://' + req.headers.host + '/admin.inviteUserLink/' + token + '\n\n' +
        process.env.inviteUserfooter
    };
    //Sends the mail by using this method:    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.render('addUser');
        console.log('Email sent: ' + info.response);

      }
    });
  }catch(error){
    console.log(error);
  }
  },//end function
  /**
 * Method:inviteGet
 * @param:(Object)res,res
 * task:Match Up the token from the Admin db and req parameter ,
 *     If token dos'nt match then send to the signup page
 *     otherwise render to the next page
 */
  InviteGet: async function (req, res) {
    try{
    var user = await User.findOne({ inviteToken: req.params.token, inviteTokenExpires: { $gt: Date.now() } })

    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      console.log("token match nhi hua hai");
      return res.redirect('/forgot');
    }
    user.inviteRequest = true;
    user.save();
    console.log("token match hoo gaya hai");

    res.render('inviteLink', {
      user: req.user,
      token: req.params.token,
    });
  }catch(error){
      console.log(error);
    }
  },
  /**
   *  Render Admin SignUp Page
   */
    renderinvitedUserSignup: function (req, res) {
    res.render('userSignup');
     
  },
/**
       * Method:inviteUserSignup
       * @param:(Object)res,res,next
       * task:get the all entries from the signup page,compare to the existing db
       *      and updates All of the details of the new Admin which has get invitation
       *      (at their email address) 
       *         */
      invitedSignup: async function (req, res, next) {
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
    user.status = "Active";
    user.role = "User";
    user.requestsend = "accept";
    user.password = user.encryptPassword(req.body.password);
    //console.log(user._id);
    await User.findByIdAndUpdate(user._id, user);

    res.render('welcome');
    //console.log("ye thisssssss");
    return (null, user);
  }catch(error){
    console.log(error);
  }
  },
/**
       * Method:ReInviteUser
       * @param:(Object)res,res,next
       * task:generating rendom Token of 32bytes,
       *      Find user By their Id come from the router side 
       *      save general deatils(getting from the form) of user in the Db,which will Invited
       *      FIND THE DISTINCT User FROM BY THEIR _ID
       *      sends the Email to distinct Address comes from Form
       *      render to the same Page
       */
  ReInviteUser: async function (req, res, next) {
   
   try{ /**
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
    user.role = "User";
        console.log(user._id);
    await User.findOneAndUpdate(user._id, user);

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.sender,
        pass: process.env.pass
      }
    });
    const inviteToken = token;
    var mailOptions = {
      from: process.env.sender,
      to: body.email,
      subject: process.env.inviteUserSubject,
      text: process.env.inviteUserHeader +
        'https://' + req.headers.host + '/inviteLink/' + token + '\n\n' +
        process.env.inviteUserfooter
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.redirect('/ReInviteUser');
      }
    })
  }catch(error){
      console.log(error);
    }
  }

}


//------------------------------------------
