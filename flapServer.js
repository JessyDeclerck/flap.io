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
var clients = new Map();

io.sockets.on('connection', function (socket) {
    var client = {
        id : socket.id,
        inGame : false,
        bird : {x : null, y : null},
        isAlive : false
    };
    clients.set(client.id, client);

    socket.on('newPlayer', function () {
        console.log("un joueur a rejoint le jeu")
        io.sockets.emit('updateNbPlayer', io.engine.clientsCount);
    });

     socket.on('disconnect', function () {
         console.log("un joueur s'est déconnecté")
        clients.delete(socket.id);
        io.sockets.emit('updateNbPlayer', io.engine.clientsCount);
        io.sockets.emit('destroyBird', socket.id);
        //envoyer message pour delete oiseau
    });

    socket.on('playerBird', function(birdPosition){
        var player = clients.get(socket.id);
        player.bird = birdPosition;
        
        io.sockets.emit('updateDisplayedBirds', Array.from(clients));
    });
    socket.on('gameStarted', function(){
        console.log("game started")
        clients.get(socket.id).inGame = true;
        clients.get(socket.id).isAlive = true;
        io.sockets.emit('addBirdPlayer', Array.from(clients));
    });
    socket.on('destroyMe', function(){
        console.log("demande d'autodestruction");
        clients.get(socket.id).isAlive = false;
        io.sockets.emit('destroyBird', socket.id);
    });
    socket.on('returnToMenu', function(){
        clients.get(socket.id).inGame = false;
        clients.get(socket.id).isAlive = false;
    });

});

httpServer.listen(8095);