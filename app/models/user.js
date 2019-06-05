/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var Sequelize = require('sequelize'),
        bcrypt = require('bcrypt');

var config = require('../config/config'),
        db = require('../services/database');

// 1: The model schema.
var modelDefinition = {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },

    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false
    },

    role: {
        type: Sequelize.INTEGER,
        defaultValue: config.userRoles.user
    }
};

// 2: The model options.
var modelOptions = {
    hooks: {
        beforeValidate: hashPassword
    }
};

// 3: Define the User model.
var UserModel = db.define('user', modelDefinition, modelOptions);

// Hashes the password for a user object.
function hashPassword(user) {
    if (user.changed('password')) {
        return bcrypt.hash(user.password, 10).then(function (password) {
            user.password = password;
        });
    }
}

module.exports = UserModel;