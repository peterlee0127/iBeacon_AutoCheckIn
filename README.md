iBeacon_AutoCheckIn
==========


<h2>Feature功能:</h2>
<h4>1:自動簽到</h4>
<h4>2:自定義學號/姓名</h4>
<h4>3:即時顯示學生狀態</h4>
<h4>4:自動修正時間問題</h4>
<h4>5:即時問答/聊天</h4>
<h4>6: ...</h4>

<hr>

<h2>架構</h2>

<h4>1:Client:iOS ,Web(Angular.js)</h4>
<h4>2:Server:Node.JS + Socket.IO (WebSocket)</h4>
<h4>3:DB:Mongoose (mongodb) NoSQL</h4>

<hr>

Install安裝
====
iOS 

    // in iBeacon_AutoCheckIn/iOS/iBeacon_AutoCheckIn
    
    pod install

Server

	//in iBeacon_AutoCheckIn/Server
	
	npm install

Configure設定
====

iOS

    //Config.h  
    static NSString *const defaultServer =  @"your server ip";   
    static NSString *const defaultPort = @"your port";

Server(Nodejs)
    
    //	public/core.js
    	
	var socket = io.connect('your server ip:port');
	//example var socket = io.connect('192.168.1.1:8080');


	//	app.js
	
	mongoose.connect('mongodb://localhost:27017/iBeaconCheckIn');
	mongoose.connect('mongodb://ip:27017/iBeaconCheckIn');


Start啟動
===
iOS

    iBeacon_AutoCheckIn.xcworkspace

Server

    ./start


<hr>
<h1>Screen Shot</h1>

<h2>Web</h2>
<img src="web.png" width='600'></img>
<hr>

<h2>Chat Room</h2>
<img src="chat.png" width='600'></img>
<hr>

<h2>iOS</h2>
<img src="iphone.png" width='400'></img>
<hr>

Now my server is running on ARM (NanoPc T1)   
<img src="arm_node.jpg" width='400'></img>

<hr>

<h2>Library used</h2>

<h4>iOS</h4>
    
    socket.IO-objc   
    SocketRocket   
    AFNetworking   
    JSMessagesViewController
<h4>Server/Web</h4>
    
Node.js modules

    express 
    socket.io
    mongoose
   
Client/Web

	angular.js
	jquery
	bootstrap
	socket.io
	
	
	
	
	