var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook');
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var User 			 = require('../app/models/user');

// load auth variables (clientID, clientSecret, and callbackURL)
var authConfig   = require('./secret'); 		// hidden for security purposes
// var authConfig   = require('./auth'); 	// use this one for demo

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

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
	// find and return or create a user
	passport.use(new FacebookStrategy({
			clientID 		: authConfig.facebook.clientID,
			clientSecret 	: authConfig.facebook.clientSecret,
			callbackURL 	: authConfig.facebook.callbackURL
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
				if (err)
					return done(err);

				// if no user is found, create one
				if (!user) {
					var newUser         = new User();
					newUser.name        = profile.name.givenName
					newUser.facebook.id = profile.id

					// save the new user
					newUser.save(function(err) {

						return done(null, newUser);
					});
				} else {
					return done(null, user);
				}
			});
		}
	));

	passport.use(new GoogleStrategy({
			clientID 		: authConfig.google.clientID,
			clientSecret 	: authConfig.google.clientSecret,
			callbackURL 	: authConfig.google.callbackURL
		}, function(accessToken, refreshToken, profile, done) {
			User.findOne({ 'google.id' : profile.id }, function(err, user) {
				if (err)
					return done(err);

				return done(null, user);
			});
		}
	));

};

