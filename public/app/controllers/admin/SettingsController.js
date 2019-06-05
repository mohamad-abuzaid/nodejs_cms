    /* global MainAppController, key, $_SuccessMessage */

MainAppController.controller('SettingsController', ['$scope', '$http', function SettingsController($scope, $http) {

            $scope.settings = [];
            $http({
                method: 'GET',
                url: '/api/settings/GetSettings/'
            }).then(function successCallback(response) {
                var _settinga_data = new Array();
                response.data.forEach(function (_val, _key) {
                    try {
                        _val.setting_value = angular.fromJson(new String(_val.setting_value).replace(/\\|\\+/g, ''));
                        _settinga_data[_val.setting_name] = _val.setting_value;
                    } catch (e) {
                        _settinga_data[_val.setting_name] = _val.setting_value;
                    }

                });
                $scope.settings = _settinga_data;
            }, function errorCallback(response) {
                console.log(response);
            });

            $scope.submit = function () {
                var data = new Object();
                for (key in $scope.settings) {
                    data[key] = $scope.settings[key];
                }
                $http({
                    'method': 'post',
                    'url': '/api/settings/Update/',
                    'data': JSON.stringify(data)
                    
                }).then(function successCallback(response) {
                    console.clear();
                    var ResponseData = angular.fromJson(response.data);
                    if (ResponseData.hasOwnProperty('success') && ResponseData.success === true) {
                        console.log(ResponseData.success + " : 000");
                        $('[ng-model="SuccessMessage"]').html($.sprintf($_SuccessMessage, 'تم حفظ البيانات بنجاح'));
                    } else {
                        console.log(ResponseData);
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

        }
    ]);


