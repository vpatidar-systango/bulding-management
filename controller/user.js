var User = require("../models/user");

module.exports = {
    /**
    * Method:updateProfile
    * @param:(Object)res,res
    * task:get the current user_id from the session,
    *      FIND THE DISTINCT USER FROM BY THEIR _ID
    *      update the username,last name,email of the Admin
    *      render to the profile Page with the succcess msg
    */
    updateUProfile: async function (req, res) {
        try{
        var _id = req._passport.session.user;

        var user = await User.findOne({ _id: _id });
        user.username = req.body.username;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        if (user) {
            var uuser = await User.findOneAndUpdate({ _id: _id }, user);
        }
        if (uuser.error) {
            console.log(error);
        } else {
            console.log(uuser + "======== this");
            console.log("updated Sucessfully");
            var msg = "You Profile is updated Sucessfully"
            res.render('UProfile', { user: user, msg: msg });
        }
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
        console.log(_id);
        var user = await User.findByIdAndRemove({ _id: _id });
        if (user.error) {
            console.log(error);
        } else {
            console.log("Your Admin Deleted Successfully")
            res.redirect('/seeAllUser');
        }
    }catch(error){
            console.log(error);
          }
    },
    /**
         * Method:UserProfile
         * @param:(Object)res,res
         * task:get the current user_id from the session,
         *      FIND THE DISTINCT USER FROM BY THEIR _ID
         *      render to the profile Page
         */
    UserProfile: async function (req, res) {
        try{
        var _id = req._passport.session.user;
        var user = await User.findOne({ _id: _id });
        console.log(user);
        res.render('UProfile', { user: user });
    }catch(error){
        console.log(error);
      }
    },
}
