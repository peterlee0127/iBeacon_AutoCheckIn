var socket = io.connect('http://localhost:8080/');

  socket.on('connect', function(data) {


    socket.emit('addUser', { userID: '499850000' });

  });


  socket.on('disconnect', function(data) {



  });
