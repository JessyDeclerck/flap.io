var loadState = {

    preload: function(){
        var CheminComplet = document.location.href;
        var ip;
        if (CheminComplet.includes("http://")){
            temp= CheminComplet.substring(7, CheminComplet.length);
            ip = temp.substring(0, temp.indexOf('/'));
        }
        else if (CheminComplet.includes("https://")){
            temp= CheminComplet.substring(8, CheminComplet.length);
            ip = temp.substring(0, temp.indexOf('/'));
        }
        // connection a la socket du serveur
        socket = io.connect(ip);
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