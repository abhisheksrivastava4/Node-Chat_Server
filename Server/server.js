const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const port = process.env.PORT || 3000;

const app = new express();

var server = http.createServer(app);
var io = socketIO(server);

var fullPath =   path.join(__dirname ,'../Public');

app.use(express.static(fullPath)); 

io.on('connection',(socket)=>{
    console.log('New User Connected');

//    socket.emit('newMessage',{  
//        from: 'abhishek.srivastava4@gmail.com',
//        text: 'Hi, how r you?',
//        date: 26/06/2018
//      });
    socket.emit('newMessage',{
        from : 'Admin',
        text : 'Welcome to the chat app',
        date: new Date().getTime()
    });  

    socket.broadcast.emit('newMessage',{
        from : 'Admin',
        text : 'New User Joined',
        date: new Date().getTime() 
    }); 

    socket.on('createMessage',(Message)=>{
        console.log('Create Message:',Message);
        io.emit('newMessage',{
            from: Message.from,
            text: Message.text,
            date: new Date().getTime()
        });
    });
    socket.on('disconnect',(socket)=>{
        console.log('user was disconnected');
    })
});  


server.listen(port,()=>{
    console.log(`server up on port ${port}`);
});