//variables server
var express = require('express');
var http = require('http');
var app = express();
var httpServer = http.createServer(app);
var controller = require('./routes');

//faire un controller pour les routes et architecture REST
controller.setPaths(app);

app.use(express.static('public'));

var game = require('./gameLogic');

game.run(httpServer);

httpServer.listen(8095);