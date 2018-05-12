var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    role: String,
    status:String,
    facebook_id: String,
    facebook_token: String,
    facebook_name: String,
    provider: String,

    google_id: String,
    google_token: String,
    google_name: String,
    provider: String,

    resetPasswordToken: String,
    resetPasswordExpires: Date,

    requestsend: false,
    inviteToken: String,
    inviteTokenExpires: Date,
    buildingdetails:String,

    buildingName:Array,
    

});

/**
 *Encryption methode for encrypting Password comes from Signup user
 */
userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
/**
 *decryption methode for decrypting Password comes from Login user
 */

/**
 * Methode for Comparing PAssword for valid user
 */
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', userSchema);