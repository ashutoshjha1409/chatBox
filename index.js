var express = require('express');
var app = express();
var socket = require('socket.io');
//var mongo = require('mongodb').MongoClient;
var port = process.env.PORT || 4000;
var server = app.listen(port, function(){
    console.log('Listening on port ', port);
});

/*mongo.connect('mongodb://127.0.0.1:27017/mongochat', function(err, db){
    if(err) throw err;
    console.log('mongodb connected');
});
*/
app.use(express.static('public'));

var io = socket(server);

io.on('connection', function(socket){
    console.log('Made socket connection', socket.id);
    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
});

