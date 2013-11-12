var mongoose = require('mongoose');

// model for users
var User = mongoose.model('User', {
	name 		: String,
	email 	 	: String,
	password 	: String,
	facebook 	: {},
	google 		: {}
});

// expose user to the app
module.exports = User;