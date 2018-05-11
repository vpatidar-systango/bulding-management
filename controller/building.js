var building = require('../models/building');
var User = require("../models/user");

module.exports = {
/**
     * Method:buildingdetails
     * @param:(Object)res,res
     * task:get the current user_id from the sessionwho is Admin(must),
     *      And set Buildingdetails "filled" in the user Model
     *      
     * */
    buildingdetails: async function (req, res) {
        try{
        let body = req.body;
       // console.log("hii");
        var id = req._passport.session.user;
      //  console.log(id);
        var user = await User.findById(id);
      //  console.log(user.buildingdetails);

        user.buildingdetails = 'filled';
        user.save();
        //console.log(user.buildingdetails);

        var Building = await building.findOne(id);
        if (Building) {
            req.flash('MsgError', 'Building already exist');
          //  console.log(Building);
            console.log("Building Already Exist");
            return (false)
        }
        var NewBuilding = new building();
        NewBuilding.buildingname = req.body.buildingname;
        NewBuilding.Address = req.body.Address;
        NewBuilding.city = req.body.city;
        NewBuilding.state = req.body.state;
        NewBuilding.buildingRegistred = true;
        NewBuilding.Adminid=req._passport.session.user;
      //  console.log(req._passport.session.user);
        console.log(NewBuilding);
        NewBuilding.save(function (error) {
            if (error) {
                return (error);
            }
            res.render('buildingdetails');
            return (null, NewBuilding);
        })
    }catch(error){
        console.log(error);
    }
    }



}
