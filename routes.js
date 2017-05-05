module.exports = {
    setPaths: function (app) {
        app.get('/', function (req, res) {
            console.log("chargement vue controller");
            res.render('index.ejs');
        });
    }
}