var menuEventSender = {
    registerPseudo: function (pseudo) { socket.emit('registerPseudo', pseudo); },
    connect: function () { socket.connect(); },
    newPlayer: function () { socket.emit('newPlayer'); },
    gameStarted: function () { socket.emit('gameStarted'); },
};

var processMenuEvent = {
    updateNbPlayer: function (labelToUpdate) {
        socket.on('updateNbPlayer', function (nbPlayers) {
            labelToUpdate.setText("La partie démarrera lorsqu'il \ny aura assez de joueurs\n\nIl y a " + nbPlayers + " joueur en attente");
            if (nbPlayers > 1)
                labelToUpdate.setText("La partie peut commencer\n\n\nIl y a " + nbPlayers + " joueurs en attente");
        });
    },
    gameReadyToStart: function (labelToUpdate) {
        socket.on('gameReadyToStart', function (timeLeft) {
            labelToUpdate.setText("La partie va démarrer dans : " + timeLeft + "", { font: "20px Arial", fill: "#000000" });
        });
    },
    startTheGame: function () {
        socket.on('startTheGame', function () {
            menuState.start();
        });
    }
}