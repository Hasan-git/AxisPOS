(function () {
    "use strict";

    angular
       .module("blocks.services")
       .factory("vendorResource", ["$resource", "__env", vendorResource]);

    function vendorResource($resource, __env) {

        return {
            vendor: $resource(__env.BackendUrl + "/vendor/", null,
            {
                'get': { method: 'GET' },
                'getContact': {
                    method: 'GET',
                    header: "Content-type:application/json",
                    url: __env.BackendUrl + "/vendor/contact"
                },
                'updateContact': {
                    method: 'POST',
                    url: __env.BackendUrl + "/vendor/updateContact",
                },
                'getVendorCurrencies': {
                    method: 'get',
                    url: __env.BackendUrl + "/vendor/getCurrencies",
                },
                'updateCurrencies': {
                    method: 'POST',
                    url: __env.BackendUrl + "/vendor/updateCurrencies",
                },
            }),
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
        }
    };

}());

