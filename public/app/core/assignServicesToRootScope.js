(function () {
    "use strict";

    // Export
    angular
      .module('app.core')
      .run(assignServicesToRootScope);

    // Inject dependencies
    assignServicesToRootScope.$inject = ['$rootScope', 'auth', 'session'];

    function assignServicesToRootScope($rootScope, auth, session) {
        $rootScope.auth = auth;
        $rootScope.session = session;
    }



})();