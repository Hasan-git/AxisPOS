angular
    .module('app.layout')
    .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ["$scope", "__env", "USER_ROLES", "$rootScope", "logger", "auth", "config", "$state", "Idle", "session", "Hub", "ngAudio","desktopNotification"];
function MainCtrl($scope, __env, USER_ROLES, $rootScope, logger, auth, config, $state, Idle, session, Hub, ngAudio, desktopNotification) {

    $scope.connected = [];
    $scope.notifications = [];
    $scope.notificationsUnreadCount = 0;

    var notifyPermission = $rootScope.desktopNotifyPermission;
    var notifyIsSupported = $rootScope.desktopNotifyIsSupported;
    
    $scope.user = session.getUser();

    $scope.notificationSound = ngAudio.load("sounds/notification.mp3"); // returns NgAudioObject

    $scope.markAsRead = function() {
        angular.forEach($scope.notifications, function (value, key) {
            value.unread = false;
        });
        $scope.notificationsUnreadCount = 0;
    }


    $scope.types = {
        dashboard: ['Vendor manager', 'Branch manager'],
        orders: ['Vendor manager', 'Branch manager', 'Operators'],
        menu: ['Vendor manager', 'Branch manager', 'Menu editor'],
        reports: ['Vendor manager', 'Branch manager'],
        allAdmins: ['Vendor manager', 'Branch manager'],
        admin: ['Vendor manager'],
    };

    ////////////////////////////////////////



    Array.prototype.diff = function (arr2) {
        var ret = [];

        this.sort();
        arr2 = angular.isArray(arr2) ? arr2 : [arr2];
        arr2.sort();

        for (var i = 0; i < this.length; i += 1) {
            if (arr2.indexOf(this[i]) > -1) {
                ret.push(this[i]);
            }
        }
        return ret;
    };

    $scope.logout = function () {

        if ($scope.myDeeplyNestedForm) {
            $scope.myDeeplyNestedForm.$pristine = true;
            $scope.myDeeplyNestedForm.$dirty = false;
        }
        auth.logOut();
        $state.go("login", { reason: "logout" });
    }

    $scope.$on('formLocator', function (event) {
        $scope.myDeeplyNestedForm = event.targetScope.myForm;
    });

    $scope.$on('IdleStart', function () {
        // the user appears to have gone idle
        logger.info('Idle Start', null);

    });

    $scope.$on('IdleWarn', function (e, countdown) {
        // follows after the IdleStart event, but includes a countdown until the user is considered timed out
        // the countdown arg is the number of seconds remaining until then.
        // you can change the title or display a warning dialog from here.
        // you can let them resume their session by calling Idle.watch()
        logger.warning('Session timeout in ' + countdown + " sec", null);
        console.log("IdleWarning")

    });

    $scope.$on('IdleTimeout', function () {
        // the user has timed out (meaning idleDuration + timeout has passed without any activity)
        // this is where you'd log them
        var authData = session.getUser();
        if (authData) {
            session.destroy();

            if ($scope.myDeeplyNestedForm) {
                $scope.myDeeplyNestedForm.$pristine = true;
                $scope.myDeeplyNestedForm.$dirty = false;
            }

            $state.go('login');
        }
        logger.error('Your session timed-out', null);
    });

    $scope.$on('IdleEnd', function () {
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
        //  logger.success('Idle End', null);
    });

    $scope.$on('Keepalive', function () {
        // do something to keep the user's session alive
    });

    var hub = new Hub('vendorHub',
    {
        rootPath: __env.SignalrUrl,
        jsonp: true,
        logging: false,
        autoConnect: auth.isLoggedIn(),
        transport: ['webSockets', 'longPolling'],
        //client side methods
        listeners: {
            'newConnection': function (id) {
                $scope.connected.push(id);
                $scope.$apply();
            },
            'removeConnection': function (id) {
                $scope.connected.splice($scope.connected.indexOf(id), 1);
                $scope.$apply();
            },
            //'notify': function (message) {
            //    logger.success('Notification: ' + message, null);
            //},
            'writeStatus': function (message) {

                $scope.notifications.unshift({ message: message, unread: true });
                $scope.notificationsUnreadCount = $scope.notificationsUnreadCount + 1;
                var outMessage = "A  [" + message.statusDisplay + "] order is received !";
                $scope.notificationSound.play();
                logger.success(outMessage, null);
            },
            'addOrder': function (order) {
                // send an event and catch it in the Orders page.
                $rootScope.$emit('NewOrderAdded', { order: order });
                $rootScope.$apply();
            }
        },

        //server side methods
        methods: ['tell'],

        //query params sent on initial connection
        queryParams: {
            'BearerToken': session.getAccessToken()
        },
        //handle connection error
        errorHandler: function (error) {
            console.error(error);
        },

        stateChanged: function (state) {
            switch (state.newState) {
                case $.signalR.connectionState.connecting:
                    //your code here
                    break;
                case $.signalR.connectionState.connected:
                    //your code here
                    break;
                case $.signalR.connectionState.reconnecting:
                    //your code here
                    break;
                case $.signalR.connectionState.disconnected:
                    //your code here
                    break;
            }
        }
    });


    $scope.$on('loggedIn', function (event) {
        //hub.queryParams.BearerToken = session.getAccessToken();            
        hub.connect({ 'BearerToken': session.getAccessToken() })
            .done(function () {
                console.log("signalr connected");
            });
    });

    // chrome notification for desktop
    $scope.showNotification = function () {

        if (notifyPermission.toString() != "denied" && notifyIsSupported) {

            var notify = desktopNotification.show('Notification', {
                body: 'New Order Submitted !',
                icon: 'img/orline.png',
                autoClose: true,
                onClick: function () {
                    alert('New Order Submitted !');
                }
            });
        }
    }

};
