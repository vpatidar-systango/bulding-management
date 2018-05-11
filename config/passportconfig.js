module.exports = {

    'facebookAuth' : {
        'clientID'      : '1232153756919084', // your App ID
        'clientSecret'  : '8edbb1449b0ac94741879407100da485', // your App Secret
        'callbackURL'   : 'https://localhost:3000/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },

    'googleAuth' : {
        'clientID'      : '102479346513-cr3ltn4jv47mgot790k5guqbu0rgdli6.apps.googleusercontent.com',
        'clientSecret'  : '5YTAKbCxoIHwjadqVJPa-Ome',
        'callbackURL'   : 'https://localhost:3000/auth/google/callback'
    }

};
