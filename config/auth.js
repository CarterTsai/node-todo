module.exports = function() {

	return {
		facebook 			: {
			clientID 		: 'facebookID',
			clientSecret 	: 'facebookSecret',
			callbackURL 	: '/auth/facebook/callback'
		},

		google 				: {
			clientID 		: 'googleID',
			clientSecret 	: 'googleSecret',
			callbackURL 	: '/auth/google/callback'
		}
	}

};