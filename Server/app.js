var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var helmet = require('helmet');

var model = require('./model/dbModel.js');
var encrypt = require('./model/encrypt.js');
var beaconConfig = require('./model/beacon.js');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// view engine setup
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

app.use(helmet.xssFilter());
app.use(helmet.xframe());
app.use(helmet.nosniff());
app.use(helmet.ienoopen());
app.disable('x-powered-by');

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


//API
app.get('/api/getList',sessionHandler, function(req,res){
		model.Student.find(function (err,student)	{
				if(err)
				  res.send(err);
				else
					res.json(student);
		});
});

app.get("/getBeacon", function(req,res){
	model.iBeacon.find( function (err,beacon)
	{
		if(beacon.length==0){
				console.log("no anyBeacon,will read from file");
				var result = beaconConfig.readBeaconFromJSON();
				res.send(result);
				return;
		}
		if(err)
				res.send(err);
		else
				res.send(beacon);
	});
});

app.get('/api/getChat',sessionHandler,function(req,res){
	model.Question.find(function (err,question){
			if(err)
				res.send(err);
			else
				res.json(question);
	});
})


app.get("/api/removeAllData",sessionHandler, function(req,res){
	model.removeAllData();
	res.render('result', {  title:"Please Wait....",result:"All data is clean",to:'/logout'    });
});


app.post('/api/changeStudent/',sessionHandler, function(req, res) {
	model.Student.findOne( {  stu_id:req.body.stu_id },function(err,student)	{
			student.come=!student.come;
			student.save();
			res.end("ok");
	});

});

app.post('/api/lockStudent/', sessionHandler, function(req, res) {
	model.Student.findOne( {  stu_id:req.body.stu_id },function(err,student)	{
			student.lock=!student.lock;  //when change from Web , lock the come status
			student.save();
			res.end("ok");
	});

});

app.post('/api/deleteStudent/',sessionHandler, function(req, res) {
	model.Student.findOne( {  stu_id:req.body.stu_id },function(err,student)
	{
			student.remove();
			res.end("ok");
	});

});

app.post('/api/deleteRecord/',sessionHandler ,function(req,res){
	model.Student.findOne( {  stu_id:req.body.stu_id },function(err,student)
	{
		  var i= req.body.index;
			console.log(req.body.stu_id);
			console.log(i);
			/*
			if(student.inTime[i]!=null)
					student.inTime.remove(student.inTime[i]);
			if(student.outTime[i]!=null)
					student.outTime.remove(student.outTime[i]);
			studne.save();
		   */
			res.end("ok");
	});
});

function sessionHandler(req,res,next){
	if(req.session.user)
		next();
	else
		res.redirect("/login");
}
// index Page
app.get("/",sessionHandler, function(req,res){
		res.render('index', {  title:'iBeacon AutoCheckIn-List',UserName:req.session.user });
});

app.get("/chat",sessionHandler, function(req,res){
		res.render('chat', { title:'iBeacon AutoCheckIn-Chat',UserName:req.session.user });
});

app.get('/iBeaconConf',sessionHandler, function(req,res){
	res.render('iBeaconConf', { UserName:req.session.user });
});

app.get('/ViewRowData',sessionHandler, function(req,res){
	res.render('ViewRowData.ejs', { UserName:req.session.user });
});

app.get("/login",function(req,res){
	if(req.session.user){
		req.session.user= NaN;
	}
	res.sendfile("./public/login.html");
});

app.get("/register",function(req,res){
	if(req.session.user){
		req.session.user= NaN;
	}
  res.sendfile("./public/register.html");
});

app.get("/logout",function(req,res){
	req.session.user= NaN;
	res.redirect('/login');
});

app.post("/registerAction",function(req,res){
  model.User.findOne( {  account:req.body.email },function(err,admin)
  {
    	if(!admin){
    		//encrypt
				var crypted =	encrypt.encrypt(req.body.password);

        model.User.create(
  			{
					  UserName : req.body.name,
            account : req.body.email ,
            password : crypted

        },function(err,admin){
            if(err){
           	 	res.render('result', {  title:"Error",result:"Register Fail",to:'/register'    });
		   			}
            else  {
							req.session.user = admin.UserName;
         	 		res.render('result', {  title:"Register Success",result:"Hello "+req.body.name,to:'/'  });
	   				}
        });
    }
		else{
			res.render('result', {  title:"Error",result: "Account has been used",to:'/register'  });
		}
  });
});

app.post("/loginAction",function(req,res){
    model.User.findOne( {  account:req.body.email },function(err,admin)  {
      if(!admin){
		  	 	res.render('result', { title:"Error",result: "Login Fail,User not found",to:'/login' });
          return;
      }
			var crypted =	encrypt.encrypt(req.body.password);
      if(admin.password==crypted){
       	  req.session.user = admin.UserName;
       	  res.render('result',{  title:"Login Success",result: "Hello "+admin.UserName,to:'/'  });
	   	}
      else{
	    		res.render('result', { title:"Error",result: "Login Fail",to:'/login' });
			}

    });
});



// Server Configure
app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function() {
	console.log("Server is listening on port:" + server.address().port);
});

var io = require('socket.io');
io = io.listen(server);
require('./model/socket.js')(io);
