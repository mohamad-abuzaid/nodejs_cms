/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global __dirname */

//Model = require('./lib/model').SetConfiguration(Config.db),

'use strict';
var express = require('express'),
        Config = require('./config/config'),
        str = require('./lib/_String'),
        fs = require('fs'),
        routing = require('./lib/routing'),
        paypal = require('./lib/paypal'),
        bodyParser = require('body-parser'),
        morgan = require('morgan'),
        sequelize = require('sequelize'),
        passport = require('passport'),
        jwt = require('jsonwebtoken'),
        multer = require('multer'),
        session = require('express-session'),
        cookieParser = require('cookie-parser'),
        path = require('path'),
        JSON = require('JSON');

var hookJWTStrategy = require('./services/passportStrategy');

var app = express();
var upload = multer();

app.set('trust proxy', true);

// Parse as urlencoded and json.
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Hook up the HTTP logger.
app.use(morgan('dev'));

// Hook up Passport.
app.use(passport.initialize());

// Hook the passport JWT strategy.
hookJWTStrategy(passport);

app.use(upload.array());
app.use(cookieParser());
app.use(session({
    secret: '#Xado.Secret.Key#',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 999999999}
}));

// Set the static files location.
app.use('/account', express.static(__dirname + '/views/account'));
app.use('/admin', express.static(__dirname + '/views/admin'));
app.use('/front', express.static(__dirname + '/views/front'));
app.use('/notfound', express.static(__dirname + '/views/notfound'));

app.use("/styles", express.static(__dirname + '/public/styles'));
app.use("/scripts", express.static(__dirname + '/public/scripts'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use("/controllers", express.static(__dirname + '/controllers'));
app.use("/localizations", express.static(__dirname + '/localizations'));

app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/views/account/account.html');
});

app.get('/register', function (req, res) {
    res.sendFile(__dirname + '/views/account/account.html');
});

app.get('/admin', function (req, res) {
    res.sendFile(__dirname + '/views/admin/admin.html');
});

//try { res.sendFile(snapshotDir + path); } //serve html snapshot
// catch (err) { res.send(404); }

//app.get('/register', function (req, res, next) {
//    res.status(200).redirect('/account/account.html');
//    next();
//});
//
//routers.all('/admin/*', function (req, res, next) {
//    res.status(200).redirect('/admin/');
//    next();
//});
//
//
//routers.all('/front/*', function (req, res, next) {
//    res.status(200).redirect('/front/');
//    next();
//});
//

app.all('/api/*', function (req, res, next) {
    var OriginalUrl = new String(req.originalUrl);
    routing.Parse(OriginalUrl.replace(/\/api/g), function (keys) {
        var respons_data = null;
        var contriller_list = fs.readdirSync(__dirname + '/apis');
        if (contriller_list.indexOf(keys.FileName + '.js') >= 0) {
            var controller = require(__dirname + '/apis' + '/' + keys.FileName);
            controller.req = req;
            controller.bodyParser = bodyParser;
            if (keys.Method !== null) {
                if (controller.hasOwnProperty(keys.Method)) {
                    if (keys.Parameters !== null) {
                        respons_data = controller[keys.Method](keys.Parameters);
                    } else {
                        respons_data = controller[keys.Method]();
                    }
                }
            } else {
                respons_data = controller.index(keys.Parameters);
            }
            res.send(respons_data);
        } else {
            res.status(404).send('Sorry, we cannot find that!');
        }
    });

    next();
});

app.use(function (req, res) {
    res.sendFile(__dirname + '/views/notfound/404.html');
});

app.use(function (err, req, res) {
    res.sendFile(__dirname + '/views/notfound/404.html');
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
});