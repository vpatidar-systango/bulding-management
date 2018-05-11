var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var mailconfig = require('../config/mailconfig');

module.exports = {
  /**methode:forgotGet
   * @param:Object(req,res);
   * task:Render forgotpassword Page
   */
  forgotGet: function (req, res) {
    res.render('forgotpassword');
  },
  /**methode:forgotGet
  * @param:Object(req,res);
  * task:first generate 20 byte ramdom token in hexa
   * check user by email(correct user or not)
   * Save setresetPassword token & its expiry in user db
   * using create Transport methode of node mailer
   * and send mail on this Transport
   */
  forgotPost: function (req, res, next) {
    async.waterfall([
      function (done) {
        // generate 20 byte ramdom token in hexa
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
          //Save setresetPassword token & its expiry in user db
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },//   * using create Transport methode of node mailer
      function (token, user, done) {
        var Transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: mailconfig.forgotPassword.sender,
            pass: mailconfig.forgotPassword.pass,
          }
        });
        var mailOptions = {
          to: user.email,
          from: mailconfig.forgotPassword.sender,
          subject: mailconfig.forgotPassword, subject,
          text: mailconfig.forgotPassword.header +
            'https://' + req.headers.host + '/reset/' + token + '\n\n' +
            mailconfig.forgotPassword.footer
        };//   * and send mail on this Transport
        Transport.sendMail(mailOptions, function (err) {
          req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function (err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  },
  /**methode:ResetGet
     * @param:Object(req,res);
     * task:match the by resetPassword token and get req param tokon,if not send Back
     * if match then next otherwise not
     */
  resetGet: function (req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {
        user: req.user
      });
    });
  },
  /**methode:resetPost
   * @param:Object(req,res);
   * task:match the by resetPassword token and get req param tokon,if not send Back
   * if user then update its new password
   *  using create Transport methode of node mailer
   * and send success mail on this Transport
   */
  resetPost: function (req, res) {
    async.waterfall([
      function (done) {
        User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        //match the by resetPassword token and get req param tokon,if not send Back
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }

          user.password = user.encryptPassword(req.body.password);;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

//if user then update its new password
          User.findByIdAndUpdate(user._id, { password: user.password }, function (err) {
            req.logIn(user, function (err) {
              done(err, user);
            });
          });

          // console.log(user);


        });
      },
      function (user, done) {
        var Transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: mailconfig.forgotPassword.sender,
            pass: mailconfig.forgotPassword.pass
          }
        });
        var mailOptions = {
          to: user.email,
          from:mailconfig.forgotPassword.sender,
          subject: mailconfig.forgotPassword.subject,
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        //send success mail on this Transport
        Transport.sendMail(mailOptions, function (err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function (err) {
      res.redirect('/signup');
    });
  }
}