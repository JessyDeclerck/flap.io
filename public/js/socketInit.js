//Connexion au serveur
var socket = io.connect(ip());

/**
 * Récupére l'adresse du serveur via l'url de la page
 *@return adresse du serveur au format string
 * */
function ip() {
    var CheminComplet = document.location.href;
    var ip;
    if (CheminComplet.includes("http://")) {
        temp = CheminComplet.substring(7, CheminComplet.length);
        return ip = temp.substring(0, temp.indexOf('/'));
    }
    else if (CheminComplet.includes("https://")) {
        temp = CheminComplet.substring(8, CheminComplet.length);
        return ip = temp.substring(0, temp.indexOf('/'));
    }
}