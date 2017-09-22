(function () {
    "use strict";

    function branchesResource($resource, __env) {

        return {
            vendorBranches: $resource(__env.BackendUrl + "/vendor", null,
            {
                'getBranch': {
                    method: 'GET',
                    url: __env.BackendUrl + "/vendor/getBranch"

                },
                'getAllBranches': {
                    method: 'GET',
                    url: __env.BackendUrl + "/vendor/getBranches",
                    isArray:true,
                    transformResponse: function (data) { return  angular.fromJson(data)['result'] },
                },
                'updateBranch': {
                    method: 'POST',
                    url: __env.BackendUrl + "/vendor/updateBranch",
                    transformResponse: function (data) { return { result: angular.fromJson(data) } },
                },
                'createBranch': {
                    method: 'POST',
                    url: __env.BackendUrl + "/vendor/createBranch",
                    transformResponse: function (data) { return { result: angular.fromJson(data) } },
                },
                'deleteBranch': {
                    method: 'POST',
                    url: __env.BackendUrl + "/vendor/deleteBranch/:id",
                    params: {
                        id: '@id'
                    },
                    transformResponse: function (data) { return { result: angular.fromJson(data) } },
                }
            })
        }
    };

    angular
        .module("blocks.services")
        .factory("branchesResource", ["$resource", "__env",  branchesResource]);
}());

