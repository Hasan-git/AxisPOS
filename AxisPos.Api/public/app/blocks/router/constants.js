(function () {
    'use strict';

    var env = {};

    // Import variables if present (from env.js)
    if (window) {
        Object.assign(env, window.__env);
    }

    angular
        .module('blocks.router')
        .constant('USER_ROLES', {
            vendorManager: 'Vendor manager',
            branchManager: 'Branch manager',
            operators: 'Operators',
            editor: 'Menu editor'
        });
})();