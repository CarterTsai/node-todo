var scotchTodo = angular.module('scotchTodo', []);

// adding routing for single page app (pull page from public/pages based on url)
scotchTodo.config(function($routeProvider) {
	$routeProvider

		// home page, not logged in, ask people to login
		.when('/', {
			templateUrl : 'pages/home.html',
			controller 	: 'homeController'
		})

		// signup page
		.when('/signup', {
			templateUrl : 'pages/signup.html',
			controller 	: 'signupController'
		})

		// login page
		.when('/login', {
			templateUrl : 'pages/login.html',
			controller 	: 'loginController'
		})

		// after they are signed in, show todos (this is the page from the first tutorial)
		.when('/todos', {
			templateUrl : 'pages/todos.html',
			controller 	: 'mainController'
		})
});

// controller for the home page ('/') (will show if not logged in)
function homeController($scope, $http) {

}

// controller for the local signup page ('/signup')
function signupController($scope, $http) {

}

// controller for the local login page ('/login')
function loginController($scope, $http) {

}

// controller for the todos page ('/todos') (after they are signed in)
function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page, get all todos and show them
	$scope.initialize = function() {
		$http.get('/api/todos')
			.success(function(data) {
				$scope.todos = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		$http.post('/api/todos', $scope.formData)
			.success(function(data) {
				$('input').val('');
				$scope.todos = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a todo after checking it
	$scope.deleteTodo = function(id) {
		$http.delete('/api/todos/' + id)
			.success(function(data) {
				$scope.todos = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}