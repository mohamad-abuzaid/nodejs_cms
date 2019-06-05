/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    'use strict';

    angular
            .module('MainAppController')
            .controller('PaymnentsController', [
                'authService',
                paymentsController
            ]);

    function paymentsController(authService) {
        var vm = this;

    }

})();