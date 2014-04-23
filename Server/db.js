var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	url = 'mongodb://localhost/db_hw'
	;

var student = new Schema({
	'stu_id':String,
	'name':String,
	'come':{
		type:String,
		default:'false',
		required:true
	},
	'lock':{
		type:Boolean,
		default:false,
		required:true
	}
});

mongoose.model('Student', student);
mongoose.connect(url);
