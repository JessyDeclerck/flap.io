var game = new Phaser.Game(400, 490, Phaser.CANVAS);
var temps = 0;
var joueur = 0;
var texte = '';
var depart = false;

// Création de la vue de départ 
var splashState = {
    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
        game.load.image('fond', 'fond.png'); 
        game.load.image('bouton_1', 'bouton_1.png');
    },
    create : function(){
        console.log('go');
        game.stage.backgroundColor = '#FFFFFF';
        game.add.image(0,0, 'fond');
        this.message = game.add.text(20, 20, 'IMT Bird Multi', 
                                        { font: "30px Cooper Black", fill: "#000000" })
        this.message = game.add.text(20, 450, 'En cours de jeu, ESC pour Quitter', 
                                        { font: "18px Arial", fontWeight: 'bold', fill: "#000000" })
        //affichage nombre joueur
        socket.emit('message', 'joueur');
        socket.on('message', function (message) {
            console.log('joueur : ' + message);
            texte = game.add.text(20, 100, "Il y a " + message + " joueur(s) en attente", 
                                        { font: "20px Arial", 
                                        fill: "#000000" })
            joueur = joueur + message;
        })
        
        button = game.add.button(game.world.centerX, game.world.centerY, 'bouton_1', this.actionOnClick, this, 2, 1, 0);

    },

    update: function(){
        socket.on('new_player', function (message){
                console.log('update');
                texte.setText("Il y a " + message + " joueur(s) en attente");
                joueur = message;
        })

        socket.on('depart', function (message){
            console.log('depar'+depart);
            if (depart == false){
                game.state.start('main');
                depart = true;
            }
                
        })

    },

    actionOnClick : function  () {
        if (joueur <2){
            alert('La partie ne peux pas etre lancée, attendre un deuxieme joueur');
            console.log('nbre joueur : ' + joueur);
        }
        else {
            socket.emit('jouer')
            //game.physics.arcade.overlap(this.button, this.message, this.texte);
            //game.state.start('main');
        }
    },
};

// Création de la vue du jeu
var mainState = {

    // pre-loading des images
    preload: function() {  
        game.load.image('bird', 'bird.png');
        game.load.image('pipe', 'pipe.png');
        this.pipes = game.add.group(); 
    },

    // Création de toutes les variables, sprites, physiques etc.
    create: function() { 
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", 
                                        { font: "30px Arial", fill: "#ffffff" });        
        game.stage.backgroundColor = '#2DB2FF';
        // Initialisation de la physique du jeu et du sprite
        game.physics.startSystem(Phaser.Physics.ARCADE); 
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        this.bird = game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        socket.on('message', function (message) {
            this.message = game.add.text(20, 100, message, 
                                        { font: "20px Arial", fill: "#000000" })
        })
        // Gestion des touches du clavier
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        var escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escKey.onDown.add(this.quitter, this);
        
    },

    addOnePipe: function(x, y) {
        
        var pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);
        game.physics.arcade.enable(pipe);
        pipe.body.velocity.x = -200; 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    // Fonction fabrication des obstacles verticaux
    addRowOfPipes: function() {
        var hole = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(400, i * 60 + 10);  
        // Quand apparition d'une colonne, le score augmente de 1
        this.score += 1;
        socket.emit('message', 'score : '+ this.score);
        // Mise a jour du score sur l'écran
        this.labelScore.text = this.score;  
    },

    jump: function() {
    // Puissance de la vélocité
        this.bird.body.velocity.y = -315;
    },

    update: function() {
        // Calcul de la fréquence de l'envoi de la position du joueur au serveur
        temps += 1;
        if (temps == 10){
            socket.emit('position', this.bird.y) ;
            temps = 0;
        }

        // Conditions de game over   
        if (this.bird.y < 0 || this.bird.y > 490)
            this.restartGame();
        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
    },

    // Fonction retour au menu
    quitter: function(){
        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
        game.state.start('splashScreen');
    },

    // Fonction restart
    restartGame: function() {
        game.state.start('main');
    },
};

// connection a la socket du serveur
socket = io.connect('172.27.84.48:8095');
socket.on('message', function (message) {   
    socket.emit('message', 'ok') ; // envoi message ok  
})

// Initialisation de la phase splashScreen
game.state.add('splashScreen', splashState);
game.state.add('main', mainState);
// Execution de la phase splashScreen
game.state.start('splashScreen');
