//dépendances
var express = require('express');
var http = require('http');
var bodyParser = require("body-parser"); 
var session = require('express-session');

var controller = require('./routes');
var game = require('./gameLogic');

//configuration serveur
var httpServer = http.createServer(app);
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret: 'hbHB6gh77vGVj3nJ3838NHb3838HBH', resave: true, saveUninitialized: true}));
app.use(express.static('public'));

//ajout des routes
controller.setPaths(app);
//lancement du jeu
game.run(httpServer);

//écoute d'un port
httpServer.listen(8095);