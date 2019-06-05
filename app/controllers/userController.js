/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';

// The user controller.
var UserController = {
    index: function (req, res) {
        res.status(200).json({message: 'Welcome to the users area ' + req.user.username + '!'});
    }
};

module.exports = UserController;
