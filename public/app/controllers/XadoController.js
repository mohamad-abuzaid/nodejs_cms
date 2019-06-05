/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    'use strict';

    angular
            .module('MainAppController')
            .controller('XadoController', [
                '$cookies', '$scope', '$translate',
                xadoController
            ]);

    function xadoController($cookies, $scope, $translate) {
        $scope.initLang = initLang;
        $scope.initSkin = initSkin;
        $scope.initLayout = initLayout;

        if (typeof $cookies.get('language') !== 'undefined' && $cookies.get('language') !== '')
            initLang($cookies.get('language'));

        if (typeof $cookies.get('skin') !== 'undefined' && $cookies.get('skin') !== '')
            initSkin($cookies.get('skin'));

        if (typeof $cookies.get('layout') !== 'undefined' && $cookies.get('layout') !== '')
            initLayout($cookies.get('layout'));


        function initLang(langKey) {
            $translate.use(langKey);

            if (langKey === 'en') {
                $('#bst-rtl').attr('rel', 'stylesheet alternate');
                $('#admn').attr('rel', 'stylesheet');
                $('#admn-rtl').attr('rel', 'stylesheet alternate');
                $('#all-skn').attr('rel', 'stylesheet');
                $('#all-skn-rtl').attr('rel', 'stylesheet alternate');
                $('#accLgn').attr('rel', 'stylesheet');
                $('#accLgn-rtl').attr('rel', 'stylesheet alternate');

            } else if (langKey === 'ar') {
                $('#bst-rtl').attr('rel', 'stylesheet');
                $('#admn').attr('rel', 'stylesheet alternate');
                $('#admn-rtl').attr('rel', 'stylesheet');
                $('#all-skn').attr('rel', 'stylesheet alternate');
                $('#all-skn-rtl').attr('rel', 'stylesheet');
                $('#accLgn').attr('rel', 'stylesheet alternate');
                $('#accLgn-rtl').attr('rel', 'stylesheet');
            }
            
            $cookies.put('language', langKey);
        }

        function initSkin(skin) {
            var bodyClass = $('body').attr('class').split(' ');
            console.log('BODY CLASSES: ' + bodyClass);

            var myClass;
            for (myClass of bodyClass) {
                if (myClass.startsWith("skin")) {
                    $('body').removeClass(myClass);
                    $('body').addClass(skin);
                    console.log('BODY CLASSES: ' + $('body').attr('class').split(' '));
                }
            }
        }

        function initLayout(layout) {
            var bodyClass = $('body').attr('class').split(' ');

            var myClass;
            for (myClass of bodyClass) {
                if (!myClass.startsWith("skin") && !myClass.startsWith("hold") && !myClass.startsWith("my-login")) {
                    $('body').removeClass(myClass);
                    $('body').addClass(layout);
                }
            }
        }
    }

})();