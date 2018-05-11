
var User = require('../models/user');
var inviteAdmin = require('../controller/inviteAdmin');

module.exports = {
    /**
     * Method:renderaddAdminPage
     * @param:(Object)res,res
     * task:render add Admin page
     */
    renderaddAdmin: function (req, res) {
        res.render('addAdmin', { user: req.user, LoginError: req.flash('LoginError'), PassError: req.flash('PassError') });
    },
       /**
         * Method:deleteAdmin
         * @param:(Object)res,res
         * task:get the current admin_id from the session,
         *      FIND And delete THE DISTINCT Admin FROM database
         *      redirect to All AllAdmin page
         */
    deleteAdmin: async function (req, res) {
        var _id = req.params.id;
        console.log(_id);
        var user = await User.findByIdAndRemove({ _id: _id });
        if (user.error) {
            console.log(error);
        } else {
            console.log("Your Admin Deleted Successfully")
            res.render('AllAdmin');
        }
    },
    /**
     * Method:updateSProfile
     * @param:(Object)res,res
     * task:get the current admin_id from the session,
     *      FIND THE DISTINCT admin FROM BY THEIR _ID
     *      update the username,last name,email of the SuperAdmin
     *      render to the Sprofile Page with the succcess msg
     */
    updateSProfile: async function (req, res) {
        var _id = req._passport.session.user;

        var user = await User.findOne({ _id: _id });
        user.username = req.body.username;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        if (user) {
            await User.findOneAndUpdate({ _id: _id }, user);
        }
        //console.log(user);
        console.log("updated Sucessfully");
        var msg = "You Profile is updated Sucessfully"
        res.render('SProfile', { user: user, msg: msg });
    },
    /**
   * Method:AllAdmin
   * @param:(Object)res,res
   * task:find All User from Model and Render to the AllAdmin Page
   */
    AllAdmin: async function (req, res) {
        // let users = await inviteAdmin.AllAdmin();
        let users = await User.find({ role: "Admin" });
        //console.log(users);
        res.render('AllAdmin', { users: users })
    },
    /**
     * Method:SuperAdminProfile
     * @param:(Object)res,res
     * task:get the current user_id from the session,
     *      FIND THE DISTINCT USER FROM BY THEIR _ID
     *      render to the Sprofile Page
     */
    SProfile: async function (req, res) {
        var _id = req._passport.session.user;
        var user = await User.findOne({ _id: _id });
        // console.log(user);
        res.render('SProfile', { user: user });
    },
    /**
     * Method:renderReInviteAdminPage
     * @param:(Object)res,res
     * task: render ReInvite Page & check
     * 1:if user is InActive send user details to page
     * 2:if user is Active disable the textfilled and show erroe msg
     */
    renderReInviteAdminPage: async function (req, res) {
        var id = req.params.id;
        var user = await User.findById(id);
        if (user.status == "InActive") {
            var email = user.email;
            var username = user.username;
            res.render('ReInviteAdmin', { user: req.user, email: email, username: username });
        } else {
            console.log("Admin is Activated Tempararily you are not reInvite");
            var work = "disabled"
            var msg = "This is Active User So, He is not ReInvite"
            res.render('ReInviteAdmin', { work: work, msg: msg });

        }
    },

}


