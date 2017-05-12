var fs = require("fs");
var lineReader = require('line-reader');

/**
 * module de gestion des comptes
 */
module.exports = {
    /**
     * Enregistre un compte
     * @param account compte au format JSON à enregistrer
     * 
     */
    createAccount: function (account) {
        account.id = generateId();
        console.log(account);
        fs.appendFile("comptes.txt", "\n" + JSON.stringify(account), function (err) {
            if (err) throw err;
            console.log('Nouveau compte sauvegardé');
        });
    },
    /**
     * Permet de vérifier la correspondance entre un nom de compte et un mot de passe
     * @param account compte au format JSON à vérifier
     * @return l'id du compte s'il est trouvé, sinon retourne null
     */
    checkLogin: function (account) {
        var idAccount = null;
        fs.readFileSync('comptes.txt', 'utf8').split('\n').forEach(
            function (line) {
                var accountChecked = JSON.parse(line);
                if (account.pseudo == accountChecked.pseudo && account.password == accountChecked.password)
                    idAccount = accountChecked.id;
            });
        return idAccount;
    }
}
/**
 * Génère un ID
 * @return id (correspondant au nombre de lignes dans le fichier de sauvegarde)
 */
var generateId = function () {
    return fs.readFileSync('comptes.txt', 'utf8').split('\n').length;
}