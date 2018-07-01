const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const { generateMessage, generateLocationMessage } = require('./Utils/Message');
const { isRealString } = require('./Utils/validation')

const port = process.env.PORT || 3000;

const app = new express();
var server = http.createServer(app);
var io = socketIO(server);

var fullPath = path.join(__dirname, '../Public');

app.use(express.static(fullPath));

io.on('connection', (socket) => {
    console.log('New User Connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {

            callback('Name and room are required properties')
        }
        socket.join(params.room);
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    })

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