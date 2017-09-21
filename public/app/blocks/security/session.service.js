(function() {
    "use strict";

    // Export
    angular.module("blocks.security")
        .service('session', sessionService);

    // Inject dependencies
    sessionService.$inject = ['$log', 'localStorage'];      

    function sessionService($log, localStorage) {

        // Instantiate data when service
        // is loaded
        this._user = JSON.parse(localStorage.getItem('session.user'));
        this._accessToken = localStorage.getItem('session.accessToken') === "null" ?
                            null : localStorage.getItem('session.accessToken');

        this.getUser = function () {
            return this._user;
        };

        this.setUser = function (user) {
            this._user = user;
            localStorage.setItem('session.user', JSON.stringify(user));
            return this;
        };

        this.getAccessToken = function () {
            return this._accessToken;
        };

        this.setAccessToken = function (token) {
            this._accessToken = token;
            localStorage.setItem('session.accessToken', token);
            return this;
        };

        this.getFullName = function () {
            return this._user == null ? "" : this._user.fullName;
        };

        this.isInRole = function(role) {
            if (this._user == null || this._user.roles == null) return false;

            return this._user.roles.indexOf(role) != -1;
        };
        this.isInAnyRole =function(roles) {
            if (this._user == null || this._user.roles == null) return false;

            for (var i = 0; i < roles.length; i++) {
                if (this.isInRole(roles[i])) return true;
            }

            return false;
        }
        /**
         * Destroy session
         */
        this.destroy = function destroy() {
            this.setUser(null);
            this.setAccessToken(null);
        };

    }
    
})();