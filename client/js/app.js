var $ = global.jQuery = require('jquery');
var io = require('socket.io-client');
var moment = require('moment');
var socket = global.socket = io();

// UI elements
var $form = $('#message-form');
var $messages = $('#messages');
var $input = $form.find('input');

// User and room data
var userRoom = getQueryVariable('room') || 'public';
var username = getQueryVariable('username') || 'Anonymous';

$('#room-name').text(userRoom);

// Setup socket.io
socket.on('connect', function () {
    console.log('Connected to socket.io server.');
    socket.emit('joinRoom', {
        username: username,
        room: userRoom
    });
});
socket.on('message', function (data) {
    console.log('New message:', data.text);
    var timestamp = moment.utc(data.timestamp).local().format('MMM do, h:mm:ss a');
    $messages.append('' +
        '<span class="small-font italic">' + timestamp + ': </span>' +
        '<span class="small-font italic bold">' + data.username + ': </span>' +
        '<span>' + data.text + '</span>' +
        '<br>')
});

// Submit new message
$form.on('submit', function (event) {
    event.preventDefault();
    var message = $input.val().trim();
    if (message.length) {
        socket.emit('message', {
            username: username,
            text: message
        });
        $input.val('');
    }
});

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    query = query.replace(/\+/g, ' ');
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return undefined;
}