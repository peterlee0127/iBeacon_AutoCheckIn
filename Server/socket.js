var model = require('./model.js');
var socketArr=[];

function socketObj(socketID,userID){
    this.socketID=socketID;
    this.userID=userID;
};

function getDateTime() {
    var now     = new Date();
    var year    = now.getFullYear();
    var month   = now.getMonth()+1;
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds();
    if(month.toString().length == 1) {
        month = ' '+month;
    }
    if(day.toString().length == 1) {
        day = ' '+day;
    }
    if(hour.toString().length == 1) {
        hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        second = '0'+second;
    }
    var dateTime = month+"/"+day+" "+hour+':'+minute+':'+second;
    return dateTime;
}

// Socket.IO configure
// var io = require('socket.io').listen(app.server);
module.exports =  function(io){
  'user strict';
  io.on('connection', function(socket){

  socket.on('chat', function(obj){//stu_id, message, class_id
    model.Question.create(
    {
      'UserName'		: obj.kStuId,
      'dateString'	: getDateTime(),
      'content'			: obj.message,
      'date' 				: Date()
    },function(err,question){
        if(err){

        }
        else{
          //console.log("saveChat"+question);
        }
    });
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

    model.Student.findOne( {  stu_id:obj.userID },function(err,student)
    {
      if(!student)
      {
        model.Student.create(
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

                model.Student.findOne( {  stu_id:Obj.userID },function(err,student)
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


};
