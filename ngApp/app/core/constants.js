(function () {
    'use strict';

    var env = {};

    // Import variables if present (from env.js)
    if (window) {
        Object.assign(env, window.__env);
    }

    angular
        .module('app.core')
        .constant('toastr', toastr)
        .constant('__env', env)
        .constant('ngAuthSettings', {
            apiServiceBaseUri: env.SecurityUrl,
            clientId: env.clientId,
            clientSecret: env.clientSecret,
        })
        //.constant('USER_ROLES', {
        //    vendorManager: 'Vendor manager',//Vendor manager
        //    branchManager: 'Branch manager',
        //    operators: 'Operators',
        //    editor: 'Menu editor'
        //});
})();
