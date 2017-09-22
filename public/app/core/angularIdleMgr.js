(function () {
    "use strict";

    // Export
    angular
      .module('app.core')
      .run(angularIdleMgr);

    // Inject dependencies
    angularIdleMgr.$inject = ["Idle", "session"];

    function angularIdleMgr(Idle, session) {
        // start watching when the app runs. also starts the Keepalive service by default.
        var authData = session.getUser();
        if (authData) {
            {
                var tokenExpired = (new Date() > new Date(authData.expiration));
                if (tokenExpired === false)
                    Idle.watch();
            }
        }
    };

})();