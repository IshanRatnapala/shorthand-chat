var PORT = process.env.PORT || 3000;
var express = require('express');
var socket = require('socket.io');
var app = express();

/* Start Express */
var server = require('http').Server(app);

/* Start Socket */
var io = socket(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log('User connected via socket.io');

    socket.on('message', function (message) {
        console.log('Message received', message.text);
        io.emit('message', message);
    });

    socket.emit('message', {
        text: 'Welcome to Shorthand Chat'
    });
});

server.listen(PORT, function () {
    console.log('Server started on port', PORT);
});