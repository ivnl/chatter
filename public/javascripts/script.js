console.log("script.js loaded");

function modlang(string) {
    var current = document.getElementById("lang").innerHTML;

    if (current == 'ja') {
        document.getElementById("lang").innerHTML = 'en';
    } else document.getElementById("lang").innerHTML = 'ja';

}

function shake() {
    $("#body").effect("shake");
}

var state = {
    'color': $('html').css("background-color"),
};
