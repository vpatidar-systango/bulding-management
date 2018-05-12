var mongoose = require('mongoose');
var User=require('./user');

var buildingSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    createdBy: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true,
    },
    floorNo: {
        type: Number,
        require: true
    },
    status: {
        type: Number,
        require: true
    },
    priority: {
        type: Number,
        require: true
    },

});

module.exports = mongoose.model('building', buildingSchema);