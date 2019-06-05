/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';

var jwt = require('jsonwebtoken');

var Sequelize = require('sequelize'),
        bcrypt = require('bcrypt'),
        config = require('../config/config'),
        db = require('../services/database'),
        User = require('../models/user'),
        Member = require('../models/member');

const Op = Sequelize.Op;

// The authentication controller.
var AuthController = {};

// Register a user.
AuthController.signUp = function (req, res) {
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.json({message: 'Please provide all needed data.'});
    } else {
        db.sync().then(function () {
            var newUser = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            };

            return User.create(newUser).then(function (user) {
                if (!user) {
                    res.status(404).json({success: false, message: 'Create user failed!'});
                } else {
                    var newMember = {email: req.body.email};
                    Member.create(newMember).then(function (member) {
                        if (!member) {
                            res.status(404).json({success: false, message: 'Create member failed!'});
                        } else {
                            var token = jwt.sign(
                                    {email: user.email},
                                    config.keys.secret,
                                    config.token
                                    );

                            res.status(201).json({success: true, token: 'JWT ' + token, message: 'Account created!', user: user, member: member});
                        }
                    });
                }
            });
        }).catch(function (error) {
            res.status(403).json({message: 'Email already exists!: ' + error});
        });
    }
};

AuthController.authenticateUser = function (req, res) {
    if (!req.body.email || !req.body.password) {
        res.status(404).json({message: 'Email and password are needed!'});
    } else {
        var email = req.body.email,
                password = req.body.password,
                potentialUser = {where: {email: email}};
        //potentialUser = {email: {[Op.eq]: email}};

        User.findOne(potentialUser).then(function (user) {
            if (!user) {
                res.status(404).json({message: 'Authentication failed!'});
            } else {
                comparePasswords(password, user.password, function (error, isMatch) {
                    if (isMatch && !error) {
                        var token = jwt.sign(
                                {email: user.email},
                                config.keys.secret,
                                config.token
                                );

                        Member.findOne(potentialUser).then(function (member) {
                            if (!member) {
                                res.status(404).json({message: 'Authentication failed!'});
                            } else {
                                res.json({success: true, token: 'JWT ' + token, user: user, member: member});
                            }

                        });

                    } else {
                        res.status(404).json({message: 'Login failed!: ' + error});
                    }
                });
            }
        }).catch(function (error) {
            res.status(500).json({message: 'There was an error!: ' + error});
        });
    }
};

// Compares two passwords.
function comparePasswords(password, password2, callback) {
    bcrypt.compare(password, password2, function (error, isMatch) {
        if (error) {
            return callback(error);
        }

        return callback(null, isMatch);
    });
}

module.exports = AuthController;
