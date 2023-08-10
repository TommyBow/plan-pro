//Config/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken');


// Passport configuration for Google authentication
passport.use(new GoogleStrategy({
  clientID: 'your_google_client_id',
  clientSecret: 'your_google_client_secret',
  callbackURL: 'http://localhost:5000/api/auth/google/callback',
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ username: profile.emails[0].value });
      if (!user) {
        user = new User({
          username: profile.emails[0].value,
          password: '',
        });
        await user.save();
      }
      const token = jwt.sign({ userId: user._id, username: user.username }, 'your_secret_key', {
        expiresIn: '1h',
      });
      return done(null, token);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Passport configuration for Facebook authentication
passport.use(new FacebookStrategy({
  clientID: 'your_facebook_app_id',
  clientSecret: 'your_facebook_app_secret',
  callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
  profileFields: ['id', 'emails'],
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ username: profile.emails[0].value });
      if (!user) {
        user = new User({
          username: profile.emails[0].value,
          password: '',
        });
        await user.save();
      }
      const token = jwt.sign({ userId: user._id, username: user.username }, 'your_secret_key', {
        expiresIn: '1h',
      });
      return done(null, token);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;