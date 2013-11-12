var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
	text : String,
	done : Boolean
});

// expose todo to the app
module.exports = Todo;