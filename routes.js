var accountManager = require('./models/accountManager');
module.exports = {
    setPaths: function (app) {

        app.get('/', function (req, res) {
            console.log("chargement vue controller");
            res.render('index.ejs');  
        });

        app.get('/compte', function (req, res) {
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

            var testLogin = accountManager.checkLogin(account);
            if(testLogin){
                return res.redirect('/connected');
            }else
            return res.redirect('/');

        });
            
        app.get('/connected', function (req, res){  
            console.log("chargement vue controller");
            res.render('jeu.ejs');    
        });        
    }
}