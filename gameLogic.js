/**
 * Module destiné à réceptionner les messages envoyés par le client
 * ce module redirige ensuite les données reçues vers un module chargé du traitement
 * à la manière d'un controller
 */
module.exports = {
    /**
     * Ecoute certains événements
     * @param httpServer serveur Http devant écouter les événements
     */
    run: function (httpServer) {
        var io = require('socket.io').listen(httpServer);

        /**
         * Événement se déclenchant lors de la connexion d'un client
         * @param socket socket créé
        */
        io.sockets.on('connection', function (socket) {
            //JSON représentant un joueur
            var player = {
                id: socket.id,
                inGame: false,
                bird: { x: null, y: null },
                isAlive: false,
                score: 0,
                pseudo: null,
                spectator: false
            };
            //initialisation du module de traitement des évenements
            ev.setIO(io);
            ev.setPlayer(player);

            socket.on('registerPseudo', function (pseudo) { player.pseudo = pseudo });

            socket.on('newPlayer', function () { ev.joinGame(socket, player) });

            socket.on('updateScore', function (score) { player.score = score });

            socket.on('disconnect', function () { ev.destroyPlayer(player) });

            socket.on('jump', function () { socket.broadcast.emit('aPlayerJumped', player); });

            socket.on('sendBirdPosition', function (birdPosition) { player.bird = birdPosition; });

            //socket.on('readyToPlay', function () { ev.addPlayerToTheGame(player) });

            socket.on('getExistingPlayers', function () { ev.sendExistingPlayers(socket); });

            socket.on('destroyMe', function () { ev.destroyBird(player) });

            socket.on('returnToMenu', function () { ev.resetPlayer(player) });

        });

    }
}

var ev = require('./processingEvents.js');