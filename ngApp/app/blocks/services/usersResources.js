(function () {
    "use strict";

    function userResource($resource, __env) {

        return {
            users: $resource(__env.SecurityUrl + "api/users/", null,
            {
                getUsers: {
                    method: 'GET',
                    isArray: true,
                    url: __env.SecurityUrl + "api/users/GetUsersByVendor/:vendorId?roleName=:roleName&page=:page&size=:size",
                    params: {
                        vendorId: '@vendorId',
                        roleName: '@roleName',
                        page: '@page',
                        size: '@size',
                    }
                },
                getUser: {
                    method: 'GET',
                    url: __env.SecurityUrl + "api/users/user/:id",
                    params: {
                        id: '@id'
                    }
                },
                createUser: {
                    method: 'POST',
                    url: __env.SecurityUrl + "api/users/create"
                },
                updateUser: {
                    method: 'POST',
                    url: __env.SecurityUrl + "api/users/update"
                },
                addUserRoles: {
                    method: 'PUT',
                    url: __env.SecurityUrl + "api/users/user/:id/roles",
                    params: {
                        id: '@id'
                    }
                },
                sendEmail: {
                    method: "POST",
                    url: __env.SecurityUrl + "api/users/sendEmail"
                },
                changePassword: {
                    method: "POST",
                    url: __env.SecurityUrl + "api/users/changePassword"
                },
                deleteUser: {
                    method: "DELETE",
                    url: __env.SecurityUrl + "api/users/user/:id",
                    params: {
                        id: '@id'
                    }
                }
            })
        }
    };

    angular
        .module("blocks.services")
        .factory("userResource", ["$resource", "__env", userResource]);
}());

