(function () {
    "use strict";

    function sectionResource($resource, __env) {

        return {
            menu: $resource(__env.BackendUrl + "/menu/", null,
            {
                //Get All   
                'get': {
                    method: 'GET',
                    isArray: false,
                    cache:false,
                },
                'reorderSection': {
                    method: 'POST',
                    url: __env.BackendUrl + "/menu/reorderSection",
                    transformResponse: function (data) { return { result: angular.fromJson(data) } },
                    params: {
                        id: '@id',
                        order: '@order'
                    }
                },
                'reorderItem': {
                    method: 'POST',
                    url: __env.BackendUrl + "/menu/reorderItem",
                    transformResponse: function (data) { return { result: angular.fromJson(data) } },
                    params: {
                        id: '@id',
                        order: '@order'
                    }
                },
                'createSection': {
                    method: 'POST',
                    url: __env.BackendUrl + "/menu/createSection",
                    transformResponse: function (data) { return { result: angular.fromJson(data) } }
                },
                'updateSection': {
                    method: 'POST',
                    url: __env.BackendUrl + "/menu/updateSection"
                },
                'deleteSection': {
                    method: 'POST',
                    url: __env.BackendUrl + "/menu/deleteSection/:id",
                    params: {
                        id: '@id'
                    }
                },
                'createItem': {
                    method: 'POST',
                    url: __env.BackendUrl + "/menu/createItem"
                },
                'updateItem': {
                    method: 'POST',
                    url: __env.BackendUrl + "/menu/updateItem"                  
                },
                'getItem': {
                    method: 'GET',
                    isArray: false,
                    url: __env.BackendUrl + "/menu/getItem",
                    params: {
                        id: '@id'
                    }
                },
                'activateItem': {
                    method: 'POST',
                    url: __env.BackendUrl + "/menu/activateItem/:id",
                    params: {
                        id: '@id'
                    }
                },
                'deactivateItem': {
                    method: 'POST',
                    url: __env.BackendUrl + "/menu/deactivateItem/:id",
                    params: {
                        id: '@id'
                    }
                },
                'deactivateItemSpeciality': {
                    method: 'POST',
                    url: __env.BackendUrl + "/menu/deactivateItemSpeciality/:id",
                    params: {
                        id: '@id'
                    }
                },
                'activateItemSpeciality': {
                    method: 'POST',
                    url: __env.BackendUrl + "/menu/activateItemSpeciality/:id",
                    params: {
                        id: '@id'
                    }
                },
            })
        }
    };

    angular
        .module("blocks.services")
        .factory("sectionResource", ["$resource", "__env", sectionResource]);
}());

