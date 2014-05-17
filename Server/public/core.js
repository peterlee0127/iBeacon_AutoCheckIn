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
			 document.getElementById(data.stu_id).innerHTML="位置："+data.identifier+'<br></br>'+"距離:"+data.distance ;
		});


	socket.on('listen_chat',function(data) {
	var e = $('<li class="other_chat">'+
				'<div class="chat-body clearfix">'+
					'<div class="chat_id">'+
						'<strong class="primary-font chat_name">'+data.stu_id+'</strong>'+
							'<small class="pull-right text-muted">'+
								'<span class="glyphicon glyphicon-time"></span>'+getDateTime()+
							'</small>'+
						'</div>'+
					'<p>'+data.message+'</p>'+
				'</div>'+
			'</li>');
	$('#ListenChat').append(e);
	var objDiv = document.getElementById("chat_box_outer");
	objDiv.scrollTop = objDiv.scrollHeight;
});




}

function getDateTime() {
		var now     = new Date();
		var year    = now.getFullYear();
		var month   = now.getMonth()+1;
		var day     = now.getDate();
		var hour    = now.getHours();
		var minute  = now.getMinutes();
		var second  = now.getSeconds();
		if(month.toString().length == 1) {
				month = '0'+month;
		}
		if(day.toString().length == 1) {
				day = '0'+day;
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
		var dateTime = hour+':'+minute+':'+second;
		return dateTime;
}
