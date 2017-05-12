/**
 * Objet JSON représentant l'état 'load'
 */
var menuState = {
    /**
     * créé les différents éléments du menu
     */
    create: function () {
        menuEventSender.connect();
        menuEventSender.registerPseudo(pseudo);
        
        var backgroundColor = game.stage.backgroundColor = '#FFFFFF';
        var backgroundImage = game.add.image(0, 0, 'fond');
        backgroundImage.width = game.width;
        backgroundImage.height = game.height;
        var nameLabel = game.add.text(20, 20, 'Flap.io', { font: "30px Cooper Black", fill: "#000000" });
        var nbJoueursLabel = game.add.text(20, 100, "", { font: "20px Arial", fill: "#000000" });
        var gameReadyToStartLabel = game.add.text(20, 230, "", { font: "20px Arial", fill: "#000000" });

        menuEventSender.newPlayer();

        processMenuEvent.updateNbPlayer(nbJoueursLabel);
        processMenuEvent.gameReadyToStart(gameReadyToStartLabel);
        processMenuEvent.startTheGame();
    },
    /**
     * Démarre l'état 'play'
     */
    start: function () {
        game.state.start('play');
    }
};