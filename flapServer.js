var express = require('express');
var http = require('http');
var app = express();
var httpServer = http.createServer(app);
var controller = require('./routes');
var start = false;
var time = null;
var joueurs = [];
var player = {};
player.id = null;
player.score = 0;
player.enjeu = false;
//faire un controller pour les routes et architecture REST
controller.setPaths(app);

app.use(express.static('public'));
// Chargement de socket.io
var io = require('socket.io').listen(httpServer);


function myFunc(){
    hole = Math.floor(Math.random() * 5) + 1;
    console.log(hole);
    io.sockets.emit('newPipes', hole);
}

io.sockets.on('connection', function (socket) {

    socket.on('newPlayer', function () {
        nouveau = true;
        //if (joueurs.length != 0){
            //console.log('for' + joueurs.length);

        for (var i =0; i<(joueurs.length); i++){
            //console.log('joueur present : ' + joueurs[i] +" -> joueur nouveau : " + socket.id);
            if(joueurs[i].id == socket.id){
                //console.log("effectivement  nouveau joueur");
                nouveau = false;
            }
        }
        //}
        //console.log("nouveau : " + nouveau);
        if (nouveau == true && joueurs.length< 3){
            console.log("nouveau joueur");
            //console.log("les joueurs avant ajout: " + joueurs);
                //console.log("un joueur a rejoint le jeu");
                var player = {}
                player.id = socket.id;
                player.score = 0;
                player.enjeu = false;
                joueurs.push(player);
                for (var i =0; i<(joueurs.length); i++){
                    console.log("joueur " + i + ":"+ joueurs[i].id);
                }
                //console.log("les joueurs après ajout: " + joueurs);
            
        } 
        io.sockets.emit('updateNbPlayer', joueurs.length);
    });

     socket.on('disconnect', function () {
         console.log("un joueur s'est déconnecté")
         //console.log("les joueurs avant suppression : " + joueurs);
         for (var i =0; i<(joueurs.length); i++){
            //console.log (joueurs[i].id + "-> socket:" + socket.id); 
        }
         for (var i =0; i<(joueurs.length); i++){
             if(joueurs[i].id == socket.id){
                 joueurs.splice(i, i+1);
             }
        io.sockets.emit('updateNbPlayer', joueurs.length);
        //console.log("les joueurs aprés suppression: " + joueurs);
         }
        
    });

    // demande d'un joueur si possible de commencer partie
    socket.on('possible_game',function(){
        console.log("demande de commencement");
        if (joueurs.length < 2){
            socket.emit('jouer', 'non'); // emission nok pour le joueur demandeur
        }
        else{
            io.sockets.emit('jouer', 'oui'); //emission ok pour tous les joueurs
        }
        
    });

    socket.on('autre_joueur',function(){
        console.log("reception autre joueur");
        for (var i =0; i<(joueurs.length); i++){
                //console.log (joueurs[i].id + " : " +socket.id);
                if(joueurs[i].id != socket.id){
                    console.log("emission autrejoueurstatut");
                    socket.emit('autre_joueur_status', joueurs[i]);
                }
            }
    });

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

    socket.on('mon_score', function () {
        for (var i =0; i<(joueurs.length); i++){
             if(joueurs[i].id == socket.id){
                 console.log('envoie du score : ' + joueurs[i].score);
                socket.emit('ton_score', joueurs[i].score);
             }
        }
        
    });

     // message envoyé des joueurs lors du commencement du jeu (play.js)
    socket.on('start_game', function (){
        console.log('start_game');
        if (start == false){
            for (var i =0; i<(joueurs.length); i++){
                joueurs[i].enjeu = true;
            }
            //console.log("debut du jeu");
            time_ = setInterval(myFunc, 1500);
            start = true;   
        }
    });

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
            //console.log('joueur en jeu : ' + joueurs[i].enjeu);
                    if (joueurs[i].enjeu != false){
                            en_jeu = true;
                    }
        }
        if (en_jeu == false){
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