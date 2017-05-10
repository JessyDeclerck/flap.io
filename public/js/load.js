while (pseudo == null)
    var pseudo = prompt('Saisissez un pseudo :');

menuEventSender.registerPseudo(pseudo);

var loadState = {

    preload: function () {
        var assets = "assets/";
        game.load.image('bird', assets + 'bird.png');
        game.load.image('pipe', assets + 'pipe.png');
        game.load.image('fond', assets + 'background.png');
        game.load.image('bouton_1', assets + 'bouton_1.png');

        var loadingLabel = game.add.text("loading...");
    },

    create: function () {
        game.state.start('menu');
    }

};