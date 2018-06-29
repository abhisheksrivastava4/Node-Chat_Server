var socket = io();
socket.on('connect', function () {
    console.log('connected to server');
})

socket.on('disconnect', function () {
    console.log('disconnected to server');
})


socket.on('newMessage', function (Message) {
    var formattedTime = moment(Message.createdAT).format('h:mm a');
    console.log('New Message:', Message);
    var li = jQuery('<li></li>');
    li.text(`${Message.from} ${formattedTime}: ${Message.text}`);
    jQuery('#messages').append(li);
})

socket.on('newLocationMessage', function (Message) {
    var formattedTime = moment(Message.createdAT).format('h:mm a');
    console.log('New Message:', Message);
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank"> My current location</a>')
    li.text(`${Message.from} ${formattedTime}:`);
    a.attr('href', Message.url);
    li.append(a);
    jQuery('#messages').append(li);
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