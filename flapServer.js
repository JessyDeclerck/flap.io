//variables server
var express = require('express');
var http = require('http');
var app = express();
var session = require('express-session');
var httpServer = http.createServer(app);
var controller = require('./routes');
var bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({secret: 'hbHB6gh77vGVj3nJ3838NHb3838HBH'}));
//faire un controller pour les routes et architecture REST
controller.setPaths(app);

app.use(express.static('public'));

var game = require('./gameLogic');

game.run(httpServer);

httpServer.listen(8095);