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
	'in'	: [{ type:Date}],
	'out'	: [{type:Date}]
});
exports.iBeaconAdmin = mongoose.model('iBeaconAdmin',
{
	'UserName'	:String,
    'account'	:String,
    'password'	:String
});
exports.Question = mongoose.model('question',{
		'UserName'	 	:String,
		'date'		 	:Date,
		'dateString' 	:String,
		'content'	 	:String
})
