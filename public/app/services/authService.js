/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global MainAppController */

(function () {
    'use strict';

    angular
            .module('MainAppController').factory('authService', ['$http', '$cookies', '$state', authService]);

    function authService($http, $cookies, $state) {

        var authService = {
            login: login,
            logout: logout,
            signup: signup,
            getUserData: getUserData,
            isAuthenticated: isAuthenticated
        };

        return authService;

        function login(email, password, remember) {
            var reqObj = {
                method: 'POST',
                url: '/api/authenticate',
                data: {
                    email: email,
                    password: password
                }
            };

            return $http(reqObj).then(function (response) {
                if (response && response.data) {
                    response = response.data;

                    var user = response.user;
                    var token = response.token;
                    var member = response.member;

                    $cookies.put('user', JSON.stringify(user));
                    $cookies.put('member', JSON.stringify(member));
                    $cookies.put('token', JSON.stringify(token));

                    if (remember) {
                        $cookies.maxAge = 604800000;
                    } else {
                        $cookies.expires = false;
                    }
                }
            });
        }

        function logout() {
            console.log('Clearing Cookie-Log out: ');
            $cookies.remove('user');
            $cookies.remove('member');
            $cookies.remove('token');
            window.location = '/login';
        }

        function isAuthenticated() {
            var user = $cookies.get('user');
            return user && user !== 'undefined';
        }

        function getUserData() {
            if (isAuthenticated()) {
                return JSON.parse($cookies.get('user'));
            }

            return false;
        }

        function signup(username, email, password) {
            var reqObj = {
                method: 'POST',
                url: '/api/signup',
                data: {
                    username: username,
                    email: email,
                    password: password
                }
            };

            return $http(reqObj).then(function (response) {
                if (response && response.data) {
                    response = response.data;

                    if (response.success) {
                        var user = response.user;
                        var token = response.token;
                        var member = response.member;

                        $cookies.put('user', JSON.stringify(user));
                        $cookies.put('member', JSON.stringify(member));
                        $cookies.put('token', JSON.stringify(token));
                    }
                }
            });
        }
    }

})();