module.exports = {
    run: function (httpServer) {
        var io = require('socket.io').listen(httpServer);

        io.sockets.on('connection', function (socket) {
            var player = {
                id: socket.id,
                inGame: false,
                bird: { x: null, y: null },
                isAlive: false,
                score: 0,
                pseudo: null,
                spectator: false
            };

            ev.setIO(io);

            ev.setPlayer(player);

            socket.on('registerPseudo', function (pseudo) { player.pseudo = pseudo });

            socket.on('newPlayer', function () { ev.joinGame(socket, player) });

            socket.on('updateScore', function (score) { player.score = score });

            socket.on('disconnect', function () { ev.destroyPlayer(player) });

            socket.on('jump', function () { socket.broadcast.emit('aPlayerJumped', player); });

            socket.on('sendBirdPosition', function (birdPosition) { player.bird = birdPosition; });

            socket.on('gameStarted', function () { ev.addPlayerToTheGame(player) });

            socket.on('getExistingPlayers', function () { ev.sendExistingPlayers(socket, player); });

            socket.on('destroyMe', function () { ev.destroyBird(player) });

            socket.on('returnToMenu', function () { ev.resetPlayer(player) });

        });

    }
}

var ev = require('./processingEvents.js');