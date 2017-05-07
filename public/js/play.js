
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
        this.labelScore = game.add.text(20, 20, "0",
            { font: "30px Arial", fill: "#ffffff" });
        game.stage.backgroundColor = '#2DB2FF';
        // Initialisation de la physique du jeu et du sprite
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // var timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        // Gestion des touches du clavier
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        game.input.onDown.add(this.jump, this); // pointer will contain the pointer that activated this event}
        var escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escKey.onDown.add(this.leave, this);
        console.log('gameStarted');
        this.gameStarted = true;
        socket.emit('gameStarted');
        this.idPlayer = socket.id;
        socket.emit('getExistingPlayers');
    },
    addOneBird: function (player) {
        //on vérifie que le joueur n'est pas déjà dans la map avant d'ajouter
        var birdPlayer = player.bird;
        var newBird;
        //si nouveau joueur, la position de l'oiseau est null
        if (birdPlayer.x != null)
            newBird = game.add.sprite(player.bird.x, player.bird.y, 'bird'); //on affiche le joueur à sa position actuelle
        else
            newBird = game.add.sprite(90, 200, 'bird');


        this.birds.set(player.id, newBird);
        //on verifie si l'oiseau est celui contrôlé par le joueur
        //init physics of bird

        game.physics.arcade.enable(newBird);
        newBird.body.gravity.y = 1000;
        if (player.id == this.idPlayer)
            this.bird = this.birds.get(this.idPlayer);
        else
            newBird.alpha = 0.5;
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
        if (this.bird.alive) {
            socket.emit('updateScore', this.score);
            this.labelScore.text = this.score++;

        }
    },
    jump: function () {
        // Puissance de la vélocité
        if (this.bird.alive) {
            this.bird.body.velocity.y = -315;
            socket.emit('jump');
        }
    },
    update: function () {
        if (this.bird != null) {
            //envoi des informations concernant le personnage du joueur au server
            var birdPosition = { x: null, y: null };
            birdPosition.x = this.bird.x;
            birdPosition.y = this.bird.y;
            if (this.bird.alive)
                socket.emit('sendBirdPosition', birdPosition);
            // Conditions de game over
            game.physics.arcade.overlap(this.bird, this.pipes, this.destroyMe, null, this);
            if ((this.bird.y < 0 || this.bird.y > 490) && this.bird.alive)
                this.destroyMe();
        }
    },
    destroyMe: function () {
        socket.emit('destroyMe');
    },

    // Fonction retour au menu
    leave: function () {

        if (this.bird.alive)
            this.destroyMe(this.score);
        this.gameStarted = false;
        socket.emit('returnToMenu');
        game.state.start('menu');
    },

    // Fonction restart
    restartGame: function () {
        game.state.start('play');
    },
    makePlayerJump: function (player) {
        //correction position joueur
        console.log("updating position");
        this.birds.get(player.id).x = player.bird.x;
        this.birds.get(player.id).y = player.bird.y;
        this.birds.get(player.id).body.velocity.y = -315;
    },
    gameOver: function () {
        this.gameStarted = false;
        game.state.start('win');
    }
};

//ordres serveurs
socket.on('addBirdPlayer', function (player) {
    if (playState.gameStarted)
        playState.addOneBird(player);
});

//décaler vers JSON
socket.on('addExistingPlayers', function (players) {
    var mapPlayers = new Map(players);
    mapPlayers.forEach(function (player) {
        if (player.isAlive)
            playState.addOneBird(player);
    });
});

//décaler vers JSON
socket.on('destroyBird', function (idPlayer) {
    if (playState.gameStarted) {
        var birdPlayerToDestroy = playState.birds.get(idPlayer);
        if (birdPlayerToDestroy != null) {
            birdPlayerToDestroy.kill();
        }
    }
});

socket.on('aPlayerJumped', function (player) {
    if (playState.gameStarted)
        playState.makePlayerJump(player);
});

socket.on('newHole', function (hole) {
    if (playState.gameStarted)
        playState.addRowOfPipes(hole);
});

socket.on('gameOver', function (players) {
    winState.setPlayers(players);
    playState.gameOver();
});
