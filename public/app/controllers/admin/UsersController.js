/* global MainAppController, key */

(function () {
    'use strict';

    angular
            .module('MainAppController').controller('UsersController', ['$scope', '$http', function UsersController($scope, $http) {
            $scope.UsersData = [];
            $scope.EditData = {
                'user_id': '',
                'user_password': ''
            };

            $http({
                method: 'POST',
                url: '/api/users/GetAll/'
            }).then(function successCallback(response) {
                $scope.UsersData = response.data;
            }, function errorCallback(response) {
                console.log(response);
            });


            $scope.EditPassword = function (user_id) {
                $scope.EditData.user_id = user_id;
            };

            $scope.UpdatePassword = function () {
                var data = new Object();
                for (key in $scope.EditData) {
                    data[key] = $scope.EditData[key];
                }
                $http({
                    method: 'POST',
                    url: '/api/users/UpdateUser/',
                    data: JSON.stringify(data)

                }).then(function successCallback(response) {
                    console.log(response);
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.RemoveUser = function (_user_id) {
                $scope.EditData.user_id = _user_id;
                var data = new Object();
                for (key in $scope.EditData) {
                    data[key] = $scope.EditData[key];
                }
                $http({
                    method: 'POST',
                    url: '/api/users/DeleteUser/',
                    data: JSON.stringify(data)

                }).then(function successCallback(response) {
                    console.log(response);
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        }
    ]);

})();
