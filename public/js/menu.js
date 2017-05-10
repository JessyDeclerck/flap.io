var menuState = {
    pseudoPlayer: null,
    create: function () {
        socket.connect();
        var backgroundColor = game.stage.backgroundColor = '#FFFFFF';
        var backgroundImage = game.add.image(0, 0, 'fond');
        backgroundImage.width = game.width;
        backgroundImage.height = game.height;
        var nameLabel = game.add.text(20, 20, 'Flap.io',
            { font: "30px Cooper Black", fill: "#000000" });
        // var infoLabel = game.add.text(20, 450, 'En cours de jeu, ESC pour Quitter',
        //     { font: "18px Arial", fontWeight: 'bold', fill: "#000000" });
        //affichage nombre joueur
        var nbJoueursLabel = game.add.text(20, 100, "",
            {
                font: "20px Arial",
                fill: "#000000"
            });

        var gameReadyToStartLabel = game.add.text(20, 230, "",
            {
                font: "20px Arial",
                fill: "#000000"
            });
        socket.emit('newPlayer');
        socket.on('updateNbPlayer', function (nbPlayers) {
            nbJoueursLabel.setText("La partie démarrera lorsqu'il \ny aura assez de joueurs\n\nIl y a " + nbPlayers + " joueur(s) en attente");
            if (nbPlayers > 1)
                nbJoueursLabel.setText("La partie peut commencer\n\n\nIl y a " + nbPlayers + " joueurs en attente");
            //joueur = joueur + message;
        });
        socket.on('gameReadyToStart', function (timeLeft) {
            gameReadyToStartLabel.setText("La partie va démarrer dans : " + timeLeft + "",
                {
                    font: "20px Arial",
                    fill: "#000000"
                });
        });
        socket.on('gameCancelled', function () {
            gameReadyToStartLabel.setText();
        });

        //button = game.add.button(game.world.centerX, game.world.centerY, 'bouton_1', this.start, this, 2, 1, 0);

    },
    start: function () {
        socket.emit('gameStarted');
        game.state.start('play');
    }
};

socket.on('startTheGame', function () {
    console.log("starting game");
    menuState.start();
});