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

function generateHole() {
    hole = Math.floor(Math.random() * 5) + 1;
    io.sockets.emit('newHole', hole);
}


//cette fonction n'est activable qu'une seule fois
var sendHoles = (function () {
    var executed = false;
    return function () {
        if (!executed) {
            executed = true;
            setInterval(generateHole, 1500);
        }
    };
})();

var timer = null;
var gameStarting = false;
var startTimer = function (toExecute) {
    if (!toExecute) {
        gameStarting = true;

        //fonction anonyme pour pouvoir utiliser setInterval avec une fonction possèdant des paramètres
        timer = setInterval(function () { noticeGameStartingSoon() }, 1000);
    }
};
var gameStarted = false;
var timeLeft = 11;
var noticeGameStartingSoon = function () {
    timeLeft--;
    console.log("time before the launch of the game : " + timeLeft);
    if (timeLeft != 0)
        io.sockets.emit('gameReadyToStart', timeLeft);
    else {
        gameStarted = true;
        console.log("commencement des parties");
        io.sockets.emit('startTheGame');
        console.log("signal envoyé");
        clearInterval(timer);
        timeLeft = 11;
    }
};


io.sockets.on('connection', function (socket) {
    var client = {
        id: socket.id,
        inGame: false,
        bird: { x: null, y: null },
        isAlive: false,
        score: 0,
        pseudo: null,
        spectator: false
    };
    clients.set(client.id, client);

    socket.on('registerPseudo', function (pseudo) {
        clients.get(socket.id).pseudo = pseudo;
    });

    socket.on('newPlayer', function (pseudoPlayer) {
        nbPlayer = io.engine.clientsCount;
        if (pseudoPlayer != null)
            clients.get(socket.id).pseudo = pseudoPlayer;
        console.log("un joueur a rejoint le jeu")
        io.sockets.emit('updateNbPlayer', nbPlayer);
        //voir comportement si rejoint pendant jeu en cours
        if (nbPlayer > 1 && !gameStarting)
            startTimer(gameStarting);//l'état de gameStarted détermine si le timer doit être lancé ou non
        if (gameStarted) {
            socket.emit('startTheGame');//rejoint en mode spectateur
            clients.get(socket.id).spectator = true;
        }

    });

    socket.on('updateScore', function (score) {
        console.log("updating score : " + socket.id + "  " + score);
        clients.get(socket.id).score = score;
    });

    socket.on('disconnect', function () {
        nbPlayer = io.engine.clientsCount;
        console.log("un joueur s'est déconnecté")

        clients.delete(socket.id);

        io.sockets.emit('updateNbPlayer', nbPlayer);
        io.sockets.emit('destroyBird', socket.id);
    });

    socket.on('jump', function () {
        //corriger position joueur
        var playerToUpdate = clients.get(socket.id);
        socket.broadcast.emit('aPlayerJumped', playerToUpdate);
    });

    socket.on('sendBirdPosition', function (birdPosition) {
        var player = clients.get(socket.id);
        if (player != null)
            player.bird = birdPosition;

    });
    socket.on('gameStarted', function () {
        console.log("game started")
        var newPlayer = clients.get(socket.id);
        if (newPlayer != null && !newPlayer.spectator) {
            newPlayer.inGame = true;
            newPlayer.isAlive = true;
        }
        //envoyer seulement le nouveau client
        if (!newPlayer.spectator)
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
        var clientToUpdate = clients.get(socket.id);
        clientToUpdate.isAlive = false;
        io.sockets.emit('destroyBird', socket.id);
        isGameOver();
    });


    var isGameOver = function () {
        var nbPlayersAlive = 0;
        clients.forEach(function (client) {
            if (client.isAlive)
                nbPlayersAlive++;
        });
        if (nbPlayersAlive < 1) {
            gameStarting = false; //envoyer signal fin de jeu -> tableau des scores
            gameStarted = false;
            console.log("partie terminée");
            io.sockets.emit('gameOver', Array.from(clients));
            clients = new Map();
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