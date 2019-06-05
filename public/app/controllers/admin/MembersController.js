/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    'use strict';
    angular
            .module('MainAppController')
            .controller('MembersController', [
                '$cookies', '$scope', '$compile', '$http', '$state', 'FileUploader', 'DTColumnDefBuilder',
                membersController
            ]);
    function membersController($cookies, $scope, $compile, $http, $state, FileUploader) {
        var vm = this;
        $scope.saveError = false;
        $scope.saveSuccess = false;
        $scope.saveErrorMessage = null;
        $scope.uploadTemplateUrl = "/helpers/upload-file.html";
        var token = $cookies.get('token');
        token = token ? JSON.parse(token) : null;

        $scope.selectedMember = JSON.parse(localStorage.getItem('selected_member'));
        $scope.selected = {};
        $scope.selectAll = false;

        vm.lang = getLanguage();
        function getLanguage() {
            var langg = "";
            switch ($cookies.get('language')) {
                case 'ar':
                    langg = "/localizations/datatables/datatables-ar.json";
                    break;
                case 'en':
                    langg = "/localizations/datatables/datatables-en.json";
                    break;
                default:
                    langg = "/localizations/datatables/datatables-en.json";
                    break;
            }
            return langg;
        }

        $scope.dtInstance = {};
        $scope.dtOptions = {
            ajax: {
                url: '/api/getmembers',
                dataType: 'json',
                type: 'GET',
                dataSrc: 'members',
                beforeSend: function (req) {
                    req.setRequestHeader("Authorization", token);
                }
            },
            paging: true,
            paginationType: 'full_numbers',
            displayLength: 10,
            lengthChange: true,
            searching: true,
            ordering: true,
            info: true,
            language: {
                url: vm.lang
            },
            select: true,
            stateSave: true,
            autoWidth: false,
            createdRow: createdRow,
            aoColumns: [
                {
                    mData: null,
                    render: function (data, type, full, meta) {
                        $scope.selected[full.id] = false;
                        return '<input type="checkbox" ng-model="selected[' + data.id + ']" ng-click="toggleOne(selected)">';
                    }
                },
                {mData: 'first_name'},
                {mData: 'last_name'},
                {mData: 'email'},
                {mData: 'city'},
                {mData: 'country'},
                {
                    mData: null,
                    render: getTableActions
                }
            ],
            aoColumnDefs: [
                {
                    aTargets: 0,
                    bSortable: false
                },
                {
                    aTargets: 6,
                    bSortable: false
                }
            ]
        };

        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }
        function getTableActions(data, type, full, meta) {
            var member = JSON.stringify(data);
            var actions = "<button type='button' ng-click='viewMember(" + member + ")' class='btn btn-success btn-xs'>"
                    + "<span class='glyphicon glyphicon-eye-open'></span>"
                    + "</button>"
                    + "<button type='button' ng-click='editMember(" + member + ")' class='btn btn-warning btn-xs'>"
                    + "<span class='glyphicon glyphicon-edit'></span>"
                    + "</button>"
                    + "<button type='button' ng-click='deleteMember(" + member + ")' class='btn btn-danger btn-xs'>"
                    + "<span class='glyphicon glyphicon-trash'></span>"
                    + "</button>";
            return actions;
        }
        $scope.toggleAll = toggleAll;
        function toggleAll(selectAll, selectedItems) {
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    selectedItems[id] = selectAll;
                }
            }
        }
        $scope.toggleOne = toggleOne;
        function toggleOne(selectedItems) {
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    if (!selectedItems[id]) {
                        vm.selectAll = false;
                        return;
                    }
                }
            }
            $scope.selectAll = true;
        }
        $scope.viewMember = viewMember;
        function viewMember(member) {
            $scope.selectedMember = member;
            localStorage.setItem('selected_member', JSON.stringify($scope.selectedMember));
            $state.go('admin.members.view');
        }
        $scope.editMember = editMember;
        function editMember(member) {
            $scope.selectedMember = member;
            console.log("SelectedMember: " + JSON.stringify($scope.selectedMember));
            localStorage.setItem('selected_member', JSON.stringify($scope.selectedMember));
            $state.go('admin.members.edit');
        }
        $scope.deleteMember = deleteMember;
        function deleteMember(member) {
            $scope.selectedMember = member;
            localStorage.setItem('selected_member', JSON.stringify($scope.selectedMember));
        }

        $scope.fileName = null;
        var uploader = $scope.uploader = new FileUploader({
            alias: 'avatar',
            url: '/api/memberphoto',
            autoUpload: true,
            withCredentials: true,
            headers: {Authorization: token}});
        uploader.filters.push({
            name: 'sizeFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var size = item.size;
                return (size / 1024 / 1024) < 5;
            }});
        uploader.filters.push({
            name: 'typeFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        uploader.filters.push({
            name: 'queueFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 1;
            }
        });
        uploader.filters.push({
            name: 'timeoutFilter',
            fn: function (item /*{File|FileLikeObject}*/, options, deferred) {
                setTimeout(deferred.resolve, 1e3);
            }
        });
        $scope.saveMember = saveMember;
        function saveMember() {
            $scope.saveError = false;
            $scope.saveSuccess = false;
            $scope.saveErrorMessage = null;
            if (!$scope.email || !$scope.fname
                    || !$scope.lname || !$scope.dob
                    || !$scope.address || !$scope.zip
                    || !$scope.city || !$scope.country
                    || !$scope.mobile || !$scope.username
                    ) {
                $scope.saveError = true;
                $scope.saveErrorMessage = 'fill_required';
                return;
            }

            var newMember = {};
            newMember.email = $scope.email;
            newMember.username = $scope.username;
            newMember.fname = $scope.fname;
            newMember.lname = $scope.lname;
            newMember.dob = $scope.dob;
            newMember.address = $scope.address;
            newMember.zip = $scope.zip;
            newMember.city = $scope.city;
            newMember.country = $scope.country;
            newMember.phone = $scope.phone;
            newMember.mobile = $scope.mobile;
            newMember.gender = $scope.male ? 0 : 1;
            newMember.address2 = $scope.address2;
            newMember.job = $scope.job;
            newMember.marital = $scope.marital;
            newMember.doj = $scope.doj;
            newMember.bio = $scope.bio;
            newMember.photo = $scope.fileName;
            var reqObj = {
                method: 'POST',
                url: '/api/memberscreate',
                data: {
                    newMember: newMember
                }
            };
            return $http(reqObj).then(function (response) {
                if (response && response.data) {
                    if (response.data.success) {
                        $scope.saveSuccess = true;
                        $scope.saveErrorMessage = 'save_success';
                    } else {
                        $scope.saveErrorMessage = response.data.message;
                        $scope.saveError = true;
                    }
                }
            });
        }

        /************************ UPLOAD FIILE CALLBACKS **********************/         
        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
            if (filter.name !== 'undefined' && filter.name === 'sizeFilter') {
                $scope.saveError = true;
                $scope.saveErrorMessage = 'file size error';
            } else if (filter.name !== 'undefined' && filter.name === 'typeFilter') {
                $scope.saveError = true;
                $scope.saveErrorMessage = 'file type error';
            } else if (filter.name !== 'undefined' && filter.name === 'timeoutFilter') {
                $scope.saveError = true;
                $scope.saveErrorMessage = 'file time error';
            }
        };
        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (fileItem) {
            console.info('onBeforeUploadItem', fileItem);
            var timeStampInMs = Date.now ? Date.now() : new Date().getTime();
            $scope.fileName = fileItem.file.name = timeStampInMs + fileItem.file.name;
        };
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            $scope.saveErrorMessage = response;
            $scope.saveError = true;
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
            if (response) {
                if (!response.success) {
                    $scope.saveErrorMessage = response.message;
                    $scope.saveError = true;
                } else {
                    $scope.saveSuccess = true;
                    $scope.saveErrorMessage = response.message;
                }
            }
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };
    }

}
)();