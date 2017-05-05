var winState = {
    score: null,
    status : null,
    compteRebour : null,
    compteur: 10,
    create : function(){
      
        var backgroundColor = game.stage.backgroundColor = '#FFFFFF';
        var backgroundImage = game.add.image(0,0, 'fond');
        var nameLabel = game.add.text(20, 20, 'Flap.io', 
                                        { font: "30px Cooper Black", fill: "#000000" });
        
        var playerState = game.add.text(20, 100, "FIN DU JEU !!!!", 
                                        { font: "50px Arial", 
                                        fill: "#000000" });
        this.compteRebour = game.add.text(20, 200, "", 
                                        { font: "20px Arial", 
                                        fill: "#000000" });
        this.score = game.add.text(20, 250, "", 
                                        { font: "20px Arial", 
                                        fill: "#000000" });
        this.status = game.add.text(20, 300, "", 
                                        { font: "20px Arial", 
                                        fill: "#000000" });

        socket.emit('mon_score');
        socket.emit('autre_joueur');

    },
    ton_score : function(valeur){
        this.score.setText("Your score : " + valeur);
    },

    status_autre_joueur: function(enjeu){
        this.status.setText(enjeu);
    },

    restart: function (){
        compteRebour = this.compteRebour;
        compteur = this.compteur;
        time_1 = setInterval(function(){
                        compteur -= 1;
                        compteRebour.setText("Restart in " + compteur + " second(s)");
                        if (compteur == -1){
                            clearInterval(time_1);
                            game.state.start('menu');
                        }
                    }, 1500)

    },
};

socket.on('autre_joueur_status', function(statut){
            console.log("statut enjeu : " + statut.enjeu);
            if (statut.enjeu == true){
                enjeu = "Player is in game : wait";
            }
            else{
                enjeu = "Player score : " + statut.score;
            }
            console.log("update status");
            winState.status_autre_joueur(enjeu);
                
});
socket.on('ton_score', function(valeur){
                winState.ton_score(valeur); 
});

socket.on('restart', function(){
                winState.restart(); 
});

