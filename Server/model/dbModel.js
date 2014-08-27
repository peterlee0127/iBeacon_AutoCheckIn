var mongoose = require('mongoose');


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

exports.removeAllData = function(){
  this.Student.remove({}, function(err) {
  });
  this.User.remove({}, function(err) {
  });
  this.Question.remove({}, function(err) {
  });
}
