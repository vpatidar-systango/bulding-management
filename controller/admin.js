var User = require('../models/user');

module.exports = {
    /**
     * Method:renderaddUserPage
     * @param:(Object)res,res
     * task:render add User page
     */
    renderaddUserPage: function (req, res) {
        res.render('addUser', { user: req.user, LoginError: req.flash('LoginError'), PassError: req.flash('PassError') });
    },
    /**
     * Method:seeAll
     * @param:(Object)res,res
     * task:find All User from Model and Render to the Page
     */
    seeAll: async function (req, res) {
        let users = await User.find({ role: "User" });
        res.render('seeAllUser', { title: "View All", users: users })
    },
    /**
     * Method:AdminProfile
     * @param:(Object)res,res
     * task:get the current user_id from the session,
     *      FIND THE DISTINCT Admin FROM BY THEIR _ID
     *      render to the profile Page
     */
    AdminProfile: async function (req, res) {
        try{
            var _id = req._passport.session.user;
            var user = await User.findOne({ _id: _id });
            console.log(user);
            res.render('Profile', { user: user });
        }catch(error){
            console.log(error);
        }
      
    },
    /**
     * Method:updateProfile
     * @param:(Object)res,res
     * task:get the current user_id from the session,
     *      FIND THE DISTINCT USER FROM BY THEIR _ID
     *      update the username,last name,email of the Admin
     *      render to the profile Page with the succcess msg
     */
    updateAProfile: async function (req, res) {
        try{
        var _id = req._passport.session.user;
        var user = await User.findOne({ _id: _id });
        user.username = req.body.username;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        if (user) {
            await User.findOneAndUpdate({ _id: _id }, user);
        }
        /// console.log(user);
        // console.log("updated Sucessfully");
        var msg = "You Profile is updated Sucessfully"
        res.render('Profile', { user: user, msg: msg });
    }catch(error){
        console.log(error);
    }
    },
    /**
     * Method:deleteUser
     * @param:(Object)res,res
     * task:get the current user_id from the session,
     *      FIND And delete THE DISTINCT USER FROM database
     *      redirect to All UserPAge
     */
    deleteUser: async function (req, res) {
        try{        
        var _id = req.params.id;
        // console.log(_id);
        var user = await User.findByIdAndRemove({ _id: _id });
        if (user.error) {
            console.log(error);
        } else {
            console.log("Your User Deleted Successfully")
            res.redirect('/admin.AllUser')
        }
    }catch(error){
        console.log(error);
    }
    },
     /**
     * Method:renderReInviteUserPage
     * @param:(Object)res,res
     * task: render ReInvite Page & check
     * 1:if user is InActive send user details to page
     * 2:if user is Active disable the textfilled and show erroe msg
     */
    renderReInviteUserPage: async function (req, res) {
        try{
        var id = req.params.id;
        var user = await User.findById(id);
        if (user.status == "InActive") {
            var email = user.email;
            var username = user.username;
            res.render('ReInviteUser', { user: req.user, email: email, username: username });
        } else {
            console.log("Admin is Activated Tempararily you are not reInvite");
            var work = "disabled"
            var msg = "This is Active User So, He is not ReInvite"
            res.render('ReInviteUser', { work: work, msg: msg });
        }
    }catch(error){
        console.log(error);
    }
    },
     /**
     * Method:renderBuildingDetails
     * @param:(Object)res,res
     * task: render Building details
     */
        renderBuildingDetails: function (req, res) {
        res.render('buildingdetails', { user: req.user, LoginError: req.flash('LoginError'), PassError: req.flash('PassError') });
    },
}