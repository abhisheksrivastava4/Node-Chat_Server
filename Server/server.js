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

    socket.on('disconnect',(socket)=>{
        console.log('user was disconnected');
    })
});    

server.listen(port,()=>{
    console.log(`server up on port ${port}`);
});