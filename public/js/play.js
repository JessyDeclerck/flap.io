
var playState = {
        bird : null,
        otherBird : null,
        pipes : null,
        score : 0,
        labelScore : null,
        preload : function() {
            this.pipes = game.add.group();
        },
        create: function() { 
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", 
                                        { font: "30px Arial", fill: "#ffffff" });        
        game.stage.backgroundColor = '#2DB2FF';
        // Initialisation de la physique du jeu et du sprite
        game.physics.startSystem(Phaser.Physics.ARCADE); 
        //var timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        this.bird = game.add.sprite(100, 245, 'bird');
        this.otherBird =  game.add.sprite(-100,-100,'bird_2');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        // Gestion des touches du clavier
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        var escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escKey.onDown.add(this.leave, this);
        socket.emit('start_game');
    },
    

    addOnePipe: function(x, y, socket) {
        this.pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(this.pipe);
        game.physics.arcade.enable(this.pipe);
        this.pipe.body.velocity.x = -200; 
        this.pipe.checkWorldBounds = true;
        this.pipe.outOfBoundsKill = true;
    },
        // Fonction fabrication des obstacles verticaux
    addRowOfPipes: function() {
        //socket.emit('giveMeNewPipes');
         
        //var hole = Math.floor(Math.random() * 5) + 1;
        // Quand apparition d'une colonne, le score augmente de 1
          
    },

    addRowPipes_1: function(hole){   
        console.log(hole);
        //this.labelScore.text = this.score++;
            for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(400, i * 60 + 10);  
        
    },
    
    jump: function() {
    // Puissance de la vélocité
        this.bird.body.velocity.y = -315;
    },
        update: function() {
           var birdToUpdate = this.otherBird;
        //envoi des informations concernant le personnage du joueur au server
        socket.on('updateDisplayedBirds', function(otherBirdPosition){
            birdToUpdate.x = otherBirdPosition.x;
            birdToUpdate.y = otherBirdPosition.y;
        });
        var birdPosition = { x : null, y : null};
        birdPosition.x = this.bird.x;
        birdPosition.y = this.bird.y;
        socket.emit('playerBird', birdPosition);
        // Conditions de game over   
        if (this.bird.y < 0 || this.bird.y > 490)
            this.restartGame();
        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
    },

    // Fonction retour au menu
        leave: function(){
         game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
         game.state.start('menu');
    },

    // Fonction restart
        restartGame: function() {
           game.state.start('play');
    },
};

socket.on('newPipes', function(hole){
    console.log(hole);
    playState.addRowPipes_1(hole);
});