var accountManager = require('./models/accountManager');
var sess;
module.exports = {
    setPaths: function (app) {

        app.get('/', function (req, res) {
            checkIfConnected(req.session, res, function () {
                res.render('index.ejs', { loginStatus: null });
            });
        });

        app.get('/login/:loginStatus?', function (req, res) {
            checkIfConnected(req.session, res);
            res.render('index.ejs', { loginStatus: req.param('loginStatus') });
        });

        app.get('/compte/:id', function (req, res) {
            sess = req.session;
            checkSession(res, function () {
                if (sess.idAccount == req.param('id'))
                    res.render('compte.ejs', { pseudo: sess.pseudo });
                else
                    return res.redirect('/');
            });

        });

        app.get('/inscription', function (req, res) {
            checkIfConnected(req.session, res, function () {
                res.render('inscription.ejs');
            });

        });

        app.post('/creation', function (req, res) {
            checkIfConnected(req.session, res, function () {
                console.log("requete creation");
                var account = { pseudo: req.body.uname, password: req.body.psw };
                accountManager.createAccount(account);
                return res.redirect('/');
            });

        });

        app.post('/connection', function (req, res) {
            checkIfConnected(req.session, res, function () {
                var account = { pseudo: req.body.uname, password: req.body.psw };

                var idAccount = accountManager.checkLogin(account);
                if (idAccount != null) {
                    sess = req.session;
                    sess.idAccount = idAccount;
                    sess.pseudo = account.pseudo;
                    return res.redirect('/compte/' + idAccount);
                } else
                    return res.redirect('/login/failed');
            });

        });

        app.get('/jouer', function (req, res) {
            sess = req.session;
            checkSession(res, function () {
                res.render('jeu.ejs', { pseudo: sess.pseudo });
            });
        });

        app.get('/logout', function (req, res) {
            req.session.destroy();
            res.redirect('/');
        });

    }
}

var checkSession = function (res, toExecute) {
    if (!sess.pseudo)
        return res.redirect('/');
    else
        toExecute();
};

var checkIfConnected = function (reqSession, res, toExecute) {
    if (reqSession.pseudo)
        return res.redirect('/compte/' + reqSession.idAccount);
    else
        toExecute();
};