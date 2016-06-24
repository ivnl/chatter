console.log("script.js loaded");

function modlang(string) {
    var current = document.getElementById("lang").innerHTML;

    if (current == 'ja') {
        document.getElementById("lang").innerHTML = 'en';
    } else document.getElementById("lang").innerHTML = 'ja';

}

$("#right").click(function() {
    $("#square").animate({ "left": "+=50px" }, "fast");
});

$("#left").click(function() {
    $("#square").animate({ "left": "-=50px" }, "fast");
});


// var color = $('html').css("background-color");


var state = {

    'color': $('html').css("background-color"),

};
