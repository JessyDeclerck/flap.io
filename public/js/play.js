
var playState = {
        bird : null,
        pipes : null,
        birds : null,
        score : 0,
        labelScore : null,
        preload : function() {
            this.pipes = game.add.group();
            this.birds = new Map();
        },
        create: function() {
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", 
                                        { font: "30px Arial", fill: "#ffffff" });        
        game.stage.backgroundColor = '#2DB2FF';
        // Initialisation de la physique du jeu et du sprite
        game.physics.startSystem(Phaser.Physics.ARCADE); 
        var timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        this.bird = game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        // Gestion des touches du clavier
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        var escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escKey.onDown.add(this.leave, this);
        console.log('gameStarted');
        socket.emit('gameStarted');

    },
    addOneBird: function(player){
        if(this.birds.get(player.id) == null){
        var newBird = game.add.sprite(player.bird.x, player.bird.y, 'bird');
        
            this.birds.set(player.id, newBird);
        }
    },
    addOnePipe: function(x, y) {
        this.pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(this.pipe);
        game.physics.arcade.enable(this.pipe);
        this.pipe.body.velocity.x = -200; 
        this.pipe.checkWorldBounds = true;
        this.pipe.outOfBoundsKill = true;
    },
        // Fonction fabrication des obstacles verticaux
    addRowOfPipes: function() {
        var hole = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(400, i * 60 + 10);  
        // Quand apparition d'une colonne, le score augmente de 1
        this.labelScore.text = this.score++;  
    },
        jump: function() {
    // Puissance de la vélocité
        this.bird.body.velocity.y = -315;
    },
        update: function() {
        //envoi des informations concernant le personnage du joueur au server
        var birdPosition = { x : null, y : null};
        birdPosition.x = this.bird.x;
        birdPosition.y = this.bird.y;
        socket.emit('playerBird', birdPosition);
        // Conditions de game over   
        if (this.bird.y < 0 || this.bird.y > 490)
            this.destroyMe();
        game.physics.arcade.overlap(this.bird, this.pipes, this.destroyMe, null, this);
    },
    destroyMe : function(){
        console.log("demande d'autodestruction");
        socket.emit('destroyMe');
    },

    // Fonction retour au menu
        leave: function(){
         socket.emit('returnToMenu');
         this.destroyMe();
         game.physics.arcade.overlap(this.bird, this.pipes, this.destroyMe, null, this);
         game.state.start('menu');
    },

    // Fonction restart
        restartGame: function() {
           game.state.start('play');
    },
};
//ordres serveurs

    socket.on('addBirdPlayer', function(clients){
        var mapPlayers = new Map(clients);
        //on se retire de la map
        var mySelf = mapPlayers.get(socket.id);

        if(mySelf.inGame){
            mapPlayers.delete(socket.id);

            mapPlayers.forEach(function(player){
                //vérifier si joueur mort
                console.log(player);
                if(player.isAlive){
                    playState.addOneBird(player);
                    console.log("ajout d'un oiseau");
                }
            });
        }
    });
    socket.on('updateDisplayedBirds', function(clients){
        if(playState.birds != null){
            var mapPlayers = new Map(clients);
            var mySelf = mapPlayers.get(socket.id);
            if(mySelf.inGame){
                mapPlayers.delete(socket.id);
                mapPlayers.forEach(function(player) {
                    if(player.inGame){
                        birdToUpdate = playState.birds.get(player.id);
                        if(birdToUpdate != null){
                            playState.birds.get(player.id).x = player.bird.x;
                            playState.birds.get(player.id).y = player.bird.y;
                        }
                    }
                });
            }
        }
    });

    socket.on('destroyBird', function(idPlayer){
        console.log("tentative de destruction");
        if(playState.bird != null){
            if(playState.birds != null){
                var playerToDestroy = playState.birds.get(idPlayer);
                if(playerToDestroy != null){
                    playerToDestroy.destroy();
                    playState.birds.delete(idPlayer);
                    console.log("suppression d'un oiseau");
                }
            }
            if(socket.id == idPlayer){
                console.log("autodestruction");
                playState.bird.destroy();
                playState.bird.x = 0;
                playState.bird.y = 0;
                playState.birds.delete(idPlayer);
        }
        }

    });