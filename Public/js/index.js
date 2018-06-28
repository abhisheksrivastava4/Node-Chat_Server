var socket = io();
socket.on('connect', function () {
    console.log('connected to server');
})

socket.on('disconnect',function () {
    console.log('disconnected to server');
})


socket.on('newMessage',function (Message) {
    console.log('New Message:', Message);
    var li = jQuery('<li></li>');
    li.text(`${Message.from}: ${Message.text}`);
    jQuery('#messages').append(li);
})

socket.on('newLocationMessage',function (Message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank"> My current location</a>')
    li.text(`${Message.from}: `);
    a.attr('href',Message.url);
    li.append(a);
    jQuery('#messages').append(li);
})

jQuery('#Message-form').on('submit',function (e){
  e.preventDefault();
  socket.emit('createMessage',{
    from: 'User',
    text: jQuery('[name=message]').val()
   },function (){
   })
})

var locationButton = jQuery('#send-location');
locationButton.on('click',function (){
    if(!navigator.geolocation){
       return(alert('Geo Location not supported by your browser'));
    }
    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage',{
            lat: position.coords.latitude,
            long: position.coords.longitude
        });
    }, function(){
        console.log('Unable to fetch location');
    })
})