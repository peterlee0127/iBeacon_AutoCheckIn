angular.module('PeopleList', [])
.controller('mainController', ['$scope','$http', function($scope,$http) {
// ($scope, $http) {
	// $scope.formData = {};

	$scope.getList = function(){
		$http.get('/api/getList')
			.success(function(data) {
				$scope.students = data;
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
			return "Locked";
		}
		else{
			$scope.turnGreen();
			return "unLocked";
		}
	}

	$scope.comeColor = function(come){
		if(!come){
		  $scope.turnRed();
			return "not arrived";
		}
		else{
			$scope.turnGreen();
			return "arrived";
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

     socket = io.connect(':8080');
	// var socket = io.connect('your server ip:port');
	// example var socket = io.connect('192.168.1.1:8080');

		socket.on('connect', function(data) {


		});

		socket.on('disconnect', function(data) {

		});

		socket.on('reloadData', function(data){
				$scope.reloadData();
		});

		socket.on('UserDistance', function(data){
			if(!document.getElementById(data.stu_id))
				return;

			 document.getElementById(data.stu_id).innerHTML="Location："+data.identifier+'<br></br>'+"Distance:"+data.distance ;
		});


		socket.on('listen_chat',function(data) {
		var e = $('<div class="other_chat">'+
					'<div class="chat-body clearfix" style="background-color:#7fffd4;border-radius:10px;">'+
						'<div class="chat_id">'+
							'<strong class="primary-font chat_name" style="margin-left:10px">'+data.kStuId+'</strong>'+
								'<small class="pull-right text-muted" style="margin-right:10px">'+
									'<span class="glyphicon glyphicon-time"></span>'+getDateTime()+
								'</small>'+
							'</div>'+
						'<p style="margin-left:10px">'+data.message+'</p>'+
					'</div>'+
				'</div><br>');
			$('#chat_box_outer').append(e);
			var objDiv = document.getElementById("chat_box_outer");
			objDiv.scrollTop = objDiv.scrollHeight;
			$('html, body').animate({scrollTop:objDiv.scrollHeight}, 'slow');
		});

}]);

function getDateTime() {
		var now     = new Date();
		var year    = now.getFullYear();
		var month   = now.getMonth()+1;
		var day     = now.getDate();
		var hour    = now.getHours();
		var minute  = now.getMinutes();
		var second  = now.getSeconds();
		if(month.toString().length == 1) {
				month = ' '+month;
		}
		if(day.toString().length == 1) {
				day = ' '+day;
		}
		if(hour.toString().length == 1) {
				hour = '0'+hour;
		}
		if(minute.toString().length == 1) {
				minute = '0'+minute;
		}
		if(second.toString().length == 1) {
				second = '0'+second;
		}
		var dateTime = month+"/"+day+" "+hour+':'+minute+':'+second;
		return dateTime;
}
