angular.module('SystemConf', [])
.controller('SystemConfController', ['$scope','$http', function($scope,$http) {

			$scope.getList = function(){
				$http.get('/api/getList')
					.success(function(data) {
						$scope.list = data;
					})
					.error(function(data) {
						console.log('Error: ' + data);
					});
			}

			$scope.getChat = function(){
				$http.get('/api/getChat')
					.success(function(data) {
					$scope.chats = data;
					})
					.error(function(data) {
						console.log('Error: ' + data);
					});
			}

			$scope.getBeacon = function(){
				$http.get('/getBeacon')
					.success(function(data) {
						$scope.beaconConf = data;
					})
					.error(function(data) {
						console.log('Error: ' + data);
					});
			}

			$scope.getAllData = function(){
				$scope.getChat();
				$scope.getList();
				$scope.getBeacon()

			}


}]);
