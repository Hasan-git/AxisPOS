
(function () {
    "use strict";

    var env = {};

    // Import variables if present (from environment.js)
    if (window) {
        Object.assign(env, window.__env);
    }

    angular
        .module("blocks.services", ["ngResource"])
        .constant('__env', env)
        .constant('ngAuthSettings', {
            apiServiceBaseUri: env.SecurityUrl,
            clientId: 'ngVendorApp'
        })
    	//.constant("appSettings",
        //{
        //    //serverPath: "http://localhost:5400/Api/appdata/"
        //    serverPath: "http://o2o-vendor-cms-demo.azurewebsites.net/Api/appdata/"
        //})
        //.constant("appSetting",
        //{
        //    //serverPath: "https://o2o-vendor-api-demo.azurewebsites.net/api/"
        //    serverPath: "https://localhost:44395/api/"
        //})
    ;
}());
