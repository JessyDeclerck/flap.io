/**
 * Objet JSON permettant d'envoyer des ordres et des données au serveur
 * Cet objet est destiné à être utilisé dans une partie en cours
 */
var playEventSender = {
    /**
     * Demande au serveur d'envoyer la liste des joueurs existants
     */
    getExistingPlayers: function () { socket.emit('getExistingPlayers'); },
    /**
     * Indique au serveur de mettre à jour le score du joueur
     * @param score score du joueur
     */
    updateScore: function (score) { socket.emit('updateScore', score); },
    /**
     * Indique au serveur que le joueur a sauté
     */
    jump: function () { socket.emit('jump'); },
    /**
     * Envoie la position du joueur
     * @param bird objet JSON représentant la position du joueur
     */
    sendBirdPosition: function (bird) {
        var birdPosition = { x: null, y: null };
        birdPosition.x = bird.x;
        birdPosition.y = bird.y;
        if (bird.alive)
            socket.emit('sendBirdPosition', birdPosition);
    },
    /**
     * Indique au serveur que le personnage du joueur doit être détruit
     */
    destroyMe: function () { socket.emit('destroyMe'); },
}

/**
 * Objet JSON permettant de traiter les ordres reçus du serveur
 * Cet objet est destiné à être utilisé dans une partie en cours
 */
var processPlayEvent = {
    /**
     * Ajoute un personnage au jeu
     */
    addBirdPlayer: function () {
        /**
         * Événement associé à l'ajout d'un personnage
         * @param player le joueur à qui ajouter un personnage
         */
        socket.on('addBirdPlayer', function (player) {
            if (playState.gameStarted)
                playState.addOneBird(player);
        });
    },
    /**
     * Détruit un personnage du jeu
     */
    destroyBird: function () {
        /**
         * Événement associé à la destruction d'un personnage
         * @param idPlayer identifiant du joueur dont le personnage doit être détruit
         */
        socket.on('destroyBird', function (idPlayer) {
            if (playState.gameStarted) {
                var birdPlayerToDestroy = playState.birds.get(idPlayer);
                if (birdPlayerToDestroy != null) {
                    birdPlayerToDestroy.kill();
                }
            }
        });
    },
    /**
     * Fait sauter un personnage
     */
    aPlayerJumped: function () {
        /**
         * Événement associé au saut d'un personnage
         * @param player le joueur dont le personnage doit sauter
         */
        socket.on('aPlayerJumped', function (player) {
            if (playState.gameStarted)
                playState.makePlayerJump(player);
        });
    },
    /**
     * Ajoute des obstacles au jeu
     */
    newHole: function () {
        /**
         * Événement associé à l'ajout d'obstacles au jeu
         * @param hole position du passage qui doit être créé dans les obstacles
         */
        socket.on('newHole', function (hole) {
            if (playState.gameStarted)
                playState.addRowOfPipes(hole);
        });
    },
    /**
     * Arrête le jeu
     */
    gameOver: function () {
        /**
         * Événement associé à l'arrêt du jeu
         * @param players map des joueurs qui étaient en jeu
         */
        socket.on('gameOver', function (players) {
            playState.gameOver(players);
        });
    }
}