//(function () {
//    "use strict";

//    function subscriptionResource($resource, __env) {

//        return {
//            subscriptions: $resource(__env.BackendUrl + "/vendor/", null,
//            {
//                getAll: {
//                    method: 'GET',
//                    isArray: false,
//                    url: __env.BackendUrl + "/vendor/subscriptions"
//                },
//                getSubscription: {
//                    method: 'GET',
//                    url: __env.BackendUrl + "/vendor/subscription"
//                },
//                renewSubscription: {
//                    method: 'POST',
//                    url: __env.BackendUrl + "/vendor/renewSubscription"
//                }
//            })
//        }
//    };

//    angular
//        .module("blocks.services")
//        .factory("subscriptionResource", ["$resource", "__env", subscriptionResource]);
//}());

(function () {
    "use strict";

    function subscriptionsResource($resource, __env) {

        return {
            current: $resource("../../../Api/appdata/subscription/currentSubscription.json", null,
            {
                'get': { method: 'GET', isArray: false }
            }),
            previous: $resource("../../../Api/appdata/subscription/previousSubscription.json", null,
            {
                'get': { method: 'GET', isArray: true }
            })
        }
    };

    angular
        .module("blocks.services")
        .factory("subscriptionsResource", ["$resource", "__env", subscriptionsResource]);
}());


