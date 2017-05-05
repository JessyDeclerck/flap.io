var express = require('express');
var http = require('http');
var app = express();
var httpServer = http.createServer(app);
var controller = require('./routes');
var start = false;
var time = null;
var joueurs = [];
var player = {};
var NOMBRE_JOUEUR_PAR_PARTIE = 2;
player.id = null;
player.score = 0;
player.enjeu = false;
//faire un controller pour les routes et architecture REST
controller.setPaths(app);

app.use(express.static('public'));
// Chargement de socket.io
var io = require('socket.io').listen(httpServer);

// Fonction calcul des pipes 
function myFunc(){
    hole = Math.floor(Math.random() * 5) + 1;
    console.log(hole);
    io.sockets.emit('newPipes', hole);
}

// Initialisation de la socket
io.sockets.on('connection', function (socket) {

    // Connection d'un client
    socket.on('newPlayer', function () {
        nouveau = true;
        // Test si socket du client est déja dans la liste des joueurs
        for (var i =0; i<(joueurs.length); i++){
            if(joueurs[i].id == socket.id){
                nouveau = false;
            }
        }
        // Si nouveau on ajoute
        if (nouveau == true && joueurs.length< 3){
            console.log("nouveau joueur");
                var player = {}
                player.id = socket.id;
                player.score = 0;
                player.enjeu = false;
                joueurs.push(player);
                for (var i =0; i<(joueurs.length); i++){
                    console.log("joueur " + i + ":"+ joueurs[i].id);
                }
        } 
        io.sockets.emit('updateNbPlayer', joueurs.length);
    });

    // Si deconnection d'un client
     socket.on('disconnect', function () {
         console.log("un joueur s'est déconnecté")
         for (var i =0; i<(joueurs.length); i++){ 
        }
         for (var i =0; i<(joueurs.length); i++){
             if(joueurs[i].id == socket.id){
                 joueurs.splice(i, i+1);
             }
        io.sockets.emit('updateNbPlayer', joueurs.length);
         }
    });

    // Demande d'un joueur si possible de commencer partie
    socket.on('possible_game',function(){
        if (joueurs.length < NOMBRE_JOUEUR_PAR_PARTIE){
            socket.emit('jouer', 'non'); // Emission nok pour le joueur demandeur
        }
        else{
            io.sockets.emit('jouer', 'oui'); // Emission ok pour tous les joueurs
        }
    });

    // Interception de la demande d'envoi de l'adversaire
    socket.on('autre_joueur',function(){
        for (var i =0; i<(joueurs.length); i++){
                if(joueurs[i].id != socket.id){
                    // envoi de l'objet joueur
                    socket.emit('autre_joueur_status', joueurs[i]);
                }
            }
    });

    // Stockage du score du joueur
    socket.on('score', function (valeur) {
        for (var i =0; i<(joueurs.length); i++){
             if(joueurs[i].id == socket.id){
                if (valeur>0){
                    joueurs[i].score = valeur -=1;
                }
                else{
                    joueurs[i].score = valeur;
                }
             }
        }
    });

    // Envoi du score au joueur
    socket.on('mon_score', function () {
        for (var i =0; i<(joueurs.length); i++){
             if(joueurs[i].id == socket.id){
                 console.log('envoie du score : ' + joueurs[i].score);
                socket.emit('ton_score', joueurs[i].score);
             }
        }
    });

     // Message envoyé aux joueurs lors du commencement du jeu (play.js)
    socket.on('start_game', function (){
        console.log('start_game');
        if (start == false){
            for (var i =0; i<(joueurs.length); i++){
                joueurs[i].enjeu = true;
            }
            time_ = setInterval(myFunc, 1500);
            start = true;   
        }
    });

    // Detection de la fin d'une partie d'un joueur
    socket.on('stop_game', function(){
        console.log("stop game");
        for (var i =0; i<(joueurs.length); i++){
            //console.log('joueur i: ' + joueurs[i].id + " socket id: " + socket.id);
             if(joueurs[i].id == socket.id){
                 joueurs[i].enjeu = false;
             }
        }
        en_jeu = false;
        for (var i =0; i<(joueurs.length); i++){   
                    if (joueurs[i].enjeu != false){
                            en_jeu = true;
                    }
        }
        // Si plus de joueurs en jeu, arret de l'envoi des pipes et envoi 
        // du message de restart au joueurs
        if (en_jeu == false) {
            clearInterval(time_);
            start= false;
            io.sockets.emit('restart');
            nbre_joueur = 0;
        } 
    });

    socket.on('playerBird', function(birdPosition){
        socket.broadcast.emit('updateDisplayedBirds', birdPosition);
    });    
});

httpServer.listen(8095);