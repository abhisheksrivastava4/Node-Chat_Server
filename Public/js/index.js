var socket = io();
socket.on('connect', function () {
    console.log('connected to server');
})

socket.on('disconnect', function () {
    console.log('disconnected to server');
})


socket.on('newMessage', function (Message) {
    var template = jQuery('#message-template').html();
    var formattedTime = moment(Message.createdAt).format('h:mm a');
    var html = Mustache.render(template,{
    text: Message.text,
    from: Message.from,
    createdAT: formattedTime
  });
   jQuery('#messages').append(html);
})

socket.on('newLocationMessage', function (Message) {
    var formattedTime = moment(Message.createdAT).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        from: Message.from,
        url: Message.url,
        createdAT: formattedTime
    })
    jQuery('#messages').append(html);
})

var messageTextBox = jQuery('[name=message]')

jQuery('#Message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val('');
    })
})

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return (alert('Geo Location not supported by your browser'));
    }
 
locationButton.attr('disabled','disabled').text('Sending location');    
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location'); 
        socket.emit('createLocationMessage', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send location');;
        console.log('Unable to fetch location');
    })
})