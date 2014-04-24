var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

//var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);

// view engine setup
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
/*
app.use(session({
		secret: settings.cookie_secret,
		store: new MongoStore({
				db: db_hw_session.db
		})
}));
*/

mongoose.connect('mongodb://localhost:27017/db_hw');

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
	}
});

//API

app.get('/api/getList' , function(req,res)
{
		Student.find(function (err,student)
		{
				if(err)
				  res.send(err);
				else
				{
				  res.json(student);
				}
		});
});



app.post('/api/changeStudent/', function(req, res) {
	console.log("get changeStudent POST");

		Student.update({
			stu_id : req,
			come : false
		}, function(err, student) {
			if (err)
				res.send(err);
			});

			Student.find( function (err,student)
			{
					if(err)
						res.send(err);
					else if(stude)
					{
						res.json(student);
					}
			});

	});



// index Page
app.get("/", function(req,res)
{
  res.sendfile("./public/index.html");
});



module.exports = app;
