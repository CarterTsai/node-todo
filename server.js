// set up ======================================================================
var express  = require('express');
var app      = module.exports = express(); 				// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var passport = require('passport'); 					// passport for authentication

var port = process.env.PORT || 8080;

// define model ================================================================
var Todo = require('./models/todo.js');
var User = require('./models/user.js');

// configuration ===============================================================
mongoose.connect('mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu'); 	// connect to mongoDB database on modulus.io

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 					// log every request to the console
	app.use(express.bodyParser()); 						// pull information from html in POST
	app.use(express.methodOverride()); 					// simulate DELETE and PUT
});

require('./config/passport.js')(passport, User); 				// load passport config and pass in passport

// routes ======================================================================

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/todos', function(req, res) {

		// use mongoose to get all todos in the database
		Todo.find(function(err, todos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);

			res.json(todos); // return all todos in JSON format
		});
	});

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		Todo.create({
			text : req.body.text,
			done : false
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Todo.find(function(err, todos) {
				if (err)
					res.send(err);
				res.json(todos);
			});
		});

	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Todo.find(function(err, todos) {
				if (err)
					res.send(err);
				res.json(todos);
			});
		});
	});

	// auth --------------------------------------------------------------------

	// local auth signup
	app.post('/auth/signup',
		passport.authenticate('local'),
		function(req, res) {
			res.send(true)
		});

	// local auth login

	// facebook login
	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback', passport.authenticate('facebook'));

	// google login

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
