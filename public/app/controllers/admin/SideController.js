/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    'use strict';

    angular
            .module('MainAppController')
            .controller('SideController', [
                'authService',
                sideController
            ]);

    function sideController(authService) {
        var vm = this;

    }

})();