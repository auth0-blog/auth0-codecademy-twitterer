var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

var strategy = new Auth0Strategy({
    domain:       process.env['AUTH0_DOMAIN'],
    clientID:     process.env['AUTH0_CLIENT_ID'],
    clientSecret: process.env['AUTH0_CLIENT_SECRET'],
    callbackURL:  process.env['CALLBACK_URL']
  }, function(accessToken, refreshToken, profile, done) {
    //Some tracing info
    console.log('profile is', profile);
    //save the profile
    return done(null, profile);
  });

passport.use(strategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = strategy;