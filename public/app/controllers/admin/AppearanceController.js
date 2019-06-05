/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    'use strict';

    angular
            .module('MainAppController')
            .controller('AppearanceController', [
                '$cookies', '$scope',
                appearanceController
            ]);

    function appearanceController($cookies, $scope) {

        $scope.changeSkin = changeSkin;
        function changeSkin(skin) {
            var bodyClass = $('body').attr('class').split(' ');           

            var myClass;
            for (myClass of bodyClass) {               
                if (myClass.startsWith("skin")) {
                    $('body').removeClass(myClass);
                    $('body').addClass(skin);
                    console.log('BODY CLASSES: ' + $('body').attr('class').split(' '));
                }
            }

            $cookies.put('skin', skin);
        }

        $scope.changeLayout = changeLayout;
        function changeLayout(layout) {
            var bodyClass = $('body').attr('class').split(' ');

            var myClass;
            for (myClass of bodyClass) {
                if (!myClass.startsWith("skin") && !myClass.startsWith("hold")) {
                    $('body').removeClass(myClass);
                    $('body').addClass(layout);
                }
            }

            $cookies.put('layout', layout);
        }
    }

})();