var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
})

.post('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

io.sockets.on('connection', function(socket){

    socket.on('nouveau_client', function(pseudo){
        socket.pseudo = pseudo;
        socket.emit('nouveau_client', pseudo);
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    socket.on('nouveau_message', function(message){
        socket.emit('nouveau_message', {pseudo : socket.pseudo, message : message});
        socket.broadcast.emit('nouveau_message', {pseudo : socket.pseudo, message : message});
    });
});


server.listen(8080, '0.0.0.0');