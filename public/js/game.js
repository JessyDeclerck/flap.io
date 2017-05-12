var game = new Phaser.Game(400, 490, Phaser.CANVAS);

/**
 * Définition des différents états du jeu
 */
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('win', winState);

//démarre l'état 'boot'
game.state.start('boot');