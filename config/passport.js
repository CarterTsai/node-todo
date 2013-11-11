var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook');
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

// load auth variables like clientID, clientSecret, and callbackURL

	var authFile   = require('./secret.js'); 	// hidden for security purposes
	// var authFile   = require('./auth.js'); 	// use this one for demo

	var authConfig = new authFile();

module.exports = function(passport) {

	// configuration for local authentication
	passport.use(new LocalStrategy(
		function(email, password, done) {
			User.findOne({ email: email }, function(err, user) {

				// basic errors
				if (err)
					return done(err);

				// a user is not found
				if (!user)
					return done(null, false, { message: 'No user with that email.' });

				// the password for that user is wrong
				if (!user.validPassword(password))
					return done(null, false, { message: 'Incorrect password.' });

				// return the user if everything is good
				return done(null, user);
			});
		}
	));

	// configuration for facebook authentication
	passport.use(new FacebookStrategy({
			clientID 		: authConfig.facebook.clientID,
			clientSecret 	: authConfig.facebook.clientSecret,
			callbackURL 	: authConfig.facebook.callbackURL
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOrCreate({ 'facebook.id' : profile.id }, function(err, user) {
				if (err)
					return done(err);

				return done(null, user);
			});
		}
	));

	passport.use(new GoogleStrategy({
			clientID 		: authConfig.google.clientID,
			clientSecret 	: authConfig.google.clientSecret,
			callbackURL 	: authConfig.google.callbackURL
		}, function(accessToken, refreshToken, profile, done) {
			User.findOrCreate({ 'google.id' : profile.id }, function(err, user) {
				if (err)
					return done(err);

				return done(null, user);
			});
		}
	));

};

