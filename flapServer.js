//variables server
var express = require('express');
var http = require('http');
var app = express();
var session = require('express-session');
var httpServer = http.createServer(app);
var controller = require('./routes');

app.use(session({test: 'test'}));
//faire un controller pour les routes et architecture REST
controller.setPaths(app);

app.use(express.static('public'));

var game = require('./gameLogic');

game.run(httpServer);

httpServer.listen(8095);