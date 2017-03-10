var $ = global.jQuery = require('jquery');
var io = require('socket.io-client');
var socket = global.socket = io();

// UI elements
var $form = $('#message-form');
var $messages = $('#messages');
var $input = $form.find('input');

// Setup socket.io
socket.on('connect', function (socket) {
    console.log('Connected to socket.io server.');
});
socket.on('message', function (data) {
    console.log('New message:', data.text);

    $messages.append('<p>' + data.text + '</p>')
});

// Submit new message
$form.on('submit', function (event) {
    event.preventDefault();
    var message = $input.val().trim();
    if (message.length) {
        socket.emit('message', {
            text: message
        });
        $input.val('');
    }
});