var express = require('express');
var app = express();
var socket = require('socket.io');
var mongo = require('mongodb').MongoClient;
var port = process.env.PORT || 4000;
var server = app.listen(port, function(){
    console.log('Listening on port ', port);
});

app.use(express.static('public'));

var io = socket(server);

mongo.connect('mongodb://127.0.0.1:27017/mongochat', function(err, db){
    if(err) throw err;
    console.log('mongodb connected');

    //connect to socket.io
    io.on('connection', function(socket){
        console.log('Made socket connection', socket.id);
        let chat = db.collection('chats');

        //create function to send status
        sendStatus = function(s){
            io.sockets.emit('status', s);
        }

        //Get chat from collection
        chat.find().limit(100).sort({_id: 1}).toArray(function(err, res){
            if (err) throw err;
            
            io.sockets.emit('output', res);
        });

        socket.on('chat', function(data){
            let handle = data.handle || 'Anonymous';
            let message = data.message || ' ';           
            
            chat.insert({handle: handle, message: message}, function(){
                io.sockets.emit('chat', data);
            })
        });

        socket.on('typing', function(data){
            socket.broadcast.emit('typing', data);
        });
    });
    
});



