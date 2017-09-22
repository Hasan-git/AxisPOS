(function () {
    "use strict";

    // Export
    angular.module("blocks.security")
      .service('auth', AuthService);

    // Inject dependencies
    AuthService.$inject = ["$http", "$q", "session", "__env", "ngAuthSettings", "$state", "$timeout"];

    function AuthService($http, $q, session, __env, ngAuthSettings, $state, $timeout) {

        var vm = this;
        /**
        * Check whether the user is logged in
        * @returns boolean
        */
        vm.isLoggedIn = function isLoggedIn() {
            return session.getUser() !== null;
        };

        /**
        * @returns roles
        */
        vm.getUserRoles = function isLoggedIn() {
            var user = session.getUser();
            if(user)
                return user.roles
            else
                return  [];
        };

        /**
        * Redirect user to default page based on role
        * @returns {*|Promise}
        */
        vm.defaultPage = function () {
            var role = session.getUser().roles;
            switch (session.isInAnyRole(role)) {
                case session.isInAnyRole(['admin']):
                    $timeout(() => { $state.go('abstract.settings') }, 0)
                    break;
                case session.isInAnyRole(['employee']):
                    $timeout(() => { $state.go('abstract.settings') }, 0)
                    break;
                default:
                    $timeout(() => { $state.go('accessdenied') }, 0)
            }
            return true;
        };

        /**
        * Log in
        *
        * @param credentials
        * @returns {*|Promise}
        */
        vm.logIn = function (loginData) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            data = data + "&client_id=" + ngAuthSettings.clientId+ "&client_secret=" + ngAuthSettings.clientSecret +"&scope=*";

            if (loginData.useRefreshTokens) {
                data = data + "&client_id=" + ngAuthSettings.clientId+ "&client_secret=" + ngAuthSettings.clientSecret;
            }

            var deferred = $q.defer();

            $http.post(__env.SecurityUrl + '/oauth/token', data,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function (response) {

                    var data = response.data;
                    var user = {};
                    if (loginData.useRefreshTokens) {
                        user = {
                            token: data.access_token,
                            expiration: addSeconds(new Date(), data.expires_in),
                            userName: loginData.userName,
                            refreshToken: data.refresh_token,
                            useRefreshTokens: true,
                        };
                    }
                    else {
                        user = {
                            token: data.access_token,
                            expiration: addSeconds(new Date(), data.expires_in),
                            userName: loginData.userName,
                            refreshToken: "",
                            useRefreshTokens: false
                        };
                    }
                    session.setAccessToken(data.access_token);
                    vm.getUserInfo(loginData.userName)
                        .then(function (info) {

                            //set User Info
                            user.roles = info.roles;
                            user.fullName = info.name;
                            //user.claims = info.claims;
                            //user.vendorId = info.vendorId;

                            session.setUser(user);

                            deferred.resolve(response);
                        });

                },
            function (err, status) {
                vm.logOut();
                deferred.reject(err);
            });

            return deferred.promise;
        };

        vm.getUserInfo = function (userName) {
            return $http.get(__env.SecurityUrl + '/api/users/user/' + userName)
                            .then(function (response) {
                                //First function handles success
                                return response.data;
                            },
                                function (response) {
                                    //Second function handles error
                                    return {};
                                });
        };

        /**
        * Log out
        *
        * @returns {*|Promise}
        */
        vm.logOut = function () {
            //return $http
            //  .get(__env.SecurityUrl + '/api/logout')
            //  .then(function (response) {

            // Destroy session in the browser
            session.destroy();
            //});

        };

        vm.refreshToken = function () {
            var deferred = $q.defer();

            var user = session.getUser();

            if (user != null) {

                if (user.useRefreshTokens) {

                    var data = "grant_type=refresh_token&refresh_token=" + user.refreshToken + "&client_id=" + ngAuthSettings.clientId+ "&client_secret=" + ngAuthSettings.clientSecret;

                    session.destroy();

                    $http.post(__env.SecurityUrl + 'oauth/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                        .then(function (response) {

                        user = {
                            token: response.access_token,
                            expiration: addSeconds(new Date(), response.expires_in),
                            userName: response.userName,
                            refreshToken: response.refresh_token,
                            useRefreshTokens: true
                        };

                        session.setAccessToken(data.access_token);
                        vm.getUserInfo(loginData.userName)
                            .then(function (info) {

                                //set User Info
                                user.roles = info.roles;
                                user.fullName = info.fullName;
                                user.claims = info.claims;
                                user.vendorId = info.vendorId;

                                session.setUser(user);

                                deferred.resolve(response);
                            });

                    }, function (err, status) {
                        vm.logOut();
                        deferred.reject(err);
                    });
                }
            }

            return deferred.promise;
        };
    }

    function addSeconds(date, seconds) {
        return new Date(date.getTime() + seconds * 1000);
    }

})();
