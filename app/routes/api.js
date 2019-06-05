/* global __dirname */

'use strict';

var router = require('express').Router();

var config = require('../config/config'),
        AuthController = require('../controllers/authController'),
        allowOnly = require('../services/routesHelper').allowOnly,
        MemberController = require('../controllers/memberController'),
        multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../uploads/profiles/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var profile = multer({storage: storage});

var APIRoutes = function (passport) {
    // POST Routes.
    router.post('/signup', AuthController.signUp);
    router.post('/authenticate', AuthController.authenticateUser);
    router.post('/memberscreate', passport.authenticate('jwt', {session: false}), allowOnly(config.accessLevels.user, MemberController.create));
    router.post('/memberphoto', passport.authenticate('jwt', {session: false}), profile.single('avatar'), allowOnly(config.accessLevels.user, MemberController.uploadphoto));
    
    // GET Routes.
    router.get('/getmembers', passport.authenticate('jwt', {session: false}), allowOnly(config.accessLevels.user, MemberController.getMembers));
    return router;
};

module.exports = APIRoutes;