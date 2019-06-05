
(function () {
    'use strict';

    angular
            .module('MainAppController').controller('ProvidersController', ['$scope', '$http', function ProvidersController($scope, $http) {
            $scope.ProvidersData = [];
            $scope.EditData = [];
            $http({
                method: 'POST',
                url: '/api/providers/GetAll/'
            }).then(function successCallback(response) {
                $scope.ProvidersData = response.data;
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.ReloadData = function () {
                $http({
                    method: 'POST',
                    url: '/api/providers/GetAll/'
                }).then(function successCallback(response) {
                    $scope.ProvidersData = response.data;
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.EditProvider = function (provider_id) {
                $scope.EditData = [];
                $scope.EditData.provider_id = provider_id;
                var data = new Object();
                for (key in $scope.EditData) {
                    data[key] = $scope.EditData[key];
                }
                $http({
                    method: 'POST',
                    url: '/api/providers/GetAll/',
                    data: JSON.stringify(data),
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.EditData = response.data[0];
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.UpdateProvider = function () {
                var data = new Object();
                for (key in $scope.EditData) {
                    data[key] = $scope.EditData[key];
                }
                $http({
                    method: 'POST',
                    url: '/api/providers/UpdateProvider/',
                    data: JSON.stringify(data)
                }).then(function successCallback(response) {
                    console.log(response);
                }, function errorCallback(response) {
                    console.log(response);
                });
                $scope.ReloadData();
            };
            $scope.RemoveProvider = function (_provider_id) {
                $scope.EditData.provider_id = _provider_id;
                var data = new Object();
                data['provider_id'] = $scope.EditData.provider_id;
                $http({
                    method: 'POST',
                    url: '/api/providers/DeleteProvider/',
                    data: JSON.stringify(data)
                }).then(function successCallback(response) {
                    console.log(response);
                }, function errorCallback(response) {
                    console.log(response);
                });
                $scope.ReloadData();
            };
            $scope.AddProvider = function () {
                if ($scope.EditData.provider_id > 0) {
                    delete($scope.EditData.user_id);
                    delete($scope.EditData.user_admin);
                    delete($scope.EditData.user_email);
                    delete($scope.EditData.user_gender);
                    delete($scope.EditData.user_name);
                    delete($scope.EditData.user_password);
                    delete($scope.EditData.user_paypal_email);
                    delete($scope.EditData.user_phone);
                    $scope.UpdateProvider();
                    console.log($scope.EditData);
                }
                return true;
                var data = new Object();
                for (key in $scope.EditData) {
                    data[key] = $scope.EditData[key];
                }
                console.log(data);
                $http({
                    method: 'POST',
                    url: '/api/providers/CreateProvider/',
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
