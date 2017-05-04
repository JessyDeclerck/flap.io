var express = require('express');
var http = require('http');
var app = express();
var httpServer = http.createServer(app);
var controller = require('./routes');
var start = false;
var time = null;
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
        console.log("un joueur a rejoint le jeu")
        io.sockets.emit('updateNbPlayer', io.engine.clientsCount);
    });

     socket.on('disconnect', function () {
         console.log("un joueur s'est déconnecté")
        io.sockets.emit('updateNbPlayer', io.engine.clientsCount);
    });

    socket.on('start_game', function () {
        if (start == false){
            console.log("debut du jeu");
                time_ = setInterval(myFunc, 1500);
                start = true;
             
        }
                 
    });

    socket.on('stop_game', function(){   
        clearInterval(time_);
        start= false;
    });

    socket.on('playerBird', function(birdPosition){
        socket.broadcast.emit('updateDisplayedBirds', birdPosition);
    });
    
});


httpServer.listen(8095);