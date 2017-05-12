/**
 * Objet JSON permettant d'envoyer des ordres et des données au serveur
 * Cet objet est destiné à être utilisé dans le menu du jeu
 */
var menuEventSender = {
    /**
     * Indique au serveur d'enregistrer le pseudo du joueur en mémoire
     * @param pseudo pseudo du joueur
     */
    registerPseudo: function (pseudo) { socket.emit('registerPseudo', pseudo); },
    /**
     * Initie la connexion entre le client et le serveur
     */
    connect: function () { socket.connect(); },
    /**
     * Indique au serveur qu'un joueur a rejoint
     */
    newPlayer: function () { socket.emit('newPlayer'); },
};

/**
 * Objet JSON permettant de traiter les ordres reçus du serveur
 * Cet objet est destiné à être utilisé dans le menu du jeu
 */
var processMenuEvent = {
    /**
     * Met à jour le label du nombre de joueurs
     * @param labelToUpdate Le label à mettre à jour
     */
    updateNbPlayer: function (labelToUpdate) {
        /**
         * Événement associé à la mise à jour du label
         * @param nbPlayers le nombre de joueurs
         */
        socket.on('updateNbPlayer', function (nbPlayers) {
            labelToUpdate.setText("La partie démarrera lorsqu'il \ny aura assez de joueurs\n\nIl y a " + nbPlayers + " joueur en attente");
            if (nbPlayers > 1)
                labelToUpdate.setText("La partie peut commencer\n\n\nIl y a " + nbPlayers + " joueurs en attente");
        });
    },
    /**
     * Met à jour le label indiquant le temps restant avant que la part ne démarre
     * @param labelToUpdate
     */
    gameReadyToStart: function (labelToUpdate) {
        /**
         * Événement associé à la mise à jour du label
         * @param timeLeft le temps restant avant que la partie commence
         */
        socket.on('gameReadyToStart', function (timeLeft) {
            labelToUpdate.setText("La partie va démarrer dans : " + timeLeft + "", { font: "20px Arial", fill: "#000000" });
        });
    },
    /**
     * Indique au jeu de démarrer la partie
     */
    startTheGame: function () {
        /**
         * Événement associé au démarrage du jeu
         */
        socket.on('startTheGame', function () {
            menuState.start();
        });
    }
}