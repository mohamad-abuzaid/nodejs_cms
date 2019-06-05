/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';

exports.allowOnly = function (accessLevel, callback) {
    function checkUserRole(req, res) {
        if (!(accessLevel & req.user.role)) {            
            res.status(403).json({success: false, message: res});
            //res.sendStatus(403);
            return;
        }

        callback(req, res);
    }

    return checkUserRole;
};
