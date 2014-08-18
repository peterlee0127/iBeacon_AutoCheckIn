var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var debug = require('debug')('my-application');
var mongoose = require('mongoose');
var crypto = require('crypto');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// view engine setup
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// app.use(morgan('dev'));
app.use(methodOverride());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/stylesheets')));


app.use(session({
		resave:true,
		saveUninitialized:true,
		secret: "324rgrfdsfm2ek3n2rgr",
		store: new MongoStore({
				db: "iBeaconCheckInSession",
		})
}));


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

var iBeaconAdmin = mongoose.model('iBeaconAdmin',
{
  'account':String,
  'password':String
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

app.get("/getBeacon", function(req,res)
{
	res.sendfile("./public/iBeacon.json");
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

function sessionHandler(req,res,next){
	if(req.session.user)
		next();
	else
		res.redirect("login");
}

// index Page
app.get("/",sessionHandler, function(req,res){
		res.render('index', { UserName:req.session.user });
});


app.get("/chat",sessionHandler, function(req,res){
		res.render('chat', { UserName:req.session.user });
});

app.get('/iBeaconConf',sessionHandler, function(req,res){
	res.render('iBeaconConf', { UserName:req.session.user });
});


app.get('/ViewRowData',sessionHandler, function(req,res){
	res.render('ViewRowData.ejs', { UserName:req.session.user });
});

app.get("/login",function(req,res){
	if(req.session.user)
		req.session.user= NaN;
	res.sendfile("./public/login.html");
});

app.get("/register",function(req,res){
	if(req.session.user)
		req.session.user= NaN;
  res.sendfile("./public/register.html");
});

app.get("/logout",function(req,res){
	req.session.user= NaN;
	res.redirect('/login');
});

app.post("/registerAction",function(req,res){

  iBeaconAdmin.findOne( {  account:req.body.email },function(err,admin)
  {
    	if(!admin){
        var cipher = crypto.createCipher('aes-256-cbc','InmbuvP6Z8');
        var text = req.body.password;
        var crypted = cipher.update(text,'utf8','hex');
        crypted += cipher.final('hex');

        iBeaconAdmin.create(
        {
            account : req.body.email ,
            password : crypted

        },function(err,admin){
            if(err)
            {
              console.log("add admin@admin err");
              res.redirect('/register');
            }
            else
            {
              console.log("add admin@admin successful");
              res.redirect('/login');
            }
        });
    }
		else{
    	console.log("Account has been used by another people");
			res.redirect("/login");
		}
  });
});

app.post("/loginAction",function(req,res){
    iBeaconAdmin.findOne( {  account:req.body.email },function(err,admin)
    {
        if(!admin){
          console.log("User not found");
          res.redirect('/login');
          return;
        }

        var cipher = crypto.createCipher('aes-256-cbc','InmbuvP6Z8');
        var text = req.body.password;
        var crypted = cipher.update(text,'utf8','hex');
        crypted += cipher.final('hex');
        console.log(admin.password+" "+crypted);
        if(admin.password==crypted)
        {
          req.session.user = req.body.email;
          res.redirect('/');
        }
        else
          res.redirect('/login');
    });
});



// Server Configure
app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function() {
	console.log("Server is listening on port:" + server.address().port);
});

var socketArr=[];

function socketObj(socketID,userID){
		this.socketID=socketID;
		this.userID=userID;
};

// Socket.IO configure
var io = require('socket.io').listen(server);
io.on('connection', function(socket){


	socket.on('chat', function(obj){//stu_id, message, class_id
		socket.broadcast.emit('listen_chat', obj);
	});

	socket.on('distance', function(obj){
		socket.broadcast.emit('UserDistance',obj);

	});

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
						console.log("Insert "+message.stu_name+" successful");
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
