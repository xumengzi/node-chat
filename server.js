var express = require('express');

var app = require('express')();
var http = require('http').Server(app);
var { readUser, writeUser } = require('./login/index');
var path = require('path');
var io = require('socket.io')(http);
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/chat', function(req, res){
	res.sendFile(__dirname + '/index.html')
});

app.post('/chat/login', function(req, res) {
	const { userName, userKey} = req.body;
	if(userName && userKey) {
		writeUser(`${__dirname}/login/user.json`, req.body);
		var dir = `${__dirname}/history/${req.body['userKey']}.json`;
		writeUser(dir, '');
		res.send({
			success: true,
			message: '登录成功',
			code: 200
		});
	}else{
		res.send({
			success: true,
			message: '登录失败',
			code: 200
		});
	}
});

app.post('/chat/isLogin', function(req, res) {
	const { userName, userKey} = req.body;
	console.log('req.body', req.body);
	if(userName && userKey) {
		var dir = `${__dirname}/login/user.json`;
		var users = readUser(dir);
		console.log('users', dir, users);
		res.send({
			success: true,
			message: '已经登录了',
			code: 200
		});
	}else{
		res.send({
			success: true,
			message: '还没有登录',
			code: 200
		});
	}
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

var ip = '127.0.0.1' || '192.168.0.113';

http.listen(3333, ip, function(){
	console.log('listening on port 3333')
})