// =============================================================================
// set up ======================================================================
// =============================================================================
var express  = require('express');
var app      = module.exports = express(); 				// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var passport = require('passport'); 					// passport for authentication

var port = process.env.PORT || 8080;

// =============================================================================
// define model ================================================================
// =============================================================================
var Todo = require('./app/models/todo');
var User = require('./app/models/user');

// =============================================================================
// configuration ===============================================================
// =============================================================================
mongoose.connect('mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu'); 	// connect to mongoDB database on modulus.io

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 					// log every request to the console
	app.use(express.bodyParser()); 						// pull information from html in POST
	app.use(express.methodOverride()); 					// simulate DELETE and PUT

	// session
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' }));

	// passport config
	app.use(passport.initialize());
	app.use(passport.session());
});

var auth = require('./config/passport')(passport, User); 	// load passport config and pass in passport

// =============================================================================
// routes ======================================================================
// =============================================================================
require('./app/routes')(app, passport, User, Todo);

// =============================================================================
// listen (start app with node server.js) ======================================
// =============================================================================
app.listen(port);
console.log("App listening on port " + port);
