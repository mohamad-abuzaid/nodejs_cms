/* global $provide, $rootScope */

(function () {
    'use strict';
    var MainAppController = angular.module("MainAppController",
            ['ui.router', 'ngCookies', 'ngSanitize', 'pascalprecht.translate', 'angularFileUpload',
                'datatables', 'datatables.select']);

    // register the interceptor as a service
    MainAppController.factory('httpInterceptor', function ($cookies, $q, $location) {
        return {
            'request': function (request) {
                var user = $cookies.get('user'),
                        token = $cookies.get('token');

                if (user && token) {
                    user = JSON.parse(user);
                    token = token ? JSON.parse(token) : null;
                    request.headers = request.headers || {};
                    request.headers.Authorization = token;
                }

                console.log('Request: ');
                return request;
            },
            'requestError': function (rejection) {
                console.log('Request Error: ' + rejection.data);
                return $q.reject(rejection);
            },
            'response': function (response) {
                console.log('Response: ');
                // do something on success
                return response;
            },
            'responseError': function (response) {
                console.log('Response Error: ' + response);
                switch (response.status) {
                    // Unauthorized access 
                    case 401:
                        // Deauthenticate the global user
                        //Authentication.user = null;
                        //$location.path('/login');
                        break;
                        // Forbidden access
                    case 403:

                        break;
                        // Page not found
                    case 404:

                        break;
                }
                return response;
                //return $q.reject(response);
            }
        };
    });

    var staticData = {};
    var userRoles = staticData.userRoles = {
        guest: 1, // ...0001
        user: 2, // ...0010
        moderator: 4, // ...0100
        admin: 8      // ...1000
    };
    staticData.accessLevels = {
        guest: userRoles.guest | userRoles.user | userRoles.moderator | userRoles.admin, // ...1111
        user: userRoles.user | userRoles.moderator | userRoles.admin, // ...1110
        moderator: userRoles.moderator | userRoles.admin, // ...1100
        admin: userRoles.admin    // ...1000
    };
    MainAppController.constant('staticData', staticData);

    var onChangeConfig = ['$rootScope', '$location', '$state', '$cookies', '$translate', 'authService',
        function ($rootScope, $location, $state, $cookies, $translate, authService) {
            $rootScope.$on('$stateChangeStart', function (event, toState) {
                if (toState.data && toState.data.accessLevel) {
                    console.log('Auth Service: ' + authService);
                    var user = authService.getUserData();
                    if (!(toState.data.accessLevel & user.role)) {
                        event.preventDefault();
                        if ($location.url() !== '/account/login') {
                            $cookies.put('returnUrl', $location.url());
                        }
                        //$state.go('login');
                        window.location = '/login';
                        return;
                    }
                }
            });

            $rootScope.$on('$translateChangeSuccess', function (event, current, previous) {

            });
        }];

    var translationConfig = ['$translateProvider',
        function ($translateProvider) {

            $translateProvider.useStaticFilesLoader({
                prefix: '/localizations/locales-',
                suffix: '.json'
            });
            $translateProvider.preferredLanguage('en').useSanitizeValueStrategy('escape');
        }];

    var whenConfig = ['$urlRouterProvider', function ($urlRouterProvider) {

            $urlRouterProvider
                    .when('/login', ['$state', function ($state) {
                            console.log('Going Login');
                            $state.go('login');
                        }])
                    .when('/register', ['$state', function ($state) {
                            console.log('Going Register');
                            $state.go('register');
                        }])
                    .when('/admin/', ['$state', function ($state) {
                            console.log('Going Dashboard');
                            $state.go('admin.dashboard');
                        }])
                    .when('/front', ['$state', function ($state) {
                            $state.go('home');
                        }])
                    .otherwise('/login');
        }];

    var stateConfig = ['$stateProvider', '$locationProvider', '$httpProvider', 'staticData',
        function ($stateProvider, $locationProvider, $httpProvider, staticData) {

            /**************************** ACCOUNT ROUTES **************************/
            // Login route.
            $stateProvider.state('login', {
                url: '/account/login',
                controller: 'LoginController as lc',
                templateUrl: '/account/login.html'
            });
            // Register route.
            $stateProvider.state('register', {
                url: '/account/register',
                controller: 'RegisterController as rgc',
                templateUrl: '/account/register.html'
            });
            // Forgot route.
            $stateProvider.state('forgot', {
                url: '/account/forgot_password',
                controller: 'ForgotController as fc',
                templateUrl: '/account/forgot.html'
            });
            // Reset route.
            $stateProvider.state('reset', {
                url: '/account/reset_password',
                controller: 'ResetController as rc',
                templateUrl: '/account/reset.html'
            });
            /****************************** ADMIN ROUTES **************************/
            // Dashboard route.
            $stateProvider.state('admin', {
                url: '/admin',
                abstract: true,
                views: {
                    'navbar': {
                        controller: 'NavController as nvc',
                        templateUrl: '/admin/partials/navbar.html'
                    },
                    'sidebar': {
                        controller: 'SideController as sic',
                        templateUrl: '/admin/partials/sidebar.html'
                    },
                    'ctrlbar': {
                        controller: 'CtrlController as ctc',
                        templateUrl: '/admin/partials/controlbar.html'
                    },
                    'section': {
                        template: '<div data-ui-view></div>'
                    }
                },
                data: {
                    accessLevel: staticData.accessLevels.user
                }
            });
            // Dashboard routes.
            $stateProvider.state('admin.dashboard', {
                url: '/dashboard',
                controller: 'DashController as dac',
                templateUrl: '/admin/sections/dashboard/dashboard.html',
                data: {
                    accessLevel: staticData.accessLevels.user
                }
            });
            // Settings route.
            $stateProvider.state('admin.settings', {
                url: '/settings',
                template: '<div data-ui-view></div>',
                data: {
                    accessLevel: staticData.accessLevels.user
                }
            });
            $stateProvider.state('admin.settings.appearance', {
                url: '/appearance',
                controller: 'AppearanceController as apc',
                templateUrl: '/admin/sections/settings/appearance.html',
                data: {
                    accessLevel: staticData.accessLevels.user
                }
            });
            // Members route.
            $stateProvider.state('admin.members', {
                url: '/members',
                template: '<div data-ui-view></div>',
                abstract: true,
                data: {
                    accessLevel: staticData.accessLevels.user
                }
            });
            $stateProvider.state('admin.members.list', {
                url: '/list',
                controller: 'MembersController as mcv',
                templateUrl: '/admin/sections/members/list-members.html',
                data: {
                    accessLevel: staticData.accessLevels.user
                }
            });
            $stateProvider.state('admin.members.create', {
                url: '/create',
                controller: 'MembersController as mc',
                templateUrl: '/admin/sections/members/add-member.html',
                data: {
                    accessLevel: staticData.accessLevels.user
                }
            });
            $stateProvider.state('admin.members.view', {
                url: '/view',
                controller: 'MembersController as mc',
                templateUrl: '/admin/sections/members/view-member.html',
                data: {
                    accessLevel: staticData.accessLevels.user
                }
            });
            $stateProvider.state('admin.members.edit', {
                url: '/edit',
                controller: 'MembersController as mc',
                templateUrl: '/admin/sections/members/edit-member.html',
                data: {
                    accessLevel: staticData.accessLevels.user
                }
            });
            // Dashboard route.
            $stateProvider.state('admin.providers', {
                url: '/providers',
                controller: 'ProvidersController as prc',
                templateUrl: '/admin/sections/settings/providers.html',
                data: {
                    accessLevel: staticData.accessLevels.user
                }
            });
            // Dashboard route.
            $stateProvider.state('admin.clients', {
                url: '/clients',
                controller: 'ClientsController as cc',
                templateUrl: '/admin/sections/settings/clients.html',
                data: {
                    accessLevel: staticData.accessLevels.user
                }});
            // Dashboard route.
            $stateProvider.state('admin.services', {
                url: '/services',
                controller: 'ServicesController as src',
                templateUrl: '/admin/sections/settings/services.html',
                data: {
                    accessLevel: staticData.accessLevels.user
                }});
            // Dashboard route.
            $stateProvider.state('admin.payments', {
                url: '/payments',
                controller: 'PaymentsController as pyc',
                templateUrl: '/admin/sections/settings/payments.html',
                data: {
                    accessLevel: staticData.accessLevels.admin
                }
            });
            // Dashboard route.
            $stateProvider.state('admin.comms', {
                url: '/comms',
                controller: 'CommsController as cmc',
                templateUrl: '/admin/sections/settings/comms.html',
                data: {
                    accessLevel: staticData.accessLevels.user
                }
            });
            // Documentation route.
            $stateProvider.state('admin.docs', {
                url: '/docs',
                controller: 'DocsController as doc',
                templateUrl: '/admin/sections/documentation/documentation.html',
                data: {
                    accessLevel: staticData.accessLevels.user
                }
            });
            /****************************** FRONT ROUTES **************************/
            $stateProvider.state('home', {
                url: '/home',
                controller: 'HomeController as hc',
                templateUrl: '/account/login.html'
            });
            // TODO: Define FRONT ROUTES here.

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
            $httpProvider.interceptors.push('httpInterceptor');
        }];

    /***********************//////// DIRECTIVES /////////**********************/
    var uploadDirective = function ($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function (item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function (file) {
                var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function (scope, element, attributes) {
                if (!helper.support)
                    return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file))
                    return;
                if (!helper.isImage(params.file))
                    return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({width: width, height: height});
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    };

    var treeDirective = function () {
        return {
            restrict: 'EA',
            link: function (sc, elem, attrs) {
                $(elem).tree({
                    animationSpeed: 500,
                    accordion: true
                });
            }
        };
    };

    var boxWidgetDirective = function () {
        return {
            restrict: 'C',
            link: function (sc, elem, attrs) {
                $(elem).boxWidget({
                    animationSpeed: 500,
                    collapseIcon: 'fa-minus',
                    expandIcon: 'fa-plus',
                    removeIcon: 'fa-times'
                });
            }
        };
    };

    var dataMaskDirective = function () {
        return {
            restrict: 'EA',
            link: function (sc, elem, attrs) {
                $(elem).inputmask();
            }
        };
    };

    var datePickerDirective = function () {
        return {
            restrict: 'EA',
            link: function (sc, elem, attrs) {
                $(elem).datepicker({
                    autoclose: true
                });
            }
        };
    };

    var selectDirective = function () {
        return {
            restrict: 'C',
            link: function (sc, elem, attrs) {
                $(elem).select2({
                    allowClear: false
                });
            }
        };
    };

    var iCheckDirective = function () {
        return {
            restrict: 'EA',
            link: function (sc, elem, attrs) {
                $(elem).iCheck({
                    checkboxClass: 'icheckbox_square',
                    radioClass: 'iradio_square',
                    increaseArea: '20%' // optional
                });
            }
        };
    };

    MainAppController.config(whenConfig)
            .config(stateConfig)
            .config(translationConfig)
            .run(onChangeConfig)
            .directive('ul', treeDirective)
            .directive('box', boxWidgetDirective)
            .directive('select2', selectDirective)
            .directive('ngThumb', uploadDirective)
            .directive('checkButton', iCheckDirective)
            .directive('dmask', dataMaskDirective)
            .directive('dpicker', datePickerDirective);

})();
/*
 url: '/login?key',
 params: {
 key: {value: ""}
 },
 
 $urlRouterProvider.when('/account/admin', '/admin');
 $urlRouterProvider.when('/admin/account', '/account');
 
 angular.module("myModuleName")
 .run([
 "$state",
 function($state){
 $state.go('stateName');
 }
 ]);
 */