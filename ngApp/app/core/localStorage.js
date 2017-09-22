(function () {
    "use strict";

    // Export
    angular
      .module('app.core')
      .factory('localStorage', localStorageServiceFactory);

    // Inject dependencies
    localStorageServiceFactory.$inject = ['$window'];

    function localStorageServiceFactory($window) {
        if ($window.localStorage) {
            return $window.localStorage;
        }
        throw new Error('Local storage support is needed');
    }


})();