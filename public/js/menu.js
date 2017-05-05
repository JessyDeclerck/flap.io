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
        // Envoi du message pour demande nombre de joueur 
        socket.emit('newPlayer');
        // Recuperation du nombre de joueurs
        socket.on('updateNbPlayer', function (nbPlayers) {
        nbJoueursLabel.setText("Il y a " + nbPlayers + " joueur(s) en attente");
    });
    
    socket.on('jouer', function(bool){
        console.log("bool : " + bool)
        if (bool == 'oui'){
            game.state.start('play');
        }
        else{
            alert("En attente de joueur ...");
        }
    });

    button = game.add.button(game.world.centerX, game.world.centerY, 'bouton_1', this.demande_jouer, this, 2, 1, 0);
    },

    // Demande au serveur autorisation de lancer la partie
    demande_jouer : function(){
        socket.emit('possible_game');
    },

    // Lancement de la partie
    start : function(){
       game.state.start('play');
    },
};