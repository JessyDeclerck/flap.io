var fs = require("fs");
var lineReader = require('line-reader');

module.exports = {
        createAccount: function (account) {
            account.id = generateId();
            console.log(account);
            fs.appendFile("comptes.txt", "\n" + JSON.stringify(account), function (err) {
                if (err) throw err;
                console.log('Nouveau compte sauvegardé');
            });
        },
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
var generateId = function(){
    return fs.readFileSync('comptes.txt', 'utf8').split('\n').length;
}