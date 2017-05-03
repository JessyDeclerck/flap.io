var game = new Phaser.Game(400, 490, Phaser.CANVAS);

//'nom de l'état', json à charger
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('win', winState);

game.state.start('boot');