angular
    .module('app.layout')
    .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ["$scope", "__env", "USER_ROLES", "$rootScope", "logger", "auth", "config", "$state", "Idle", "session", "ngAudio","desktopNotification"];
function MainCtrl($scope, __env, USER_ROLES, $rootScope, logger, auth, config, $state, Idle, session, ngAudio, desktopNotification) {

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


    //"PageName" : ["role","role"]
    $scope.types = {
        settings: ['admin', 'employee'],
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

    $scope.$on('loggedIn', function (event) {
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
