var winState = {
    players: null,
    setPlayers: function (players) {
        this.players = new Map(players);
    },
    leave: function () {
        game.state.start('menu');
    },
    create: function () {
        socket.disconnect();
        var escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escKey.onDown.add(this.leave, this);
        var backgroundColor = game.stage.backgroundColor = '#FFFFFF';
        var backgroundImage = game.add.image(0, 0, 'fond');
        var nameLabel = game.add.text(20, 20, 'Flap.io',
            { font: "30px Cooper Black", fill: "#000000" });
        var infoLabel = game.add.text(20, 450, 'En cours de jeu, ESC pour Quitter',
            { font: "18px Arial", fontWeight: 'bold', fill: "#000000" });
        var posName = 100;

        this.players.forEach(function (player) {
            game.add.text(20, posName, player.id + " : " + player.score,
                { font: "14px Arial", fontWeight: 'bold', fill: "#000000" });
            posName += 25;
        });
    }
};