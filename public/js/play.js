/**
 * Objet JSON représentant l'état 'play'
 * Il permet de définir et d'intéragir avec la partie en cours
 */
var playState = {
    idPlayer: null, //id du joueur utilisant le client
    bird: null, //personnage du joueur
    pipes: null, //obstacles
    birds: null, //ensemble des personnages
    score: 0, //score du joueur
    labelScore: null,
    gameStarted: false, //état de la partie (en cours ou non)
    /**
     * Initialisations des variables de l'objet
     */
    preload: function () {
        this.pipes = game.add.group();
        this.birds = new Map();
    },
    create: function () {
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
        game.stage.backgroundColor = '#2DB2FF';
        // Initialisation de la physique du jeu
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Gestion des touches du clavier et souris
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        game.input.onDown.add(this.jump, this);
        //Initialisation de variables de l'objet
        this.gameStarted = true;
        this.idPlayer = socket.id;

        playEventSender.getExistingPlayers();
    },
    /**
     * Ajoute un personnage au jeu
     * @param player joueur à qui ajouter un personnage
     */
    addOneBird: function (player) {
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
        //on vérifie si le personnage ajouté est celui contrôlé par le client
        if (player.id == this.idPlayer) {
            this.bird = this.birds.get(this.idPlayer);
            this.game.debug.renderPhysicsBody(this.bird.body);
        }
        else { //on ajoute une transparence et une teinte aléatoire aux personnages non contrôlés
            newBird.tint = getRandomColor();
            newBird.alpha = 0.2;
        }
    },
    /**
     * Ajoute un bloc au jeu
     * @param x abcisse du bloc
     * @param y ordonnée du bloc
     */
    addOnePipe: function (x, y) {
        this.pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(this.pipe);
        game.physics.arcade.enable(this.pipe);
        this.pipe.body.velocity.x = -200;
        this.pipe.checkWorldBounds = true;
        this.pipe.outOfBoundsKill = true;
    },
    /**
     * Ajoute une série de blocs au jeu
     */
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
    /**
     * Fait sauter le personnage contrôlé par le joueur
     */
    jump: function () {
        // Puissance de la vélocité
        if (this.bird != null && this.bird.alive) {
            this.bird.body.velocity.y = -315;
            playEventSender.jump();
        }
    },
    /**
     * Boucle de mise à jour du jeu (appelée 60 fois/seconde)
     */
    update: function () {
        if (this.bird != null) {
            //envoi des informations concernant le personnage du joueur au server
            playEventSender.sendBirdPosition(this.bird);
            // Conditions de game over
            game.physics.arcade.overlap(this.bird, this.pipes, this.destroyMe, null, this);//colision avec les obstacles
            if ((this.bird.y < 0 || this.bird.y > 490) && this.bird.alive)
                this.destroyMe();
        }
    },
    /**
     * Indique au serveur que le joueur a perdu
     */
    destroyMe: function () { playEventSender.destroyMe() },
    /**
     * Fait sauter un personnage
     * @param player joueur dont le personnage doit sauter
     */
    makePlayerJump: function (player) {
        //correction position joueur
        var birdToUpdate = this.birds.get(player.id);
        birdToUpdate.x = player.bird.x;
        birdToUpdate.y = player.bird.y;
        birdToUpdate.body.velocity.y = -315;
    },
    /**
     * Termine le jeu et passe à l'écran des scores
     * @param players liste des joueurs à afficher sur l'écran des scores
     */
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

/**
 * génére le code héxadécimal d'une couleur aléatoire
 * @return code hexadécimal
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}