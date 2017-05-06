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

function generateHole(){
    hole = Math.floor(Math.random() * 5) + 1;
    io.sockets.emit('newHole', hole);
}


//cette fonction n'est activable qu'une seule fois
var sendHoles = (function() {
    var executed = false;
    return function () {
        if (!executed) {
            executed = true;
            setInterval(generateHole, 1500);
        }
    };
})();

io.sockets.on('connection', function (socket) {
    var client = {
        id: socket.id,
        inGame: false,
        bird: { x: null, y: null },
        isAlive: false
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

    socket.on('jump', function () {
        socket.broadcast.emit('aPlayerJumped', socket.id);
    });

    socket.on('sendBirdPosition', function (birdPosition) {
        var player = clients.get(socket.id);
        player.bird = birdPosition;

    });
    socket.on('gameStarted', function () {
        console.log("game started")
        var newPlayer = clients.get(socket.id);
        newPlayer.inGame = true;
        newPlayer.isAlive = true;
        //envoyer seulement le nouveau client
        io.sockets.emit('addBirdPlayer', newPlayer);
        sendHoles();
        
    });
    socket.on('getExistingPlayers', function () {
        //on copie la map pour ne pas modifier l'originale
        var existingPlayers = new Map(clients);
        //on se retire de la map
        existingPlayers.delete(socket.id);
        existingPlayers.forEach(function (player, key, map) {
            if (!player.inGame)
                map.delete(player);
        });
        socket.emit('addExistingPlayers', Array.from(existingPlayers));
    });
    socket.on('destroyMe', function () {
        console.log("demande d'autodestruction");
        clients.get(socket.id).isAlive = false;
        io.sockets.emit('destroyBird', socket.id);
    });
    socket.on('returnToMenu', function () {
        var clientToUpdate = clients.get(socket.id);
        if (clientToUpdate != null) {
            clientToUpdate.inGame = false;
            clientToUpdate.isAlive = false;
            clientToUpdate.bird.x = null;
            clientToUpdate.bird.y = null;
        }
    });

});

httpServer.listen(8095);