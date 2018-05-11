var inviteUser = require('../controller/inviteUser');
var User = require('../models/user');
var inviteAdmin = require('../controller/inviteAdmin');

//-----------------------------Req/res  Functions ---------------------
module.exports = {
    /**
     * Methode:REnderSignupPage
     * task:Render SignUp Page 
     */
    renderSignUpPage: function (req, res) {
        res.render('signup', { user: req.user, msgError: req.flash('msgError'), LoginError: req.flash('LoginError'), PassError: req.flash('PassError') });
    },
    /**
     * Methode:REnderSignupPage
     * task:Diffrentiates the user(tenant/Admin/superadmin); 
     * case1:if user is InActive then render to the signup
     * case2:if role is User then render Welcome Page
     * case3:if role is Admin then render addUser Page
     * case4:if role is SuperAdmin then render addAdmin Page
     * case2:if Building details are not filled by Admin(only) then if render building details form
     */
    rederwelcomePage: async function (req, res) {
        try{
        var id = req._passport.session.user;
       // console.log(id);
        var user = await User.findById(id);
        if (user.status == "Active") {

            if (user.role == 'User') {
                console.log(user.role);
                res.render('welcome', { user: req.user, Error: req.flash('PassError'), PassError: req.flash('PassError'), msgError: req.flash('msgError') });
            }
            if (user.role == 'Admin') {
                //console.log(user.role);
                //console.log(user.buildingdetails);
                if (user.buildingdetails == 'Notfilled') {
                    res.render('buildingdetails');
                } else {
                    res.render('addUser', { user: req.user, PassError: req.flash('PassError'), msgError: req.flash('msgError') });
                }
            }
            if (user.role == 'superAdmin') {
                console.log(user.role);
                res.render('addAdmin', { user: req.user, PassError: req.flash('PassError'), msgError: req.flash('msgError') });
            }
        } else {
            console.log("you are not Activated :")
            res.redirect('/signup');

        }
    }catch(error){
            console.log(error);
          }
    },
    /**
     * methode:renderCPassword
     * @param:(Object)req,res
     * Render change Password
     */
    renderCPassword: function (req, res) {
        res.render('changePassword');
    },
     /**
     * methode:sessionLogout
     * @param:(Object)req,res
     * task:Logout the current session of user
     */
    sessionLogout: function (req, res) {
        req.logout();
        res.render('signup');
    },
     /**
     * methode:status change
     * @param:req,res,next
     *  task:ifuser is InActive 
     */
    statusChange: async function (req, res, next) {
        try {
          var id = req.body.user_id,
            status = req.body.user_status;
         // console.log(id + "   " + status);
          let newStatus;
          if (status == 'InActive') {
            console.log("Status Change will Activated");
            newStatus = 'Active';
          } else {
            newStatus = 'InActive'
            console.log("Status Change will InActivated");
    
          }
          var result = await User.findByIdAndUpdate(id, { status: newStatus });
          if (result) {
            console("Status change SuccessFully");
          } else {
            throw err
          }
    
        }catch(err){
          res.send(err.message)
        }       
    },
    /**
     * methode:changePassword
     * task:get the current session id & update to the new password by its user
     */
      changePassword: async function (req, res) {
          try{
        var id = req._passport.session.user;
        var user = await User.findById(id);
        user.password = user.encryptPassword(req.body.password);
        var newpassword = user.password;
        console.log(newpassword);

        var pass = await User.findByIdAndUpdate(id, { password: newpassword });
        console.log(pass);
        if (pass.error) {
            console.log(pass.error);
        } else {
            console.log("changePassword successfully");
            var msg = "Your Password Hass Been Change SucessFully";
            res.render('changePassword', { msg: msg });
        }
    }catch(error){
        console.log(error);
      }
    },
}
