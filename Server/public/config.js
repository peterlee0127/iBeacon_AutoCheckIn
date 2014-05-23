var SystemConf = angular.module('SystemConf', []);

function SystemConfController($scope, $http){
	$scope.formData = {};

	// when landing on the page
	$http.get('/getBeacon')
		.success(function(data) {
			$scope.beaconConf = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});



	$scope.getBeacon = function(){
		$http.get('/getBeacon')
			.success(function(data) {
				$scope.beaconConf = data;
			})
			.error(function(data) {
					console.log('Error: ' + data);
			});
	}

	$scope.getRawData =function(){
		$http.get('/api/getList')
			.success(function(data) {
				$scope.list = data;
			})
			.error(function(data) {
					console.log('Error: ' + data);
			});

	}


}
