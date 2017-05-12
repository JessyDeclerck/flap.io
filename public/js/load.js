/**
 * Objet JSON représentant l'état 'load'
 */
var loadState = {
    /**
     * Fonction appelée avant create
     * permet de charger les ressources nécessaires
     */
    preload: function () {
        var assets = "assets/";
        game.load.image('bird', assets + 'bird.png');
        game.load.image('pipe', assets + 'pipe.png');
        game.load.image('fond', assets + 'background.png');
        game.load.image('bouton_1', assets + 'bouton_1.png');

        var loadingLabel = game.add.text("loading...");
    },
    /**
     * Démarre l'état 'menu'
     */
    create: function () {
        game.state.start('menu');
    }

};