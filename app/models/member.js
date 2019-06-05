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
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    gender: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    birth_date: {
        type: Sequelize.STRING,
        allowNull: true
    },
    address: {
        type: Sequelize.STRING,
        allowNull: true
    },
    address_cont: {
        type: Sequelize.STRING,
        allowNull: true
    },
    zip: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    city: {
        type: Sequelize.STRING,
        allowNull: true
    },
    country: {
        type: Sequelize.STRING,
        allowNull: true
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    mobile: {
        type: Sequelize.STRING,
        allowNull: true
    },
    job: {
        type: Sequelize.STRING,
        allowNull: true
    },
    marital: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    join_date: {
        type: Sequelize.STRING,
        allowNull: true
    },
    biography: {
        type: Sequelize.STRING,
        allowNull: true
    },
    photo: {
        type: Sequelize.STRING,
        allowNull: true
    }
};

// 3: Define the User model.
var MemberModel = db.define('member', modelDefinition);

module.exports = MemberModel;