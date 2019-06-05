/* global MainAppController, key */
(function () {
    'use strict';

    angular
            .module('MainAppController').controller('RegisterController', ['$scope', '$state', 'authService', signupController]);

    function signupController($scope, $state, authService) {
        var vm = this;

        vm.signupSuccess = false;
        vm.signupError = false;
        vm.signupErrorMessage = null;

        vm.signup = signup;

        function signup() {
            vm.signupSuccess = false;
            vm.signupError = false;
            vm.signupErrorMessage = null;

            if (!vm.email || !vm.password || !vm.name) {
                vm.signupError = true;
                vm.signupErrorMessage = 'signup error';
                return;
            }

            authService.signup(vm.name, vm.email, vm.password)
                    .then(handleSuccessfulSignup)
                    .catch(handleFailedSignup);
        }

        function handleSuccessfulSignup(response) {
            vm.signupSuccess = true;
            $state.go('login');
        }

        function handleFailedSignup(response) {
            vm.signupSuccess = false;

            if (response && response.data) {
                vm.signupErrorMessage = response.data.message;
                vm.signupError = true;
            }
        }
    }

})();
