(function () {
    "use strict";

    angular
       .module("blocks.services")
       .factory("dashboardResource", ["$resource", "__env", dashboardResource]);

    function dashboardResource($resource, __env) {

        return {
            vendorStatus: $resource(__env.BackendUrl + "/vendor/", null,
            {
                'get': {
                    method: 'GET',
                    url: __env.BackendUrl + "/vendor/status"
                },
                'updateStatus': {
                    method: 'POST',
                    url: __env.BackendUrl + "/vendor/updatestatus",
                    transformResponse: function (data) { return { result: angular.fromJson(data) } }
                }
            }),
            vendorOrdersReport: $resource(__env.BackendUrl + "/orders/", null,
            {
                'getStatus': {
                    method: 'GET',
                    url: __env.BackendUrl + "/orders/status"
                },
            })
        }
    };

}());

