var loadState = {

    preload: function(){
        game.load.image('bird', 'bird.png');
        game.load.image('pipe', 'pipe.png');
        game.load.image('fond', 'fond.png'); 
        game.load.image('bouton_1', 'bouton_1.png');

        var loadingLabel = game.add.text("loading...");

    },

    create: function(){
        game.state.start('menu');
    }

};