/**
 * Objet JSON représentant l'état 'win'
 */
var winState = {
    //map des joueurs
    players: null,
    /**
     * Initialise et trie la map des joueurs selon leur score
     * @param players map des joueurs
     */
    setPlayers: function (players) {
        //on trie la liste selon les scores
        this.players = new Map(players.sort(function (p1, p2) {
            //players est un tableau de tableau pour pouvoir transmettre le contenu d'une map en JSON
            return p2[1].score - p1[1].score;
        }));
    },
    /**
     * Passe le jeu à l'état 'menu'
     */
    leave: function () {
        game.state.start('menu');
    },
    create: function () {

        var escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escKey.onDown.add(this.leave, this);

        var backgroundColor = game.stage.backgroundColor = '#FFFFFF';
        var backgroundImage = game.add.image(0, 0, 'fond');
        backgroundImage.width = game.width;
        backgroundImage.height = game.height;

        var nameLabel = game.add.text(20, 20, 'Flap.io', { font: "30px Cooper Black", fill: "#000000" });
        var infoLabel = game.add.text(20, 450, 'Appuyez ici pour rejouer', { font: "18px Arial", fontWeight: 'bold', fill: "#000000" });
        var posName = 100;

        infoLabel.inputEnabled = true;
        infoLabel.events.onInputDown.add(this.leave, this);

        this.players.forEach(function (player) {
            if (!player.spectator) {
                game.add.text(20, posName, player.pseudo + " : " + player.score,
                    { font: "14px Arial", fontWeight: 'bold', fill: "#000000" });
                posName += 25;
            }
        });
        //on se déconnecte du jeu
        socket.disconnect();
    }
};