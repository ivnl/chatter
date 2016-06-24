'use strict';

//using express (framework)
const express = require('express');
const app = express();

//using socketIO (real time communications)
const socketIO = require('socket.io');

//setting the port
const port = process.env.PORT || 3000;

//setting the http server (using 'app')
const server = require('http').Server(app);

//setting io (using 'server' and socketIO)
const io = socketIO(server);

//using path module provides utilities for working with file and directory paths.
const path = require('path');

//body parser middleware
const bodyParser = require('body-parser');

//yandex translate API middleware
const translate = require('yandex-translate')('trnsl.1.1.20160623T160703Z.cd537dfc9e1e4cb0.64d71f6fba248ef0ea95a85b19897ef2ff31878d');

//logging middleware
// var logger = require('morgan');

//cookie middleware
// var cookieParser = require('cookie-parser');

//routes
// var routes = require('./routes/index');
// var users = require('./routes/users');

//database connections (to psql) *will be used later
var promise = require('bluebird');

var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp('postgres://localhost:5432/instagram');

// view engine setup (handlebars)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express static middleware to connect to files in 'public'
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

var newUser = "";
var players = [];

function newPlayer() {
    this.name;
    this.id = 1;
    this.x = Math.random() * 500;
    this.y =  Math.random() * 500;
    //Random colors
    var r = Math.random()*255>>0;
    var g = Math.random()*255>>0;
    var b = Math.random()*255>>0;
    this.color = "rgba(" + r + ", " + g + ", " + b + ", 0.5)";

    //Random size
    this.radius = Math.random()*20+20;
    this.speed =  5;

    return {'name' : this.name,"x" : this.x,"y" : this.y,"color" : this.color, "radius" : this.radius,"speed" : this.speed}
}


app.get('/', function(req, res, next) {
    res.render('index');
});

app.post('/chat', function(req, res, next) {
    newUser = req.body;
    console.log(newUser);
    res.render('chat', { username: newUser.username });
});

io.on('connection', function(socket) {


var currentPlayer = new newPlayer(); //new player made
    players.push(currentPlayer); //push player object into array

    //create the players Array
    socket.broadcast.emit('currentUsers', players);
    socket.emit('welcome', currentPlayer, players);

        //disconnected
    socket.on('disconnect', function(){
        players.splice(players.indexOf(currentPlayer), 1);
        console.log(players);
        socket.broadcast.emit('playerLeft', players);
    });

    socket.on('pressed', function(key){
        if(key === 38){
            currentPlayer.y -= currentPlayer.speed;
            socket.emit('PlayersMoving', players);
            socket.broadcast.emit('PlayersMoving', players);
        } 
        if(key === 40){
            currentPlayer.y += currentPlayer.speed;
            socket.emit('PlayersMoving', players);
            socket.broadcast.emit('PlayersMoving', players);
        } 
        if(key === 37){
            currentPlayer.x -= currentPlayer.speed;
            socket.emit('PlayersMoving', players);
            socket.broadcast.emit('PlayersMoving', players);
        } 
        if(key === 39){
            currentPlayer.x += currentPlayer.speed;
            socket.emit('PlayersMoving', players);
            socket.broadcast.emit('PlayersMoving', players);
        }
    });






    console.log('User Connected');
    io.emit('chat message', newUser.username + " has connected :)");

    // socket.on('disconnect', function(msg) {
    //     io.emit('chat message', newUser.username + " has disconnected :(");
    //     console.log('Client Disconnected');
    // });

    socket.on('shake', function() {
        io.emit('shake screen');
    });

    socket.on('lang eng', function() {
        io.emit('change eng');
    });

    socket.on('lang jap', function() {
        io.emit('change jap');
    });

    socket.on('chat message', function(msg) {
        translate.translate(msg, { to: 'en' }, function(err, res) {
            io.emit('chat message', res.text);
        });
    });
    socket.on('jap message', function(msg) {
        translate.translate(msg, { to: 'ja' }, function(err, res) {
            io.emit('jap message', res.text);
        });
    });
});

// error handlers //
///////////////////////////////////////////
// catch 404 and forward to error handler//
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(port, function() {
    console.log('listening on ' + port);
});

module.exports = app;
