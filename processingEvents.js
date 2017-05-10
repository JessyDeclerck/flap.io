module.exports = {
    setIO: function (IO) { io = IO },
    setPlayer: function (p) {
        players.set(p.id, p);
    },
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
        }
    },
    destroyPlayer: function (p) {
        console.log("un joueur s'est déconnecté")
        players.delete(p.id);
        io.sockets.emit('updateNbPlayer', getNbPlayers());
        io.sockets.emit('destroyBird', p.id);
    },
    addPlayerToTheGame: function (p) {
        console.log("add player to the game");
        if (!p.spectator) {
            p.inGame = true;
            p.isAlive = true;
        }
    },
    sendExistingPlayers: function (socket, p) {
        console.log("send existing players");
        players.forEach(function (value, key, map) {
            if (value.inGame && !value.spectator && value.isAlive)
                socket.emit('addBirdPlayer', value);
        });

    },
    destroyBird: function (p) {
        console.log("destroy bird");
        p.isAlive = false;
        io.sockets.emit('destroyBird', p.id);
        if (gameStarted)
            isGameOver();
    },
    resetPlayer: function (p) {
        console.log("reset player");
        p.inGame = false;
        p.isAlive = false;
        p.bird.x = null;
        p.bird.y = null;
    }
}

var players = new Map();
var noticer = null;
var holesSender = null;
var timeLeft = null;
var gameStarted = false;
var gameStarting = false;

var generateHole = function () {
    var hole = Math.floor(Math.random() * 5) + 1;
    io.sockets.emit('newHole', hole);
}

var sendHoles = function () { holesSender = setInterval(generateHole, 1500); };

var startTimer = function () { gameStarting = true; noticer = setInterval(function () { noticeGameStartingSoon(11) }, 1000); };

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

var getNbPlayers = function () { return players.size };

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