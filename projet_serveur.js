var express = require('express');
var http = require('http');
var joueur = 0;
var app = express();
var httpServer = http.createServer(app);

app.use(express.static('public'));

app.get('/', function(req, res) {
   res.send('Hello World');
});

console.log('nbre joueur : ' + joueur);
// Chargement de socket.io
var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function (socket) {
    console.log('connection d\'un client');
    socket.njoueur = joueur + 1;
    if (joueur <2){
        joueur += 1;
        socket.broadcast.emit('new_player', joueur);
        console.log('joueur ' + socket.njoueur + ' connecté');
        console.log('nbre joueur : ' + joueur);
    }

    socket.on('disconnect',function(){
        if (joueur > 0){
            joueur -= 1;
            socket.broadcast.emit('new_player', joueur);
        }
        console.log('deconnexion du joueur, restant : '+ joueur); 
     });

     socket.on('jouer', function(){
         console.log('le joueur ' + socket.njoueur + ' veut jouer');
         io.emit('depart');
     });

     socket.on('position', function(message){
         console.log('position joueur '+ socket.njoueur + " : " + message);
     });

     // Quand le serveur reçoit un signal de type "message" du client.   
    socket.on('message', function (message) {
        
        if (message == 'joueur'){
            console.log(message + 'reponse -> ' + joueur);
            socket.emit('message', joueur);
        } 
    });	
});

httpServer.listen(8095);