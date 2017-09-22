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
            .state('abstract.dashboard', {
                url: "/dashboard",
                templateUrl: "app/dashboard/dashboard.html",
                controller: Dashboard,
                data: {
                    pageTitle: 'Dashboard',
                    requiresLogin: true,
                    roles: [USER_ROLES.vendorManager, USER_ROLES.branchManager],
                },
                resolve: {
                    resolvedVendorStatus: function (dashboardResource) {
                        return dashboardResource.vendorStatus.get().$promise.then(function (data) {
                            return JSON.parse(angular.toJson(data['result']));
                        });
                    },
                    resolvedVendorOrdersReport: function (dashboardResource, $rootScope) {
                        var offset = moment().utcOffset();
                        var params = {
                            vendorId: $rootScope.currentUser.vendorId,
                            from: moment().startOf('day').add(-1, 'days').utcOffset(offset * -1).format('YYYY-MM-DD HH:mm:ss Z'),
                            to: moment().endOf('day').utcOffset(offset * -1).format('YYYY-MM-DD HH:mm:ss Z')
                        }
                        return dashboardResource.vendorOrdersReport.getStatus(params).$promise.then(function (data) {
                            return JSON.parse(angular.toJson(data['result']));
                        });
                    }
                }
            })
            .state('abstract.orders', {
                url: "/orders/:navigateTo",
                templateUrl: "app/orders/orders.html",
                controller: Orders,
                data: {
                    pageTitle: 'Orders',
                    requiresLogin: true,
                    roles: [USER_ROLES.vendorManager, USER_ROLES.branchManager, USER_ROLES.operators],
                },
                resolve: {
                    _resolvedOrders: function (ordersResource, $rootScope) {
                        var params = {
                            vendorId: $rootScope.currentUser.vendorId,
                            page: 1,
                            size: 1000
                        }
                        return ordersResource._orders.get(params).$promise.then(function (data) {
                            return JSON.parse(angular.toJson(data));
                        });
                    }
                }
            })
            .state('abstract.menu', {
                url: "/menu",
                templateUrl: "app/menu/menu.html",
                controller: Menu,
                data: {
                    pageTitle: 'Menu',
                    requiresLogin: true,
                    roles: [USER_ROLES.vendorManager, USER_ROLES.branchManager, USER_ROLES.editor]
                },
                resolve: {
                    resolvedMenu: function (sectionResource, $rootScope) {
                        var params = {
                            vendorId: $rootScope.currentUser.vendorId,
                            page: 1,
                            size: 100
                        }
                        return sectionResource.menu.get(params).$promise.then(function (data) {
                            return JSON.parse(angular.toJson(data));
                        });
                    }
                }
            })
            .state('abstract.reports', {
                url: "/reports",
                templateUrl: "app/reports/reports.html",
                data: {
                    pageTitle: 'Reports',
                    requiresLogin: true,
                    roles: [USER_ROLES.vendorManager, USER_ROLES.branchManager],
                },
            })
            .state('abstract.userManagement', {
                url: "/userManagement",
                templateUrl: "app/userManagement/users.html",
                controller: userCtrl,
                data: {
                    pageTitle: 'User management',
                    requiresLogin: true,
                    roles: [USER_ROLES.vendorManager, USER_ROLES.branchManager],
                }
            })
            .state('abstract.branches', {
                url: "/branches",
                templateUrl: "app/branches/branches.html",
                controller: Branches,
                data: {
                    pageTitle: 'Branches',
                    requiresLogin: true,
                    roles: [USER_ROLES.vendorManager, USER_ROLES.branchManager],
                }
            })
            .state('abstract.settings', {
                url: "/settings",
                templateUrl: "app/settings/settings.html",
                controller: Settings,
                data: {
                    pageTitle: 'Vendor settings',
                    requiresLogin: true,
                    roles: [USER_ROLES.vendorManager],
                },
                resolve: {
                    resolvedVendorStatus: function (vendorResource) {
                        return vendorResource.vendorStatus.get().$promise.then(function (data) {
                            console.log(JSON.parse(angular.toJson(data.result)))
                            return JSON.parse(angular.toJson(data['result']));
                        });
                    },
                    resolvedContactInfo: function (vendorResource) {
                        return vendorResource.vendor.getContact().$promise.then(function (data) {
                            return JSON.parse(angular.toJson(data));
                        });
                    },
                    resolvedVendorCurrencies: function (vendorResource) {
                        return vendorResource.vendor.getVendorCurrencies().$promise.then(function (data) {
                            return JSON.parse(angular.toJson(data));
                        });
                    }
                }
            })
            .state('abstract.subscription', {
                url: "/subscription",
                templateUrl: "app/subscriptions/subscriptions.html",
                controller: Subscription,
                data: {
                    pageTitle: 'Subscription',
                    requiresLogin: true,
                    roles: [USER_ROLES.vendorManager],
                },
                resolve: {
                    resolvedCurrentSubcription: function (subscriptionsResource) {
                        return subscriptionsResource.current.get().$promise.then(function (data) {
                            return JSON.parse(angular.toJson(data));
                        });
                    },
                    resolvedPreviousSubcription: function (subscriptionsResource) {
                        return subscriptionsResource.previous.get().$promise.then(function (data) {
                            return JSON.parse(angular.toJson(data));
                        });
                    }
                }
            })

        ;
    }

    run.$inject = ['$rootScope', '$state', 'editableOptions'];

    function run($rootScope, $state, editableOptions) {
        $rootScope.$state = $state;
        editableOptions.theme = 'bs3';
    }


})();