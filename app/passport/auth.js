// config/auth.js
var config = require('../../config');

// expose our config directly to our application using module.exports
module.exports = {
  'facebookAuth' : {
    'clientID'      : config.FB_APP_ID, // your App ID
    'clientSecret'  : config.FB_APP_SECRET, // your App Secret
    'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
  },

  'twitterAuth' : {
    'consumerKey'     : config.TW_APP_KEY,
    'consumerSecret'  : config.TW_APP_SECRET,
    'callbackURL'     : 'http://localhost:3000/auth/twitter/callback'
  }
};
