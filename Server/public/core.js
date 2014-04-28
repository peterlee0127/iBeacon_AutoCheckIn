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
			alert("reload");
		$http.get('/api/getList')
			.success(function(data) {
				$scope.students = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

	}


	$scope.changeStudent = function(stu_id) {
		var data = {  "stu_id":stu_id };
		$http.post('/api/changeStudent/' , JSON.stringify(data))
			.success(function(data) {
				reloadData();
			})
			.error(function(data) {
				console.log('Error: ' + data);
				reloadData();
			});
	};

}
