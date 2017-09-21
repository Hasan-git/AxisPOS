(function () {
    "use strict";

    function ordersResource($resource, __env) {

        return {
            _orders: $resource(__env.BackendUrl + "/orders/", null,
            {
                'get': { method: 'GET' },
                'update': {
                    method: 'POST'
                },
                'accept': {
                    method: 'POST',
                    url: __env.BackendUrl + "/orders/accept?orderId=:orderId&eta=:eta",
                    params: {
                        orderId: '@orderId',
                        eta: '@eta'
                    },
                    transformResponse: function (data) { return { result: angular.fromJson(data) } }
                },
                'updateEta': {
                    method: 'POST',
                    url: __env.BackendUrl + "/orders/updateEta?orderId=:orderId&eta=:eta",
                    params: {
                        orderId: '@orderId',
                        eta: '@eta'
                    },
                    transformResponse: function (data) { return { result: angular.fromJson(data) } }
                },
                'inProgress': {
                    method: 'POST',
                    url: __env.BackendUrl + "/orders/inProgress?orderId=:orderId",
                    params: {
                        orderId: '@orderId'
                    },
                    transformResponse: function (data) { return { result: angular.fromJson(data) } }
                },
                'ship': {
                    method: 'POST',
                    url: __env.BackendUrl + "/orders/ship?orderId=:orderId",
                    params: {
                        orderId: '@orderId'
                    },
                    transformResponse: function (data) { return { result: angular.fromJson(data) } }
                },
                'complete': {
                    method: 'POST',
                    url: __env.BackendUrl + "/orders/complete?orderId=:orderId",
                    params: {
                        orderId: '@orderId'
                    },
                    transformResponse: function (data) { return { result: angular.fromJson(data) } }
                },
                'reject': {
                    method: 'POST',
                    url: __env.BackendUrl + "/orders/reject",
                    transformResponse: function (data) { return { result: angular.fromJson(data) } }
                },

            })
        }
    };

    angular
        .module("blocks.services")
        .factory("ordersResource", ["$resource", "__env", ordersResource]);
}());

