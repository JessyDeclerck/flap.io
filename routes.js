module.exports = {
    setPaths: function (app) {
        var fs = require("fs");
        var lineReader = require('line-reader');


        app.get('/', function (req, res) {
            console.log("chargement vue controller");
            res.render('index_1.ejs');
        });
        
        app.post('/creation', function(req, res) {
            console.log("requete creation");
            
            var j = {pseudo : req.body.uname, password : req.body.psw};
            fs.appendFile("comptes.txt", JSON.stringify(j)+"\n", function (err) {
                if (err) throw err;
                     console.log('Nouveau compte sauvegardé');
            });
            fs.close();
            res.statusCode = 302;
            res.setHeader("Location", "/connecter");
            res.end();
        });  

        app.post('/connection', function(req, res) {
            console.log("requete connection");
            var login = false;
            var j = {pseudo : req.body.uname, password : req.body.psw};

           lineReader.eachLine('comptes.txt', function(line, last) {
                if (login == false){
                    if (req.body.uname == JSON.parse(line)['pseudo']){
                        if (req.body.psw == JSON.parse(line)['password']){
                            console.log("login ok");
                            login = true;
                        }
                    }
                }
                if(last){
                    if (login != true)
                        console.log("last, pas de login")
                }
             });
            res.end();
        });  

        app.get('/connecter/', function (req, res){  
            console.log("chargement vue controller");
            res.render('jeu.ejs');    
        });
        
    }
}