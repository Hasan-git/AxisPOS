(function () {
    'use strict';

    angular
        .module('blocks.router')
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$urlRouterProvider', 'USER_ROLES'];

    function config($stateProvider, $urlRouterProvider, USER_ROLES) {
        $urlRouterProvider.otherwise("/login");
        $stateProvider
            .state('login', {
                url: "/login",
                data: { pageTitle: 'Login', requiresLogin: false, roles: [] },
                views: {
                    'loginView': {
                        templateUrl: "app/account/login.html",
                        controller: Login,
                    }
                }
            })
            .state('accessdenied', {
                url: "/accessdenied",
                data: { pageTitle: 'Access Denied', requiresLogin: false },
                views: {
                    'loginView': {
                        templateUrl: "app/account/accessdenied.html",
                    }
                },
            })

            .state('abstract', {
                abstract: true,
                url: "",
                views: {
                    'mainView': {
                        templateUrl: "app/layout/content.html",
                    }
                }
            })

            .state('abstract.settings', {
                url: "/settings",
                templateUrl: "app/settings/settings.html",
                controller: Settings,
                data: {
                    pageTitle: 'Vendor settings',
                    requiresLogin: true,
                    roles: [USER_ROLES.admin],
                },
            })


        ;
    }

    run.$inject = ['$rootScope', '$state', 'editableOptions'];

    function run($rootScope, $state, editableOptions) {
        $rootScope.$state = $state;
        editableOptions.theme = 'bs3';
    }


})();
