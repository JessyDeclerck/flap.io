var socket = io.connect(ip());

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