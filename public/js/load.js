var loadState = {

    preload: function(){
        // connection a la socket du serveur
        socket = io.connect('172.27.93.73:8095');
        var assets = "assets/";
        game.load.image('bird', assets+'bird.png');
        game.load.image('pipe', assets+'pipe.png');
        game.load.image('fond', assets+'fond.png'); 
        game.load.image('bouton_1', assets+'bouton_1.png');

        var loadingLabel = game.add.text("loading...");

    },

    create: function(){
        game.state.start('menu');
    }

};