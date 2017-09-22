(function () {
    "use strict";

    function rolesResource($resource, __env) {

        return {
            roles: $resource(__env.SecurityUrl + "api/roles", null,
            {
                getRoles: {
                    method: 'GET',
                    isArray: true,
                },
                createRole: {
                    method: 'POST',
                    url: __env.SecurityUrl + "api/roles/create"
                },
                updateRole: {
                    method: 'POST',
                    url: __env.SecurityUrl + "api/roles/update"
                },

            })
        }
    };

    angular
        .module("blocks.services")
        .factory("rolesResource", ["$resource", "__env", rolesResource]);
}());

