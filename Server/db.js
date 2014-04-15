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

var classHistory = new Schema({
	admin:String,
	student_list : [student],
	class_name : String,
	class_room : String,
	class_time : String,
	'lock':{
		type:Boolean,
		default:false,
		required:true
	}
});

classHistory.set('collection', 'classHistory');
mongoose.model('Student', student);
mongoose.model('ClassHistory', classHistory);
mongoose.connect(url);
