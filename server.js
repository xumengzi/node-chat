var express = require('express');

var app = require('express')();
var http = require('http').Server(app);
var { readUser, writeUser } = require('./login/index');
var path = require('path');
var io = require('socket.io')(http);
var bodyParser = require("body-parser");

var userDir = `${__dirname}/login/user.json`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/chat', function(req, res){
	res.sendFile(__dirname + '/index.html')
});

app.get('/login', function(req, res){
	res.sendFile(__dirname + '/login.html')
});

app.post('/chat/login', function(req, res) {
	const { userName, userKey} = req.body;
	if(userName && userKey) {
		writeUser(userDir, req.body);
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
		var users = readUser(userDir);
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

// 通过user-key获取消息记录
app.post('/chat/getMessage', function(req, res) {
	const { userName, userKey} = req.body;
	var mesDir = `${__dirname}/history/${userKey}.json`;
	console.log('json', mesDir);
	try {
		var messages = readUser(mesDir);
		var messageRes = {
			success: true,
			message: '数据获取成功',
			code: 200,
			data: JSON.parse(messages || '')
		};
		res.send(messageRes);
	} catch (error) {
		console.log('消息获取失败', error);
	}
});

// 通过user-key写入每一条消息
app.post('/chat/setMessage', function(req, res) {
	const { userName, userKey, userMessage} = req.body;
	var mesDir = `${__dirname}/history/${userKey}.json`;
	console.log('userMessage', userMessage);
	try {
		var messages = readUser(mesDir);
		var lastMess = JSON.parse(messages)
		lastMess.push(userMessage);
		writeUser(mesDir, lastMess, 'utf-8');
		var messageRes = {
			success: true,
			message: '数据保存成功',
			code: 200,
		};
		res.send(messageRes);
	} catch (error) {
		console.log('消息获取失败', error);
	}
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.send(500, 'Something broke!');
});


io.on('connection', function(socket){
	console.log('connected');

	socket.on('join', function(name){
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