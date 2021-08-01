var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

app.get('/chat', function(req, res){
	res.sendFile(__dirname+ '/index.html')
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.send(500, 'Something broke!');
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

var ip = '192.168.0.112';

http.listen(3000, ip, function(){
	console.log('listening on port 3000')
})