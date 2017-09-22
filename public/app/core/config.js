(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);
    core.config(configureFlow);

    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[ORLINE-CLIENT Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Orline - Client SPA',
        version: '1.0.0'
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', '$locationProvider', '$httpProvider', '__env',
        'exceptionHandlerProvider', 'unsavedWarningsConfigProvider'];

    /* @ngInject */
    function configure($logProvider, $locationProvider, $httpProvider, __env, exceptionHandlerProvider,
        unsavedWarningsConfigProvider) {

        // turn debugging off/on (no info or warn)
        $logProvider.debugEnabled(__env.enableDebug);

        // Configure the common exception handler
        exceptionHandlerProvider.configure(config.appErrorPrefix);

        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('authInterceptor');

        // We uncomment out the below line in order to change the navigate message
        //unsavedWarningsConfigProvider.navigateMessage = "ستخسر التغييرات التي قمت بها إذا تابعت عملية المغادرة";

        // We uncomment out the below line in order to change the refresh message
        //unsavedWarningsConfigProvider.reloadMessage = "إعادة تحميل الصفحة ستؤدي إلى عدم حفظ التغييرات التي قمت بها";
        //unsavedWarningsConfigProvider.logEnabled = true;
    }

    configureFlow.$inject = ['flowFactoryProvider', '__env'];

    function configureFlow(flowFactoryProvider, __env) {
        flowFactoryProvider.defaults = {
            target: __env.BackendUrl + '/folders/uploads/folder',
            permanentErrors: [404, 500, 501],
            maxChunkRetries: 2,
            chunkRetryInterval: 5000,
            simultaneousUploads: 4,
            chunkSize: 10 * 1024 * 1024, // 1 MB per chunk
        };

        flowFactoryProvider.on('catchAll', function (event) {
            console.log('catchAll', arguments);
        });

        // Can be used with different implementations of Flow.js
        flowFactoryProvider.factory = fustyFlowFactory;
    }

    core.config(IdleConfigure);
    IdleConfigure.$inject = ['IdleProvider', 'KeepaliveProvider', '__env'];

    function IdleConfigure(IdleProvider, KeepaliveProvider, __env) {
        // configure Idle settings
        IdleProvider.idle(__env.idleTime); // in seconds
        IdleProvider.timeout(__env.idleTimeout); // in seconds
        KeepaliveProvider.interval(2); // in seconds
    }

    core.run(UserConfiguration);
    UserConfiguration.$inject = ['$rootScope', 'session'];

    function UserConfiguration($rootScope, session) {

        // watch user status , in case no user info clear currentUser
        $rootScope.$watch(function () {
            return session.getUser();
        }, function (newUser, old) {
            if (newUser) {
                $rootScope.currentUser = {
                    userRole: newUser.roles,
                    vendorId: newUser.vendorId,
                    //currency: newUser.currency || "USD"
                };
            } else {
                //$rootScope.currentUser = {}
            }
        });
    }

    core.run(DesktopNotification);
    DesktopNotification.$inject = ['$rootScope', 'desktopNotification'];

    //Chrome Notification for desktop
    function DesktopNotification($rootScope, desktopNotification) {

        $rootScope.desktopNotifyIsSupported = desktopNotification.isSupported();
        $rootScope.desktopNotifyPermission = desktopNotification.currentPermission();

        ////////////////////

        if ($rootScope.desktopNotifyIsSupported) {
            
                desktopNotification.requestPermission().then(function (permission) {
                    $rootScope.desktopNotifyPermission = permission;
                }, function (permission) {
                    $rootScope.desktopNotifyPermission = permission;

                    // -> permission responses : true, false, denied
                });
        }
    }

})();