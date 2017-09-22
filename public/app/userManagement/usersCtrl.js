//TODO : delete user
//TODO : Lock unlock user

angular
    .module('app.userManagement')
    .controller('userCtrl', userCtrl)
;

userCtrl.$inject = ["$scope", "DTOptionsBuilder", "DTColumnBuilder", "$q", "$compile", "toaster", "userResource", "$state", "vendorResource", "rolesResource", "$rootScope", "$uibModal"];
function userCtrl($scope, DTOptionsBuilder, DTColumnBuilder, $q, $compile, toaster, userResource, $state, vendorResource, rolesResource, $rootScope, $uibModal) {

    $scope.dtInstance = {};
    $scope.usersObj = null; // Default users object
    var _vendorId = $rootScope.currentUser.vendorId

    /////////////////////////////////

    $scope.rolesList = [
        {
            name: "Vendor manager"
        },
        {
            name: "Branch manager"
        },
        {
            name: "Operators"
        },
        {
            name: "Menu editor"
        }];


    $scope.getData = function () {
        var defer = $q.defer();
        if ($scope.usersObj === null) {
            userResource.users.getUsers({ vendorId: _vendorId, roleName: "", page: "1", size: "1000" }).$promise.then(function (data) {
                defer.resolve(JSON.parse(angular.toJson(data)));
                $scope.usersObj = JSON.parse(angular.toJson(data))
                console.log("Server >", $scope.usersObj)
            });
        } else {
            console.log("Local > ", $scope.usersObj)
            setTimeout(function () {
                defer.resolve(JSON.parse(angular.toJson($scope.usersObj)));
            }, 200);
        }
        return defer.promise;
    }


    $scope.getUserByIdLocally = function (userId) {
        var result;
        var defer = $q.defer();
        $scope.usersObj.map(function (user, key) {
            if (user.id === userId) {
                result = { user: user, key: key }
            }
        })
        $q.when(result).then(function (response) { defer.resolve(response); });
        return defer.promise;
    }

    $scope.updateUserLocally = function (updatedUser) {
        var result;
        var defer = $q.defer();
        $scope.usersObj.map(function (user, key) {
            if (user.id === updatedUser.id) {
                $scope.usersObj[key] = updatedUser;
                result = true
            }
        })
        $q.when(result).then(function (response) { defer.resolve(response); });
        return defer.promise;
    }

    //----------------------------------------
    //              Table
    //----------------------------------------

    function renderer(api, rowIdx, columns) {
        var data = $.map(columns, function (col, i) {
            console.log(col, i)
            return col.hidden ?
                '<li data-dtr-index="' + col.columnIndex + '" data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                     '<span class="dtr-title">' +
                         col.title +
                   '</span> ' +
                   '<span class="dtr-data">' +
                       col.data +
                  '</span>' +
              '</li>' :
              '';
        }).join('');
        return data ?
            $compile(angular.element($('<ul data-dtr-index="' + rowIdx + '"/>').append(data)))($scope) :
             false;
    }

    $scope.reloadData = function () {
        $scope.dtInstance.rerender();
    }

    $scope.dtOption = DTOptionsBuilder.fromFnPromise(function () {
        var defer = $q.defer();
        $scope.getData().then(function (data) {
            defer.resolve(JSON.parse(angular.toJson(data)));
            //console.log(data)
        })
        return defer.promise
    })
    .withOption('createdRow', function (row) {
        $compile(angular.element(row).contents())($scope);
    })
    .withPaginationType('simple_numbers')
    .withOption('responsive', {
        details: {
            renderer: renderer,
        }
    })


    $scope.dtColumn = [
      DTColumnBuilder.newColumn('userName').withTitle('userName'),
      DTColumnBuilder.newColumn('joinDate').withTitle('Joined Date').renderWith(joinDateHtml),
      DTColumnBuilder.newColumn('emailConfirmed').withTitle('Email Confirmed').renderWith(emailHtml),
      DTColumnBuilder.newColumn('isLocked').withTitle('Locked').renderWith(lockedHtml),
      DTColumnBuilder.newColumn(null).withTitle().renderWith(actionsHtml).notSortable(),
    ];

    function joinDateHtml(data, type, full, meta) {
        return !!data ? moment(data).format("MMM, d YYYY") : "";
    };

    function emailHtml(data, type, full, meta) {
        return !!data ? "Confirmed" : "Not Yet" ;
    };

    function lockedHtml(data, type, full, meta) {
        return !!data ? "<i class='fa fa-lock fa-lg text-danger'></i>" : "<i class='fa fa-unlock fa-lg text-success '></i>";
    };

    function actionsHtml(data, type, full, meta) {
      
        return '               <div class="text-center">' +
                //'                   <button class="btn btn-success btn-xs"  ng-click="resetPassword(\'' + data.id + '\')"><i class="fa fa-key fa-fw"></i></button>' +
                '                   <button class="btn btn-warning btn-xs" ng-click="showEditUser(\'' + data.id + '\',userEditForm)" ><i class="fa fa-pencil-square-o fa-fw"></i></button>' +
                '                   <button class="btn btn-danger btn-xs"  ng-click="deleteUser(\'' + data.id + '\')"><i class="fa fa-trash fa-fw"></i></button>' +
                '               </div>'
        ;
    }

    $scope.showNewUser = function (form) {
        form.$setPristine();
        form.$setUntouched();
        $scope.user = {};
        $scope.showForm = true;
    }

    $scope.showEditUser = function (userId,form) {
        form.$setPristine();
        form.$setUntouched();
        $scope.user = {};

        userResource.users.getUser({ id: userId }).$promise.then(function (data) {
            $scope.user = data;
            $scope.showEditForm = true;
        });
    }


    $scope.canceluserForm = function (form) {
        form.$setPristine();
        form.$setUntouched();
        $scope.user = {};
        $scope.showForm = false;
        $scope.showEditForm = false;
    }



    $scope.saveUserForm = function (form) {

        
        // update User
        if ($scope.user.id) {

            $scope.user.userId = $scope.user.id;
            $scope.user.vendorId = _vendorId;
            userResource.users.updateUser($scope.user).$promise.then(function (response) {

                if (form.userRolesInpt.$dirty) {
                    //Roles modified
                    userResource.users.addUserRoles({ id: response.id }, $scope.user.roles).$promise.then(function (rolesResponse) {
                        $scope.getUserByIdLocally(response.id).then(function (_localUser) {

                            // extened the difference between local and returned user + modified userRole
                            var changes = {
                                fullName: response.firstName + " " + response.lastName,
                                roles: $scope.user.roles,
                                vendorId: response.vendorId
                            };

                            angular.merge($scope.usersObj[_localUser.key], $scope.usersObj[_localUser.key], changes);
                            form.$setPristine();
                            form.$setUntouched();
                            $scope.user = {};
                            $scope.showEditForm = false;
                            toaster.pop('success', "Notification", "User updated successfully", 4000);
                        })
                    }, function (error) {
                        toaster.pop('error', "Notification", "Failed to add user roles", 4000);

                    });
                } else {
                    //Roles Not modified
                    $scope.getUserByIdLocally(response.id).then(function (_localUser) {

                        // extened the difference between local and returned user
                        var changes = {
                            fullName: response.firstName + " " + response.lastName,
                            vendorId: response.vendorId
                        };
                        angular.merge($scope.usersObj[_localUser.key], $scope.usersObj[_localUser.key], changes);
                        form.$setPristine();
                        form.$setUntouched();
                        $scope.user = {};
                        $scope.showEditForm = false;
                        toaster.pop('success', "Notification", "User updated successfully", 4000);

                    })
                }

            });
        } else {
            $scope.user.vendorId = _vendorId;
            //New user - POST
            userResource.users.createUser($scope.user).$promise.then(function (response) {
                if ($scope.userRoles) {

                    // roles added -> then add them to user
                    userResource.users.addUserRoles({ id: response.id }, $scope.userRoles).$promise.then(function (rolesResponse) {

                        // merge returned roles with local user roles
                        response.roles = $scope.userRoles;
                        toaster.pop('success', "Notification", "User created successfully", 4000);
                        $scope.usersObj.push(response);
                        $scope.reloadData();
                        $scope.user = {};
                        $scope.showForm = false;
                        form.$setPristine();
                        form.$setUntouched();
                    }, function (error) {
                        toaster.pop('error', "Notification", "Failed to add user roles", 4000);
                    })

                } else {
                    // no roles added to user
                    toaster.pop('success', "Notification", "User created successfully", 4000);
                    $scope.usersObj.push(response);
                    $scope.reloadData();
                    $scope.user = {};
                    $scope.showForm = false;
                    form.$setPristine();
                    form.$setUntouched();
                }

            }, function (error) {
               parseErrors(error.data)
            });
        }
    }



   /* 
   *
   * DELETE USER
   *
   */

    $scope.deleteUser = function (_userId) {

        $scope._userId = _userId
        var deleteModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'deleteUser.html',
            scope: $scope,
            size: 'lg',
        });

        $scope.deleteUserConfirmed = function (uId) {
            userResource.users.deleteUser({ id: uId }).$promise.then(function (data) {
                $scope.getUserByIdLocally(uId).then(function (response) {
                    var userKey = response.key;
                    $scope.usersObj.splice(userKey, 1)
                    $scope.reloadData()
                    toaster.pop('success', "Notification", "User deleted successfully", 4000);
                });
            }, function (error) {
                parseErrors(error.data)
            });
            deleteModalInstance.close();
        };

        $scope.cancel = function () {
            deleteModalInstance.dismiss('cancel');
        };
    };


    /* 
    *
    * RESET USER PASSWORD
    *
    */
    $scope.resetPassword = function (_userId) {

        $scope._userId = _userId
        var resetPassModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'deleteUser.html',
            scope: $scope,
            size: 'lg',
        });

        $scope.resetPasswordConfirmed = function (uId) {
            userResource.users.changePassword({ id: uId }).$promise.then(function (data) {
                $scope.getUserByIdLocally(uId).then(function (response) {
                    var userKey = response.key;
                    $scope.usersObj.splice(userKey, 1)
                    $scope.reloadData()
                    toaster.pop('success', "Notification", "Reset password performed successfully", 4000);
                });
            }, function (error) {
                parseErrors(error.data)
            });
            resetPassModalInstance.close();
        };

        $scope.cancel = function () {
            resetPassModalInstance.dismiss('cancel');
        };
    };

    var parseErrors = function (response) {
        console.log(response)
        if (response.modelState) {
            var message = "";
            for (var key in response.modelState) {
                message += response.modelState[key] + "</br>";
            }
            toaster.pop('error', "Notification", message, 4000);
        }
    };




};

