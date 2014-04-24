var PeopleList = angular.module('PeopleList', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page, get all todos and show them
	$http.get('/api/getList')
		.success(function(data) {
			$scope.students = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});


	// delete a todo after checking it
	$scope.changeStudent = function(stu_id) {
		$http.post('/api/changeStudent/' , JSON.stringify(stu_id))
			.success(function(data) {
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}
