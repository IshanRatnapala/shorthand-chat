var PORT = process.env.PORT || 3000;
var express = require('express');
var socket = require('socket.io');
var app = express();

/* Start Express */
var server = app.listen(PORT, function () {
    console.log('Server started on port', PORT);
});
/* Start Socket */
var io = socket.listen(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', function () {
    console.log('User connected via socket.io');
});
