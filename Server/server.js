const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const { generateMessage, generateLocationMessage } = require('./Utils/Message');
const { isRealString } = require('./Utils/validation')
const {Users} = require('./Utils/users'); 

const port = process.env.PORT || 3000;

const app = new express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

var fullPath = path.join(__dirname, '../Public');

app.use(express.static(fullPath));

io.on('connection', (socket) => {
    console.log('New User Connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {

            callback('Name and room are required properties')
        }
        socket.join(params.room);

        users.removeUser(socket.id);
        users.addUser(socket.id, params.name,params.room);

        io.to(params.room).emit('updateUserList',users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    })

    socket.on('createMessage', (Message, callBack) => {
        var user = users.getUser(socket.id);
        if(user && isRealString(Message.text)){
        io.to(user.room).emit('newMessage', generateMessage(user.name, Message.text));
        }
        callBack();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if(user){
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lat, coords.long));
        }
    });
    
    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if(user)
        {
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left.`));
        }
    });
});

server.listen(port, () => {
    console.log(`server up on port ${port}`);
});