var Todo = require('./models/todo');
var User = require('./models/user');

module.exports = function(app, passport) {

	// -------------------------------------------------------------------------
	// API ROUTES --------------------------------------------------------------
	// -------------------------------------------------------------------------

	/**
	 * Get all Todos
	 */
	app.get('/api/todos', function(req, res) {
		// use mongoose to get all todos in the database
		Todo.find(function(err, todos) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);
			res.json(todos); // return all todos in JSON format
		});
	});

	/**
	 * Create a todo and send back all todos
	 */
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

	/**
	 * Delete a todo
	 */
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

	// -------------------------------------------------------------------------
	// AUTH ROUTES -------------------------------------------------------------
	// -------------------------------------------------------------------------

	// auth for getting user

	// auth to check if logged in

	// process the signup form (return JSON)
	app.post('/auth/signup',
		passport.authenticate('local'),
		function(req, res) {
			res.send(true)
		});

	// process the login form (return JSON)
	app.post('/auth/signup',
		passport.authenticate('local'),
		function(req, res) {
			res.send(true)
		});

	// facebook login
	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/#/todos',
		failureRedirect: '/#/login'
	}));

	// google login

	// -------------------------------------------------------------------------
	// application -------------------------------------------------------------
	// -------------------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

};