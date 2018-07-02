var socket = io();

function scrollToBottom () {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
  
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
      messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search);
    console.log(params);
    socket.emit('join',params,function(err){
       if(err){
        alert('Name and room are required properties');
        window.location.href='/';
       }
       else
       {
        console.log('No Error');
       }
    });
})


socket.on('disconnect', function () {
    console.log('Disconnected from server');
})

socket.on('updateUserList', function(users){
   var ol = jQuery('<ol></ol>')
   users.forEach(function(user) {
     ol.append(jQuery('<li></li>').text(user));  
   });
   jQuery('#Users').html(ol);
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
   scrollToBottom();
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
    scrollToBottom();
})

var messageTextBox = jQuery('[name=message]')

jQuery('#Message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
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