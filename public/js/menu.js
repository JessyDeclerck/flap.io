var menuState = {
    create : function(){
        var backgroundColor = game.stage.backgroundColor = '#FFFFFF';
        var backgroundImage = game.add.image(0,0, 'fond');
        var nameLabel = game.add.text(20, 20, 'Flap.io', 
                                        { font: "30px Cooper Black", fill: "#000000" })
        var infoLabel = game.add.text(20, 450, 'En cours de jeu, ESC pour Quitter', 
                                        { font: "18px Arial", fontWeight: 'bold', fill: "#000000" })
        //affichage nombre joueur
        var nbJoueursLabel = game.add.text(20, 100, "Il y a 0 joueur en attente", 
                                        { font: "20px Arial", 
                                        fill: "#000000" });
        socket.emit('newPlayer');
        socket.on('updateNbPlayer', function (nbPlayers) {
            
            nbJoueursLabel.setText("Il y a " + nbPlayers + " joueur(s) en attente");
            //joueur = joueur + message;
        });
        
        button = game.add.button(game.world.centerX, game.world.centerY, 'bouton_1', this.start, this, 2, 1, 0);

    },
    start : function(){
        game.state.start('play');
    }
};