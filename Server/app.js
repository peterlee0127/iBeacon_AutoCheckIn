var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var debug = require('debug')('my-application');
var mongoose = require('mongoose');


//var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);

// view engine setup
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/stylesheets')));

/*
app.use(session({
		secret: "324rgrgegr",
		store: new MongoStore({
				db: "iBeaconCheckInSession",
		})
}));
*/

mongoose.connect('mongodb://localhost:27017/iBeaconCheckIn');
// mongoose.connect('mongodb://example:example@oceanic.mongohq.com:10037/ibeacon_Auto');


var Student = mongoose.model('Student',
{
  'stu_id':String,
	'name':String,
	'come':{
			type:Boolean,
			default:false,
		    required:true
	},
	'lock':{
			type:Boolean,
			default:false,
		    required:true
	},

	'in': [{ type:Date}],
	'out': [{type:Date}]

});

//API

app.get('/api/getList' , function(req,res)
{
		Student.find(function (err,student)
		{
				if(err)
				  res.send(err);
				else
					res.json(student);
		});
});



app.post('/api/changeStudent/', function(req, res) {

	Student.findOne( {  stu_id:req.body.stu_id },function(err,student)
	{
			student.come=!student.come;
			student.save();
			res.end("ok");
	});

});

app.post('/api/lockStudent/', function(req, res) {

	Student.findOne( {  stu_id:req.body.stu_id },function(err,student)
	{
			student.lock=!student.lock;  //when change from Web , lock the come status
			student.save();
			res.end("ok");
	});

});

app.post('/api/deleteStudent/', function(req, res) {

	Student.findOne( {  stu_id:req.body.stu_id },function(err,student)
	{
			student.remove();
			res.end("ok");
	});

});


// index Page
app.get("/", function(req,res)
{
  	res.sendfile("./public/index.html");
});

app.get("/getBeacon", function(req,res)
{
		res.sendfile("./public/iBeacon.json");
});

// Server Configure
app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function() {
	console.log("Server is listening on port:" + server.address().port);
	debug('Express server listening on port ' + server.address().port);
});

var socketArr=[];

function socketObj(socketID,userID){
		this.socketID=socketID;
		this.userID=userID;
};

// Socket.IO configure
var io = require('socket.io').listen(server);
io.on('connection', function(socket){


	socket.on('addUser',function(message){

		for(var i=0;i<socketArr.length;i++){
				var Obj=socketArr[i];
				if(message.userID==Obj.userID)	{
					console.log(Obj.userID+":is exist");
					return;
				}
		}


		var obj=new socketObj(socket.id,message.userID);
		socketArr.push(obj);

		console.log("add userID:"+obj.userID);

		Student.findOne( {  stu_id:obj.userID },function(err,student)
		{
			if(!student)
			{
				console.log("user no found");

				Student.create(
				{
						stu_id :obj.userID ,
						name : message.stu_name,
						come : true,
						lock : false,
						in: new Date()

				},function(err,todo){
						if(err)
							console.log("err");
						else
						console.log("insert user successful");
				});

				socket.broadcast.emit('reloadData', { my: 'data' });
				return;
			}
				if(!student.lock)
				{
					student.come=true;
					student.save();
			 }
				student.in.push(new Date());
				socket.broadcast.emit('reloadData', { my: 'data' });
		});

	});

	  socket.on('disconnect', function () {

				for(var i=0;i<socketArr.length;i++){
						var Obj=socketArr[i];

						if(socket.id==Obj.socketID)
						{
								console.log("user leave:"+Obj.userID);
								var index=i;

								Student.findOne( {  stu_id:Obj.userID },function(err,student)
								{
										if(!student)
										{
											console.log("user no found");
											return;
										}

										if(!student.lock)
										{
											student.come=false;
											student.save();
										}
										var count=student.in.length-student.out.length;
										if( count>=1 ){
											for(var j=0;j< count ;j++)
											{
													var t=new Date();
													t.setSeconds(t.getSeconds() - j*4);
													student.out.push(t);
													if(j==count-1)
													{
														socketArr.splice(index, 1);
														socket.broadcast.emit('reloadData', { my: 'data' });
													}
											}
										}



								});

						}

				}

  	});


});
