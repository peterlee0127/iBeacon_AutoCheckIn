var PeopleList = angular.module('PeopleList', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page
	$http.get('/api/getList')
		.success(function(data) {
			$scope.students = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	var reloadData=$scope.reloadData = function()
	{
		$http.get('/api/getList')
			.success(function(data) {
				$scope.students = data;
			})
			.error(function(data) {
					console.log('Error: ' + data);
			});
	}


	$scope.changeStudent = function(stu_id) {
		var post = {  "stu_id":stu_id };
		$http.post('/api/changeStudent/' , JSON.stringify(post))
			.success(function(data) {
				reloadData();
			})
			.error(function(data) {
				console.log('Error: ' + data);
				reloadData();
			});
	};
	var socket = io.connect('http://localhost:8080/');

		socket.on('connect', function(data) {


			socket.emit('addUser', { userID: '499850070' });

		});


		socket.on('disconnect', function(data) {



		});

		socket.on('reloadData', function(data){
			reloadData();
		});
}
