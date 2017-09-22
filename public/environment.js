(function (window) {
    window.__env = window.__env || {};

    // API url
    //window.__env.BackendUrl = "https://o2o-vendor-api-demo.azurewebsites.net/api/v1.0";
    window.__env.BackendUrl = "http://127.0.0.1:8080/api";

    // Security API url
    //window.__env.SecurityUrl = "http://o2o-login-demo.azurewebsites.net/";
    window.__env.SecurityUrl = "http://127.0.0.1:8080/api/";

    //window.__env.SignalrUrl = "https://localhost:44395/signalr";

    //window.__env.vendorId = "DC57171B-ECE0-439D-93BF-0B55807172FF";
    window.__env.clientId = 'ngVendorApp';
    // Base url
    window.__env.baseUrl = '/';

    window.__env.idleTime = 60 * 60; // inSeconds
    window.__env.idleTimeout = 59; // inSeconds

    // Whether or not to enable debug mode
    // Setting this to false will disable console output
    window.__env.enableDebug = true;
}(this));
