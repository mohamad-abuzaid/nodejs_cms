/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Sequelize */

'use strict';

var Sequelize = require('sequelize'),
        JWTStrategy = require('passport-jwt').Strategy,
        ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('../models/user'),
        config = require('../config/config');

const Op = Sequelize.Op;

// Hooks the JWT Strategy.
function hookJWTStrategy(passport) {
    var options = {};

    options.secretOrKey = config.keys.secret;
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    options.ignoreExpiration = false;

    passport.use(new JWTStrategy(options, function (JWTPayload, callback) {

        var foundUser = {where: {email: JWTPayload.email}};
        //{email: {[Op.eq]: JWTPayload.email}}

//        User.findById(JWTPayload.user.id, function (err, user) {
//            if (err) {
//                return callback(err, false);
//            }
//            if (user) {
//                callback(null, user);
//            } else {
//                callback(null, false);
//            }
//        });

        User.findOne(foundUser)
                .then(function (user) {
                    if (!user) {
                        callback(null, false);
                        return;
                    }

                    callback(null, user);
                });
    }));
}

module.exports = hookJWTStrategy;