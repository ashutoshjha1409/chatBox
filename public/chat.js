var socket = io.connect('http://localhost:4000');

//elements
var handle = document.getElementById('handle')
  , message =  document.getElementById('message')
  , btn = document.getElementById('send')
  , output = document.getElementById('output')
  , feedback = document.getElementById('feedback');

//event handlers
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value,
        id: socket.id
    });
    message.value = "";
});

message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
});


//Listeners
socket.on('chat', function(data){
    console.log("socket id", socket.id, data.id);
    feedback.innerHTML = "";
    output.innerHTML += '<p class="'+(socket.id == data.id ? 'right-align' : '' )+'"><strong>' + data.handle + ': </strong>' + data.message + '</p>';   
});

socket.on('typing', function(data){
    feedback.innerHTML = '</p><em>' + data + ' is typing...</em></p>';
});