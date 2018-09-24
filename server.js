var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname+ '/index.html')
});

var userSocket = [];

io.on('connection', function(socket){
	console.log('connected');

	socket.on('join', function(name){
		// userSocket[name] = socket;
		io.emit('join', name);
	});

	socket.on('message', function(obj){
		io.emit('message', obj);
	})
})

var ip = '192.168.0.108';
http.listen(3000, ip, function(){
	console.log('listening on port 3000')
})