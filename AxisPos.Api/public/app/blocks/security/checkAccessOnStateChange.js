(function (angular) {

    // Export
    angular
      .module('blocks.security')
      .run(checkAccessOnStateChange);

    // Inject dependencies
    checkAccessOnStateChange.$inject = ["$rootScope", "$state", "$location", "auth", "session", "$window", "$anchorScroll"];

    function checkAccessOnStateChange($rootScope, $state, $location, auth, session, $window, $anchorScroll) {

        var baseUrl = $location.protocol() + "://" + location.host;

        ////////////

        // Listen for location changes
        // This happens before route or state changes
        $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
            
            // Autoscroll
            $anchorScroll();
                
            if (!auth.isLoggedIn()) {
                // Redirect to login
                // no logged user, we should be going to #login
                if (newUrl == baseUrl + "/login") {
                    // already going to #login, no redirect needed
                } else {
                    // not going to #login, we should redirect now
                    event.preventDefault();
                    $state.go('login');
                }
            } else {
                // if user is loggedin and token is not expired
                // prevent user from opening login page
                if (newUrl == baseUrl + '/login') {
                    var authData = session.getUser();
                    if (authData) {
                        var tokenExpired = (new Date() > new Date(authData.expiration));
                        if (tokenExpired === false) {
                            event.preventDefault();
                            auth.defaultPage()
                        }
                    }
                }
            }
        });

        //// Listen for route changes when using ngRoute
        $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
            // Here we simply check if logged in but you can
            // implement more complex logic that inspects the
            // route to see if access is allowed or not
            if (!auth.isLoggedIn()) {
                // Redirect to login
                // no logged user, we should be going to #login
                if (nextRoute.templateUrl == "app/account/login.html") {
                    // already going to #login, no redirect needed
                } else {
                    // not going to #login, we should redirect now
                    event.preventDefault();
                    $state.go('login');
                }
            } 
        });

        // Listen for state changes when using ui-router
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // Here we simply check if logged in but you can
            // implement more complex logic that inspects the
            // state to see if access is allowed or not
            var isAuthenticationRequired = toState.data && toState.data.requiresLogin && !auth.isLoggedIn();
            
            if (isAuthenticationRequired) {

                // Redirect to login

                // Prevent state change
                event.preventDefault();
                $state.go('login');
            }
            if (toState.data.roles &&
                toState.data.roles.length > 0 &&
                !session.isInAnyRole(toState.data.roles)) {

                event.preventDefault();
                if (!isAuthenticationRequired) {
                    // user is signed in but not
                    // authorized for desired state
                    $state.go('accessdenied');
                } else {

                    // user is not authenticated. Stow
                    // the state they wanted before you
                    // send them to the sign-in state, so
                    // you can return them when you're done
                    $rootScope.returnToState
                        = $rootScope.toState;
                    $rootScope.returnToStateParams
                        = $rootScope.toStateParams;

                    $state.go('login');
                }
            }
        });
    }


})(angular);