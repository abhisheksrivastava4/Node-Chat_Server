const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const { generateMessage, generateLocationMessage } = require('./Utils/Message');

const port = process.env.PORT || 3000;

const app = new express();

var server = http.createServer(app);
var io = socketIO(server);

var fullPath = path.join(__dirname, '../Public');

app.use(express.static(fullPath));

io.on('connection', (socket) => {
    console.log('New User Connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

    socket.on('createMessage', (Message, callBack) => {
        console.log('Create Message:', Message);
        io.emit('newMessage', generateMessage(Message.from, Message.text));
        callBack();
    });
    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.long));
    })
    socket.on('disconnect', (socket) => {
        console.log('user was disconnected');
    })
});


server.listen(port, () => {
    console.log(`server up on port ${port}`);
});