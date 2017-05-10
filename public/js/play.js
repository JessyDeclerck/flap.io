var playState = {
    idPlayer: null,
    bird: null,
    pipes: null,
    birds: null,
    score: 0,
    labelScore: null,
    gameStarted: false,
    preload: function () {
        this.pipes = game.add.group();
        this.birds = new Map();
    },
    create: function () {
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
        game.stage.backgroundColor = '#2DB2FF';
        // Initialisation de la physique du jeu et du sprite
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Gestion des touches du clavier et souris
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        game.input.onDown.add(this.jump, this);
        this.gameStarted = true;
        this.idPlayer = socket.id;
        //seulement si player spectateur
        playEventSender.getExistingPlayers();
    },
    addOneBird: function (player) {
        //factoriser cette fonction
        var birdPlayer = player.bird;
        var newBird;
        //si nouveau joueur, la position de l'oiseau est null
        if (birdPlayer.x != null)
            newBird = game.add.sprite(player.bird.x, player.bird.y, 'bird'); //on affiche le joueur à sa position actuelle
        else
            newBird = game.add.sprite(90, 200, 'bird');

        this.birds.set(player.id, newBird);

        game.physics.arcade.enable(newBird);
        newBird.height = newBird.height / 10;
        newBird.width = newBird.width / 10;
        newBird.body.gravity.y = 1000;

        if (player.id == this.idPlayer)
            this.bird = this.birds.get(this.idPlayer);
        else {
            newBird.tint = getRandomColor();
            newBird.alpha = 0.2;
        }
    },
    addOnePipe: function (x, y) {
        this.pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(this.pipe);
        game.physics.arcade.enable(this.pipe);
        this.pipe.body.velocity.x = -200;
        this.pipe.checkWorldBounds = true;
        this.pipe.outOfBoundsKill = true;
    },
    // Fonction fabrication des obstacles verticaux
    addRowOfPipes: function (hole) {
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * 60 + 10);
        // Quand apparition d'une colonne, le score augmente de 1
        if (this.bird != null && this.bird.alive) {
            playEventSender.updateScore(this.score);
            this.labelScore.text = this.score++;
        }
    },
    jump: function () {
        // Puissance de la vélocité
        if (this.bird != null && this.bird.alive) {
            this.bird.body.velocity.y = -315;
            playEventSender.jump();
        }
    },
    update: function () {
        if (this.bird != null) {
            //envoi des informations concernant le personnage du joueur au server
            playEventSender.sendBirdPosition(this.bird);
            // Conditions de game over
            game.physics.arcade.overlap(this.bird, this.pipes, this.destroyMe, null, this);
            if ((this.bird.y < 0 || this.bird.y > 490) && this.bird.alive)
                this.destroyMe();
        }
    },
    destroyMe: function () { playEventSender.destroyMe() },
    makePlayerJump: function (player) {
        //correction position joueur
        var birdToUpdate = this.birds.get(player.id);
        birdToUpdate.x = player.bird.x;
        birdToUpdate.y = player.bird.y;
        birdToUpdate.body.velocity.y = -315;
    },
    gameOver: function (players) {
        this.gameStarted = false;
        winState.setPlayers(players);
        game.state.start('win');
    }
};

//ordres serveurs
processPlayEvent.addBirdPlayer();
processPlayEvent.aPlayerJumped();
processPlayEvent.newHole();
processPlayEvent.destroyBird();
processPlayEvent.gameOver();

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}