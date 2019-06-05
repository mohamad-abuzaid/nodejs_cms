
(function () {
    'use strict';

    angular
            .module('MainAppController')
            .controller('CtrlController', [
                'authService',
                ctrlController
            ]);

    function ctrlController(authService) {
        var vm = this;

        vm.isAuthenticated = authService.isAuthenticated;
        vm.logout = authService.logout;
    }

})();