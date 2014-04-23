var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/db_hw');

var Student = mongoose.model('Student',
				{
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



Student.create(
{				
		stu_id : "499850000",	
		name : "peterlee",
		come : "true",
		lock : "true"
				
},function(err,todo){
		if(err)
		  console.log("err");
		else
		 console.log("insert user successful");
});
