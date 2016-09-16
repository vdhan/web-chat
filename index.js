var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static(path.join(__dirname, 'static')));
const PORT = 8082;

app.get('/', function(req, res) {
	res.sendFile('index.html');
});

var users = {};
io.on('connection', function(socket) {
	socket.on('connected', function(name, fn) {
		var idx = socket.id;
		users[idx] = name;
		fn(users);

		socket.broadcast.emit('connected', {
			msg: `${name} connected`,
			id: idx,
			name: name
		});
	});

	socket.on('send message', function(data) {
		socket.broadcast.emit('broadcast', `${data.from}: ${data.msg}`);
	});

	socket.on('disconnect', function() {
		var idx = socket.id;
		var name = users[idx];
		delete users[idx];

		io.emit('disconnect', {
			msg: `${name} disconnected`,
			id: idx
		});
	});
});

http.listen(PORT, function() {
	console.log('Listen on', PORT);
});