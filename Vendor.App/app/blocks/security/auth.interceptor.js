(function () {
    "use strict";

    // Export
    angular
      .module('blocks.security')
      .factory('authInterceptor', authInterceptor);

    // Inject dependencies
    authInterceptor.$inject = ["$rootScope", "$q", "$location", "$injector", "session", "__env", "$timeout"];


    function authInterceptor($rootScope, $q, $location, $injector, session, __env, $timeout) {

        var _retryHttpRequest = function (config) {
            config.headers = config.headers || {};
            config.data = config.data || [];
            //config.headers.Accept = "application/json";
            
            if (session.getAccessToken()) {
                if (typeof config.data === 'string' && config.data.indexOf('grant_type=password') >= 0) {

                } else
                   config.headers.Authorization = 'Bearer ' + session.getAccessToken();
            }
            return config;
        }

        return {
            // Add authorization token to headers
            request: _retryHttpRequest,

            // Intercept 401s and redirect you to login
            responseError: function (rejection) {

                var deferred = $q.defer();

                if (rejection.status === 401) {
                    
                    //$rootScope.$state.go('login')
                    var tokenExpired = false;
                    var authData = session.getUser();
                    if (authData) {
                        tokenExpired = new Date() > new Date(authData.expiration);

                        if (authData.useRefreshTokens && tokenExpired) {
                            var authService = $injector.get('auth');
                            authService.refreshToken().then(function (response) {
                                _retryHttpRequest(rejection.config, deferred);
                            }, function () {
                                authService.logOut();
                                deferred.reject(rejection);
                            });
                        }
                        else {
                            session.destroy();
                            //$location.path('/login');
                            $timeout(() => { $location.path('/login'); }, 0)
                            deferred.reject(rejection);
                        }
                    }
                } else if (rejection.status === 403) /* access denied */{
                    var userExists = session.getUser();
                    if (userExists) {
                        //$location.path('/accessdenied');
                        $timeout(() => { $location.path('/accessdenied'); }, 0)
                    }
                    else {
                        session.destroy();
                        //$location.path('/login');
                        $timeout(() => { $location.path('/login'); }, 0)
                        deferred.reject(rejection);
                    }
                } else {
                    deferred.reject(rejection);
                }
                return deferred.promise;
            }
        };
    };

})();