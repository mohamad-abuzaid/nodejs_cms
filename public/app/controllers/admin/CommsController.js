/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    'use strict';

    angular
            .module('MainAppController')
            .controller('CommsController', [
                'authService',
                commsController
            ]);

    function commsController(authService) {
        var vm = this;

    }

})();