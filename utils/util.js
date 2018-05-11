var crypto = require('crypto');

module.exports={
   generateToken:async function(){
    crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        return token;
    });
}

}