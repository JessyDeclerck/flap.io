var winState = {
    create : function(){
        var compteur = 10;
        
        var backgroundColor = game.stage.backgroundColor = '#FFFFFF';
        var backgroundImage = game.add.image(0,0, 'fond');
        var nameLabel = game.add.text(20, 20, 'Flap.io', 
                                        { font: "30px Cooper Black", fill: "#000000" })
        
        var playerState = game.add.text(20, 100, "PERDU !!!!!!!!", 
                                        { font: "50px Arial", 
                                        fill: "#000000" });
        var compteRebour = game.add.text(20, 200, "Restart in " + compteur + " second(s)", 
                                        { font: "20px Arial", 
                                        fill: "#000000" });
        time_1 = setInterval(function(){
                            compteur -= 1;
                            compteRebour.setText("Restart in " + compteur + " second(s)");
                            if (compteur == 0){
                                clearInterval(time_1);
                                game.state.start('menu');
                            }}
                             , 1500);
        
    },
};

