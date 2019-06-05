/* global key, MainAppController */

(function () {
    'use strict';

    angular
            .module('MainAppController').controller('LoginController', ['$state', '$cookies', 'authService', loginController]);

    function loginController($state, $cookies, authService) {
        var vm = this;

        vm.loginError = false;
        vm.loginErrorMessage = null;
        vm.remember = false;

        vm.login = login;
        function login() {
            vm.loginError = false;
            vm.loginErrorMessage = null;

            if (!vm.email || !vm.password) {
                vm.loginError = true;
                vm.loginErrorMessage = 'login error';
                return;
            }

            authService.login(vm.email, vm.password, vm.remember)
                    .then(handleSuccessfulLogin)
                    .catch(handleFailedLogin);
        }

        function handleSuccessfulLogin() {
            if (typeof $cookies.get('returnUrl') !== 'undefined' && $cookies.get('returnUrl') !== '') {
                window.location = $cookies.get('returnUrl');
                $cookies.remove('returnUrl');
            } else {
                window.location = '/admin';
            }
        }

        function handleFailedLogin(response) {
            if (response && response.data) {
                vm.loginErrorMessage = response.data.message;
                vm.loginError = true;
            }
        }

    }

})();