//on définie l'état bootState
var bootState = {

    create: function(){

        game.physics.startSystem(Phaser.Physics.ARCADE); 
        game.stage.disableVisibilityChange = true;
        game.state.start('load');

    }

};