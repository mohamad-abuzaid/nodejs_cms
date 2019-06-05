/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';

var Sequelize = require('sequelize'),
        db = require('../services/database'),
        User = require('../models/user'),
        Member = require('../models/member');

// The members controller.
var MemberController = {
    index: function (req, res) {
        res.status(200).json({sucess: false, message: 'Welcome to members area ' + req.user.username + '!'});
    }
};

MemberController.create = function (req, res) {
    if (!req.body.newMember.email || !req.body.newMember.username) {
        res.json({message: 'fill_required'});
    } else {
        db.sync().then(function () {
            var userName = req.body.newMember.username;
            var newMember = {
                email: req.body.newMember.email,
                first_name: req.body.newMember.fname,
                last_name: req.body.newMember.lname,
                birth_date: req.body.newMember.dob,
                address: req.body.newMember.address,
                zip: req.body.newMember.zip,
                city: req.body.newMember.city,
                country: req.body.newMember.country,
                phone: req.body.newMember.phone,
                mobile: req.body.newMember.mobile,
                gender: req.body.newMember.gender,
                address_cont: req.body.newMember.address2,
                job: req.body.newMember.job,
                marital: req.body.newMember.marital,
                join_date: req.body.newMember.doj,
                biography: req.body.newMember.bio,
                photo: req.body.newMember.photo
            };

            return Member.create(newMember).then(function (member) {
                if (!member) {
                    res.status(404).json({success: false, message: 'save_error'});
                } else {
                    var newUser = {username: userName, email: member.email, password: '123456'};
                    User.create(newUser).then(function (user) {
                        if (!user) {
                            res.status(404).json({success: false, message: 'save_error'});
                        } else {
                            res.status(201).json({success: true, message: 'save_success'});
                        }
                    });
                }
            });
        }).catch(function (error) {
            res.status(403).json({success: false, message: 'member_exists' + error});
        });
    }
};

MemberController.getMembers = function (req, res) {
    if (!req || !req.body) {
        res.status(500).json({success: false, message: 'save_error'});
    } else if (req.body.params) {
        res.status(201).json({success: true, message: 'save_success'});
    } else {
        var params = {};
        Member.findAll(params).then(function (members) {
            if (!members) {
                res.status(404).json({success: false, message: 'no members found'});
            } else {
                res.status(201).json({success: true, members: members, message: 'members found'});
            }
        });
    }
};

MemberController.uploadphoto = function (req, res) {
    if (!req.file) {
        res.status(500).json({sucess: false, message: 'no photo error'});
    } else {
        res.status(204).end();
    }
};

module.exports = MemberController;
