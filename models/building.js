var mongoose = require('mongoose');
var User=require('./user');

var buildingSchema = mongoose.Schema({
    buildingname: {
        type: String,
        require: true
    },
    Address: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true,
    },
    state: {
        type: String,
        require: true
    },
Adminid: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

});

module.exports = mongoose.model('building', buildingSchema);