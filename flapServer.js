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
var nbPlayer;

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

var timer = null;
var gameStarted = false;
var startTimer = function(toExecute) {
        if (!toExecute) {
            gameStarted = true;
            
            //fonction anonyme pour pouvoir utiliser setInterval avec une fonction possèdant des paramètres
            timer = setInterval(function(){noticeGameStartingSoon()}, 1000);
        }
};

var timeLeft = 6;
var noticeGameStartingSoon = function(){
    timeLeft--;
    console.log("time before the launch of the game : " + timeLeft);
    if(timeLeft != 0)
        io.sockets.emit('gameReadyToStart', timeLeft);
    else{
        console.log("commencement des parties");
        io.sockets.emit('startTheGame');
        clearInterval(timer);
        timeLeft = 6;
        //clear interval
    }
};


io.sockets.on('connection', function (socket) {
    var client = {
        id: socket.id,
        inGame: false,
        bird: { x: null, y: null },
        isAlive: false,
        score : 0
    };
    clients.set(client.id, client);

    socket.on('newPlayer', function () {
        nbPlayer = io.engine.clientsCount;
        console.log("un joueur a rejoint le jeu")
        io.sockets.emit('updateNbPlayer', nbPlayer);

        if(nbPlayer > 1 && !gameStarted)
            startTimer(gameStarted);//l'état de gameStarted détermine si le timer doit être lancé ou non
        

    });

    socket.on('disconnect', function () {
        nbPlayer = io.engine.clientsCount;
        console.log("un joueur s'est déconnecté")
        clients.delete(socket.id);
        io.sockets.emit('updateNbPlayer', nbPlayer);
        io.sockets.emit('destroyBird', socket.id);
        //envoyer message pour delete oiseau
    });

    socket.on('jump', function () {
        //corriger position joueur
        var playerToUpdate =  clients.get(socket.id);
        socket.broadcast.emit('aPlayerJumped', playerToUpdate);
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
    socket.on('destroyMe', function (score) {
        console.log("demande d'autodestruction");
        var clientToUpdate = clients.get(socket.id);
        clientToUpdate.isAlive = false;
        clientToUpdate.score = score;
        io.sockets.emit('destroyBird', socket.id);
        isGameOver();
    });

    var getExistingPlayers = function(){
         var existingPlayers = new Map(clients);
        //on se retire de la map
        existingPlayers.delete(socket.id);
        existingPlayers.forEach(function (player, key, map) {
            if (!player.inGame)
                map.delete(player);
        });
        return existingPlayers;
    }

    var isGameOver = function(){
        var nbPlayersAlive = 0;
        clients.forEach(function(client){
            if(client.isAlive)
                nbPlayersAlive++;
        });
        if(nbPlayersAlive < 2){
            gameStarted = false; //envoyer signal fin de jeu -> tableau des scores
            console.log("partie terminée");
            //io.sockets.emit('')
        }
    };


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