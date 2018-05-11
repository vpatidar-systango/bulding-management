var User = require('../models/user');

module.exports={
    isLoggedIn:function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        };
        res.redirect('/signup')
    },
    
    checkSuperAdmin:async function (req,res,next){
    var id=req._passport.session.user;
    var superAdmin=await User.findById(id);
    console.log(superAdmin.role);
     if(superAdmin.role=="superAdmin"){
         return next();
     }else{
         console.log("Middleware Error");
        res.redirect('/signup')

     }
},
checkAdmin:async function (req,res,next){
    var id=req._passport.session.user;
    var admin=await User.findById(id);
    console.log(admin.role);
     if(admin.role=="Admin"){
         return next();
     }else{
         console.log("Middleware Error Admin");
        res.redirect('/signup')

     }
},

checkUser:async function (req,res,next){
    var id=req._passport.session.user;
    var user=await User.findById(id);
    console.log(user.role);
     if(user.role=="User"){
         return next();
     }else{
         console.log("Middleware Error User");
        res.redirect('/signup')

     }
}



   
}

   