/**
 * Module destiné au traitement des événements déclenchés par le client
 */
module.exports = {
    /**
     * Initialise le socket
     */
    setIO: function (IO) { io = IO },
    /**
     * Ajoute un joueur à la map des joueurs
     */
    setPlayer: function (p) {
        players.set(p.id, p);
    },
    /**
     * Ajoute un joueur au jeu ou en tant que spectateur
     * @param socket socket connecté au joueur
     * @param p joueur
     */
    joinGame: function (socket, p) {
        console.log("un joueur a rejoint le jeu")
        var nbPlayers = getNbPlayers();
        io.sockets.emit('updateNbPlayer', nbPlayers);
        if (nbPlayers > 1 && !gameStarting)
            startTimer();
        if (gameStarted) {
            console.log("le joueur a rejoint le jeu en tant que spectateur");
            socket.emit('startTheGame');
            p.spectator = true;
        }else
        addPlayerToTheGame(p);
    },
    /**
     * Détruit un joueur ainsi que son personnage en jeu
     * @param p joueur
     */
    destroyPlayer: function (p) {
        console.log("un joueur s'est déconnecté")
        players.delete(p.id);
        io.sockets.emit('updateNbPlayer', getNbPlayers());
        io.sockets.emit('destroyBird', p.id);
    },
    /**
     * Envoie les différents joueurs actuellement en jeu à un joueur
     * @param socket socket connecté au joueur
     */
    sendExistingPlayers: function (socket) {
        console.log("send existing players");
        players.forEach(function (value, key, map) {
            if (value.inGame && !value.spectator && value.isAlive)
                socket.emit('addBirdPlayer', value);
        });

    },
    /**
     * Détruit le personnage d'un joueur
     * @param p joueur
     */
    destroyBird: function (p) {
        console.log("destroy bird");
        p.isAlive = false;
        io.sockets.emit('destroyBird', p.id);
        if (gameStarted)
            isGameOver();
    },
    /**
     * Réinitialise un joueur
     * @param p joueur
     */
    resetPlayer: function (p) {
        console.log("reset player");
        p.inGame = false;
        p.isAlive = false;
        p.bird.x = null;
        p.bird.y = null;
    }
}

var players = new Map();//map des joueurs
var noticer = null;//notification périodique (temps avant que le jeu ne démarre)
var holesSender = null;//envoie des obstacles périodiquement
var timeLeft = null;//temps avant que le jeu ne démarre
//statuts du jeu
var gameStarted = false;
var gameStarting = false;
/**
 * Ajoute un joueur au jeu
 * @param p joueur
 */
var addPlayerToTheGame = function (p) {
    console.log("add player to the game");
    if (!p.spectator) {
        p.inGame = true;
        p.isAlive = true;
    }
};
/**
 * génére un un obstacle en jeu
 */
var generateHole = function () {
    var hole = Math.floor(Math.random() * 5) + 1;
    io.sockets.emit('newHole', hole);
}

/**
 * génére des obstacles en jeu périodiquement
 */
var sendHoles = function () { holesSender = setInterval(generateHole, 1500); };

/**
 * Démarre le compte à rebours avant le lancement de la partie
 */
var startTimer = function () { gameStarting = true; noticer = setInterval(function () { noticeGameStartingSoon(11) }, 1000); };

/**
 * Met à jour le compte à rebours ainsi que le statut de la partie
 */
var noticeGameStartingSoon = function (time) {
    if (timeLeft == null)
        timeLeft = time;
    timeLeft--;
    console.log("time before the launch of the game : " + timeLeft);
    if (timeLeft != 0)
        io.sockets.emit('gameReadyToStart', timeLeft);
    else {
        gameStarted = true;
        console.log("game beginning");
        io.sockets.emit('startTheGame');
        sendHoles();
        clearInterval(noticer);
        timeLeft = null;
    }
};

/**
 * Retourne le nombre de joueurs dans la map
 */
var getNbPlayers = function () { return players.size };

/**
 * Vérifie si le jeu est terminé, si oui envoie un message à tous les clients afin d'afficher l'écran des scores
 */
var isGameOver = function () {
    var nbPlayersAlive = 0;
    players.forEach(function (value) {
        if (value.isAlive)
            nbPlayersAlive++;
    });

    if (nbPlayersAlive < 1) {
        io.sockets.emit('gameOver', Array.from(players));
        gameStarting = false;
        gameStarted = false;
        clearInterval(holesSender);
        console.log("partie terminée");
        players = new Map();
    }
};