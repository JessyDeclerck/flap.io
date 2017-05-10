module.exports = {
    setPaths: function (app) {
        var fs = require("fs");
        var lineReader = require('line-reader');

        app.get('/', function (req, res) {
            console.log("chargement vue controller");
            res.render('index.ejs');
           
        });

        app.get('/compte', function (req, res) {
            res.render('compte.ejs');
            res.end();
        });
        
        app.post('/creation', function(req, res) {
            console.log("requete creation");
            var j = {pseudo : req.body.uname, password : req.body.psw};
            fs.appendFile("comptes.txt", JSON.stringify(j)+"\n", function (err) {
                if (err) throw err;
                     console.log('Nouveau compte sauvegardé');
            });
            res.statusCode = 302;
            res.setHeader("Location", "/compte");
            res.end();
        });  

        app.post('/connection', function(req, res) {
            console.log("requete connection");
            var test_login = false;
            var j = {pseudo : req.body.uname, password : req.body.psw};
            var contents = fs.readFileSync('comptes.txt', 'utf8').split('\n').forEach(
                function(line){
                    
                    if (line != ''){
                        if (req.body.uname == JSON.parse(line)['pseudo']){
                            if (req.body.psw == JSON.parse(line)['password']){
                            console.log(JSON.parse(line)['pseudo']+":"+JSON.parse(line)['password']);
                            test_login = true;
                            res.statusCode = 302;
                            res.setHeader("Location", "/compte");
                            res.end();
                            }
                        }
                    }
                    else{
                        if (test_login == false){
                            console.log('pas de correspondances');
                            res.statusCode = 302;
                            res.setHeader("Location", "/");
                            res.end();
                        }
                    }
                });
        });
            
        app.get('/connecter', function (req, res){  
            console.log("chargement vue controller");
            res.render('jeu.ejs');    
        });        
    }
}