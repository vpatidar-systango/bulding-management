var User = require('../models/user');

module.exports = {
    /**
     * middleware:isLoggedIn
     * @param:(Object req, object res,function next()) 
     * task:check user in an LoggedIn Condition or not ,if loggedIn then process next()
     *      if not then render to signup
     */
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        };
        res.redirect('/signup')
    },
    /**
     * middleware:checkSuperAdmin
     * @param:(Object req, object res,function next()) 
     * task:check user's role as a SuperAdmin By the session Id ,if superAdmin then process next()
     *      if not then render to signup
     */
    checkSuperAdmin: async function (req, res, next) {
        try {
            var id = req._passport.session.user;
            var superAdmin = await User.findById(id);
           // console.log(superAdmin.role);
            if (superAdmin.role == "superAdmin") {
                return next();
            } else {
                console.log("Middleware Error");
                res.redirect('/signup')
            }
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * middleware:checkAdmin
     * @param:(Object req, object res,function next()) 
     * task:check user's role as a Admin ,if superAdmin then process next()
     *      if not then render to signup
     */
    checkAdmin: async function (req, res, next) {
        try {
            var id = req._passport.session.user;
            var admin = await User.findById(id);
           // console.log(admin.id)
;            console.log(admin.role);
            if (admin.role == "Admin") {
                return next();
            } else {
                console.log("Middleware Error Admin");
                res.redirect('/signup')
            }
        } catch (error) {
            console.log(error);
        }
    },
/**
     * middleware:checkSuperAdmin
     * @param:(Object req, object res,function next()) 
     * task:check user's role as a User By the session Id ,if User then process next()
     *      if not then render to signup
     */
    checkUser: async function (req, res, next) {
        var id = req._passport.session.user;
        var user = await User.findById(id);
        console.log(user.role);
        if (user.role == "User") {
            return next();
        } else {
            console.log("Middleware Error User");
            res.redirect('/signup')

        }
    }




}

