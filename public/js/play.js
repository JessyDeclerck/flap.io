
var playState = {
        bird : null,
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
        var timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        this.bird = game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        // Gestion des touches du clavier
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        var escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escKey.onDown.add(this.leave, this);
        
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