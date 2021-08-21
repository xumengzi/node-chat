var express = require('express');

var app = require('express')();
var http = require('http').Server(app);
var { readUser, writeUser } = require('./login/index');
var path = require('path');
var io = require('socket.io')(http);
var bodyParser = require("body-parser");

var userDir = `${__dirname}/login/user.json`;
var userMesdir = `${__dirname}/history/userMessage.json`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/chat', function(req, res){
	res.sendFile(__dirname + '/index.html')
});

app.get('/login', function(req, res){
	res.sendFile(__dirname + '/login.html')
});

// 登录接口
app.post('/chat/login', function(req, res) {
	const { userName, userKey} = req.body;
	if(userName && userKey) {
		// 读取用户信息
		var userObj = readUser(userDir) || '{}';
		console.log('userObj', userObj);
		userObj = JSON.parse(userObj) || {};
		userObj[userKey] = userName;
		// 写入用户信息
		writeUser(userDir, userObj);
		// 写入当前用户个人信息
		writeUser(userMesdir, '');
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

// 判断是否登录接口
app.post('/chat/isLogin', function(req, res) {
	const { userName, userKey} = req.body;
	if(userName && userKey) {
		// 已经登录
		const isLogin = checkIsLogin(userKey, userName);
		if( isLogin) {
			res.send({
				success: true,
				message: '已经登录了',
				code: 200
			});
		}else{
			writeUser(userMesdir, JSON.stringify([]));
			res.send({
				success: true,
				message: '自动为您创建目录',
				userName,
				code: 201
			});
		}
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
	const isLogin = checkIsLogin(userKey, userName);
	if(isLogin) {
		try {
			var messages = readUser(userMesdir) || '[]';
			var messageRes = {
				success: true,
				message: '数据获取成功',
				code: 200,
				data: JSON.parse(messages)
			};
			res.send(messageRes);
		} catch (error) {
			console.log('消息获取失败', error);
			res.send({
				success: false,
				message: '获取失败' + error,
				code: 200,
			});
		}
	}else{
		res.send({
			success: false,
			message: '获取失败',
			code: 200,
		});
	}
});

// 获取所有成员
app.post('/chat/getAllChats', function(req, res) {
	const { userName, userKey} = req.body;
	const isLogin = checkIsLogin(userKey, userName);
	if(isLogin) {
		try {
			var users = readUser(userDir) || '[]';
			console.log('users', users);
			var messageRes = {
				success: true,
				message: '数据获取成功',
				code: 200,
				data: JSON.parse(users)
			};
			res.send(messageRes);
		} catch (error) {
			console.log('消息获取失败', error);
			res.send({
				success: false,
				message: '获取失败' + error,
				code: 200,
			});
		}
	}else{
		res.send({
			success: false,
			message: '获取失败',
			code: 200,
		});
	}
});

function checkIsLogin(userKey, userName) {
	// read users
	var users = JSON.parse(readUser(userDir));
	return userKey && users[userKey] == userName;
}

// 通过user-key写入每一条消息
app.post('/chat/setMessage', function(req, res) {
	const { userName, userKey, userMessage} = req.body;
	const isLogin = checkIsLogin(userKey, userName);
	if(isLogin) {
		try {
			var messages = readUser(userMesdir) || '[]';
			console.log('messages==========', messages);
			var lastMess = JSON.parse(messages) || [];
			console.log('lastMess', lastMess);
			userMessage.userKey = userKey;
			lastMess.push(userMessage);
			writeUser(userMesdir, lastMess, 'utf-8');
			var messageRes = {
				success: true,
				message: '数据保存成功',
				code: 200,
			};
			res.send(messageRes);
		} catch (error) {
			var messageRes = {
				success: true,
				message: '保存失败' + error,
				code: 200,
			};
			res.send(messageRes);
		}
	}else{
		var messageRes = {
			success: true,
			message: '保存失败',
			code: 200,
		};
		res.send(messageRes);
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
		console.log('obj----join', name);
		io.emit('join', name);
	});

	socket.on('message', function(obj){
		console.log('obj----emit', obj);
		io.emit('message', obj);
	})
})

var ip = '127.0.0.1' || '192.168.0.113';

http.listen(3333, ip, function(){
	console.log('listening on port 3333')
})