var fs = require("fs");
var lineReader = require('line-reader');
var compte = 0;

module.exports = {
        createAccount: function (account) {
            fs.appendFile("comptes.txt", "\n" + JSON.stringify(account), function (err) {
                if (err) throw err;
                console.log('Nouveau compte sauvegardé');
            });
        },
        checkLogin: function (account) {
            var testOk = false;
            fs.readFileSync('comptes.txt', 'utf8').split('\n').forEach(
                function (line) {
                        var accountChecked = JSON.parse(line);
                        console.log(accountChecked);
                        console.log(account);
                        if (account.pseudo == accountChecked.pseudo && account.password == accountChecked.password)
                            testOk = true;
                });
            return testOk;
        }
}