var mongoose = require('mongoose');
var crypto = require('crypto');


mongoose.connect('mongodb://localhost:27017/iBeaconCheckIn');

exports.Student = mongoose.model('Student',
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
	'inTime'	: [{ type:Date}],
	'outTime'	: [{type:Date}]
});

exports.User = mongoose.model('User',
{
	  'UserName'	:String,
    'account'	  :String,
    'password'	:String
});

exports.iBeacon = mongoose.model('iBeacon',
{
    'beacon_id'	  :String,
    'identifier'	:String,
    'major'	      :Number,
    'minor'       :Number,
    'range'       :Number
});

exports.Question = mongoose.model('question',{
		'UserName'	 	:String,
		'date'		 	:Date,
		'dateString' 	:String,
		'content'	 	:String
})
