var accountManager = require('./models/accountManager');
module.exports = {
    setPaths: function (app) {

        app.get('/', function (req, res) {
            res.render('index.ejs', {loginStatus : null});  
        });

        app.get('/login/:loginStatus?', function (req, res) {
            res.render('index.ejs',{ loginStatus : req.param('loginStatus') });  
        });

        app.get('/compte/:id', function (req, res) {
            res.render('compte.ejs');
        });

        app.get('/inscription', function (req, res) {
            res.render('inscription.ejs');
        });
        
        app.post('/creation', function(req, res) {
            console.log("requete creation");
            var account = {pseudo : req.body.uname, password : req.body.psw};
            accountManager.createAccount(account);
            return res.redirect('/');
        });  

        app.post('/connection', function(req, res) {
            var account = {pseudo : req.body.uname, password : req.body.psw};

            var idAccount = accountManager.checkLogin(account);
            console.log(idAccount);
            if(idAccount != null){
                return res.redirect('/compte/' + idAccount);
            }else
            return res.redirect('/login/failed');

        });
            
        app.get('/connected', function (req, res){  
            console.log("chargement vue controller");
            res.render('jeu.ejs');    
        });        
    }
}