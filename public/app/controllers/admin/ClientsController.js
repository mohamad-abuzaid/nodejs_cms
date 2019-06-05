/* global key, MainAppController */

(function () {
    'use strict';

    angular
            .module('MainAppController').controller('ClientsController', ['$scope', '$http', function ClientsController($scope, $http) {
            $scope.ClientsData = [];
            $scope.EditData = [];
            $http({
                method: 'POST',
                url: '/api/clients/GetAll/'
            }).then(function successCallback(response) {
                $scope.ClientsData = response.data;
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.ReloadData = function () {
                $http({
                    method: 'POST',
                    url: '/api/clients/GetAll/'
                }).then(function successCallback(response) {
                    $scope.ClientsData = response.data;
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.EditClient = function (client_id) {
                $scope.EditData = [];
                $scope.EditData.client_id = client_id;
                var data = new Object();
                for (key in $scope.EditData) {
                    data[key] = $scope.EditData[key];
                }
                $http({
                    method: 'POST',
                    url: '/api/clients/GetAll/',
                    data: JSON.stringify(data)

                }).then(function successCallback(response) {
                    console.log(response.data);
                    response.data[0].client_birthdate = new Date(response.data[0].client_birthdate);
                    response.data[0].client_last_perio = new Date(response.data[0].client_last_perio);
                    $scope.EditData = response.data[0];
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.UpdateClient = function () {
                var data = new Object();
                for (key in $scope.EditData) {
                    data[key] = $scope.EditData[key];
                }
                $http({
                    method: 'POST',
                    url: '/api/clients/UpdateClient/',
                    data: JSON.stringify(data)
                }).then(function successCallback(response) {
                    console.log(response);
                }, function errorCallback(response) {
                    console.log(response);
                });
                $scope.ReloadData();
            };
            $scope.RemoveClient = function (_client_id) {
                $scope.EditData.client_id = _client_id;
                var data = new Object();
                data['client_id'] = $scope.EditData.client_id;
                $http({
                    method: 'POST',
                    url: '/api/clients/DeleteClient/',
                    data: JSON.stringify(data)
                }).then(function successCallback(response) {
                    console.log(response);
                }, function errorCallback(response) {
                    console.log(response);
                });
                $scope.ReloadData();
            };
            $scope.AddClient = function () {
                console.log($scope.EditData);
                if ($scope.EditData.client_id > 0) {
                    delete($scope.EditData.user_id);
                    delete($scope.EditData.user_admin);
                    delete($scope.EditData.user_email);
                    delete($scope.EditData.user_gender);
                    delete($scope.EditData.user_name);
                    delete($scope.EditData.user_password);
                    delete($scope.EditData.user_paypal_email);
                    delete($scope.EditData.user_phone);
                    $scope.UpdateClient();
                }
                return true;
                var data = new Object();
                for (key in $scope.EditData) {
                    data[key] = $scope.EditData[key];
                }
                console.log(data);
                $http({
                    method: 'POST',
                    url: '/api/clients/CreateClient/',
                    data: JSON.stringify(data)
                }).then(function successCallback(response) {
                    console.log(response);
                }, function errorCallback(response) {
                    console.log(response);
                });
                $scope.ReloadData();
            };
        }
    ]);

})();
