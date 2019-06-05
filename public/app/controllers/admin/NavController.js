/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    'use strict';

    angular
            .module('MainAppController')
            .controller('NavController', [
                'authService',
                navController
            ]);

    function navController(authService) {
        var vm = this;

        vm.isAuthenticated = authService.isAuthenticated;
        vm.logout = authService.logout;
    }

})();