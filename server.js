var PORT = process.env.PORT || 3000;
var express = require('express');
var socket = require('socket.io');
var moment = require('moment');
var app = express();

/* Start Express */
var server = require('http').Server(app);

/* Start Socket */
var io = socket(server);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function (socket) {
    console.log('User connected via socket.io');

    socket.on('disconnect', function () {
        var userData = clientInfo[socket.id];
        if (typeof userData != 'undefined') {
            socket.leave(userData.room);
            io.to(userData.room).emit('message', {
                username: 'System',
                text: userData.username + ' has left',
                timestamp: moment().valueOf()
            });
            delete clientInfo[socket.id];
        }
    });

    socket.on('joinRoom', function (req) {
        clientInfo[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
            username: 'System',
            text: req.username + ' has joined',
            timestamp: moment().valueOf()
        })
    });

    socket.on('message', function (message) {
        console.log('Message received', message.text);
        message.timestamp = moment().valueOf();
        io.to(clientInfo[socket.id].room).emit('message', message);
    });

    socket.emit('message', {
        username: 'System',
        text: 'Welcome to Shorthand Chat',
        timestamp: moment().valueOf()
    });
});

server.listen(PORT, function () {
    console.log('Server started on port', PORT);
});