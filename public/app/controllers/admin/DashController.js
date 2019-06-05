
(function() {
    'use strict';

    angular
        .module('MainAppController')
        .controller('DashController', [
            '$http',
            dashController
        ]);

    function dashController($http) {

//        vm.message = '';
//
//        $http({ method: 'GET', url: '/api/dashboard' })
//            .then(function(response) {
//                if(response && response.data) {
//                    vm.message = response.data.message;
//                }
//            });
    }
})();