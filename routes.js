var accountManager = require('./models/accountManager');
var sess;
/**
 * Module de routage des URLS
 */
module.exports = {
    /**
     * Route les URLS vers les vues
     * @param app application devant router les urls
     */
    setPaths: function (app) {
        /**
         * @param req requête reçue
         * @param res réponse
         */
        app.get('/', function (req, res) {
            checkIfConnected(req.session, res, function () {
                res.render('index.ejs', { loginStatus: null });
            });
        });

        app.get('/login/:loginStatus?', function (req, res) {
            checkIfConnected(req.session, res, function () {
                res.render('index.ejs', { loginStatus: req.param('loginStatus') });
            });
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
                if (idAccount != null) { //on initialise la session si le compte et le mot de passe correspondent
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
/**
 * Redirige vers la page d'accueil s'il n'y a pas de session active
 * sinon execute une fonction quelconque
 * @param res reponse
 * @param toExecute fonction à executer
 */
var checkSession = function (res, toExecute) {
    if (!sess.pseudo)
        return res.redirect('/');
    else
        toExecute();
};

/**
 * Empêche d'accéder à certaines pages lorsque l'on est connecté sinon execute une fonction quelconque
 * @param reqSession session de la requête
 * @param res reponse
 * @param toExecute fonction à executer
 */
var checkIfConnected = function (reqSession, res, toExecute) {
    if (reqSession.pseudo)
        return res.redirect('/compte/' + reqSession.idAccount);
    else
        toExecute();
};