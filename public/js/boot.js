/**
 * Objet JSON représentant l'état 'boot'
 */
var bootState = {
    /**
     * Fonction appelée lors de la création de l'état 'boot'
     * Démarre notamment le moteur physique du jeu
     */
    create: function () {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.disableVisibilityChange = true;
        game.state.start('load');

    }

};