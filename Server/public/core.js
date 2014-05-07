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

	$scope.reloadData = function()
	{
		$http.get('/api/getList')
			.success(function(data) {
				$scope.students = data;
			})
			.error(function(data) {
					console.log('Error: ' + data);
			});
	}

	$scope.lock = {};
	$scope.come = {};
	$scope.turnGreen = function (){
			$scope.come.style = {"color":"green"};
	    $scope.lock.style = {"color":"green"};
	}

	$scope.turnRed = function() {
			$scope.come.style = {"color":"red"};
	    $scope.lock.style = {"color":"red"};
	}

	$scope.lockColor = function(lock){
		if(lock){
			$scope.turnRed();
			return "鎖定";
		}
		else{
			$scope.turnGreen();
			return "未鎖定";
		}
	}

	$scope.comeColor = function(come){
		if(!come){
		  $scope.turnRed();
			return "沒到";
		}
		else{
			$scope.turnGreen();
			return "有到";
		}
	}


	$scope.changeStudent = function(stu_id) {
		var post = {  "stu_id":stu_id };
		$http.post('/api/changeStudent/' , JSON.stringify(post))
			.success(function(data) {
				$scope.reloadData();
			})
			.error(function(data) {
				console.log('Error: ' + data);
				$scope.reloadData();
			});
	};

	$scope.lockStudent = function(stu_id) {
		var post = {  "stu_id":stu_id };
		$http.post('/api/lockStudent/' , JSON.stringify(post))
			.success(function(data) {
					$scope.reloadData();
			})
			.error(function(data) {
				console.log('Error: ' + data);
					$scope.reloadData();
			});
	};

	$scope.deleteStudent = function(stu_id) {
		var post = {  "stu_id":stu_id };
		$http.post('/api/deleteStudent/' , JSON.stringify(post))
			.success(function(data) {
				$scope.reloadData();
			})
			.error(function(data) {
				console.log('Error: ' + data);
				$scope.reloadData();
			});
	};


	var socket = io.connect(':8080');
	// var socket = io.connect('your server ip:port');
	// example var socket = io.connect('192.168.1.1:8080');

		socket.on('connect', function(data) {

			console.log("socket connected");

		});


		socket.on('disconnect', function(data) {

			console.log("socket disconnected");

		});

		socket.on('reloadData', function(data){
				$scope.reloadData();
		});
}
