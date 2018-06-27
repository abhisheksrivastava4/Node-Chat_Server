var socket = io();
socket.on('connect', function () {
    console.log('connected to server');
})

socket.on('disconnect',function () {
    console.log('disconnected to server');
})


socket.on('newMessage',function (Message) {
    console.log('New Message:', Message);
})

//socket.emit('createMessage',{
// from: 'abhi@example.com',
// text: 'Yup, that works for me'
//});