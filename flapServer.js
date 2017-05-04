var express = require('express');
var http = require('http');
var app = express();
var httpServer = http.createServer(app);
var controller = require('./routes');

//faire un controller pour les routes et architecture REST
controller.setPaths(app);

app.use(express.static('public'));
// Chargement de socket.io
var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function (socket) {

    socket.on('newPlayer', function () {
        console.log("un joueur a rejoint le jeu")
        io.sockets.emit('updateNbPlayer', io.engine.clientsCount);
    });

     socket.on('disconnect', function () {
         console.log("un joueur s'est déconnecté")
        io.sockets.emit('updateNbPlayer', io.engine.clientsCount);
    });

    socket.on('playerBird', function(birdPosition){
        socket.broadcast.emit('updateDisplayedBirds', birdPosition);
    });

});

httpServer.listen(8095);