var playEventSender = {
    getExistingPlayers: function () { socket.emit('getExistingPlayers'); },
    updateScore: function (score) { socket.emit('updateScore', score); },
    jump: function () { socket.emit('jump'); },
    sendBirdPosition: function (bird) {
        var birdPosition = { x: null, y: null };
        birdPosition.x = bird.x;
        birdPosition.y = bird.y;
        if (bird.alive)
            socket.emit('sendBirdPosition', birdPosition);
    },
    destroyMe: function () { socket.emit('destroyMe'); },
}

var processPlayEvent = {
    addBirdPlayer: function () {
        socket.on('addBirdPlayer', function (player) {
            if (playState.gameStarted)
                playState.addOneBird(player);
        });
    },
    destroyBird: function () {
        socket.on('destroyBird', function (idPlayer) {
            if (playState.gameStarted) {
                var birdPlayerToDestroy = playState.birds.get(idPlayer);
                if (birdPlayerToDestroy != null) {
                    birdPlayerToDestroy.kill();
                }
            }
        });
    },
    aPlayerJumped: function () {
        socket.on('aPlayerJumped', function (player) {
            if (playState.gameStarted)
                playState.makePlayerJump(player);
        });
    },
    newHole: function () {
        socket.on('newHole', function (hole) {
            if (playState.gameStarted)
                playState.addRowOfPipes(hole);
        });
    },
    gameOver: function () {
        socket.on('gameOver', function (players) {
            playState.gameOver(players);
        });
    }
}