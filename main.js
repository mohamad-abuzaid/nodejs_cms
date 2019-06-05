/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global __dirname */

'use strict';

// 1: NPM dependencies.
var express = require('express'),
        bodyParser = require('body-parser'),
        morgan = require('morgan'),
        path = require('path'),
        session = require('express-session'),
        sequelize = require('sequelize'),
        passport = require('passport'),
        jwt = require('jsonwebtoken'),
        favicon = require('serve-favicon');

var hookJWTStrategy = require('./app/services/passportStrategy');

// 3: Initializations.
var app = express();

// 4: Parse as urlencoded and json.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev')); // 5: Hook up the HTTP logger.
app.use(passport.initialize()); // 6: Hook up Passport.
hookJWTStrategy(passport); // Hook the passport JWT strategy.
app.use('/api', require('./app/routes/api')(passport)); // Bundle API routes.
app.use(favicon(path.join(__dirname,'public','assets','images','fav.ico')));
app.use(session({
    name: 'xado_session',
    secret: '#Xado.Secret.Key#',
    resave: true,
    saveUninitialized: true,
    //cookie: {maxAge: 604800000},
    "storeParams": {
        "host": "localhost",
        "port": "8081"
    }
}));


// Set the static files location.
app.use(express.static(__dirname));
app.use('/app', express.static(__dirname + '/public/app')); // 7: Set the static files location.
app.use('/account', express.static(__dirname + '/public/app/views/account'));
app.use('/admin', express.static(__dirname + '/public/app/views/admin'));
app.use('/front', express.static(__dirname + '/public/app/views/front'));
app.use('/helpers', express.static(__dirname + '/public/app/views/helpers'));
app.use('/notfound', express.static(__dirname + '/public/app/views/notfound'));
app.use("/controllers", express.static(__dirname + '/public/app/controllers'));
app.use("/localizations", express.static(__dirname + '/public/app/localizations'));
app.use("/services", express.static(__dirname + '/public/app/services'));

app.use("/styles", express.static(__dirname + '/public/assets/styles'));
app.use("/scripts", express.static(__dirname + '/public/assets/scripts'));
app.use("/images", express.static(__dirname + '/public/assets/images'));
app.use("/plugins", express.static(__dirname + '/public/assets/plugins'));


app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/app/views/account/account.html');
});
app.get('/register', function (req, res) {
    res.sendFile(__dirname + '/public/app/views/account/account.html');
});
app.get('/account/*', function (req, res) {
    res.sendFile(__dirname + '/public/app/views/account/account.html');
});
app.get('/admin/*', function (req, res) {
    res.sendFile(__dirname + '/public/app/views/admin/admin.html');
});

// 9: Start the server.
app.listen('8081', function () {
    console.log('Master.. welcome to the legendary Xado portal!');
});
