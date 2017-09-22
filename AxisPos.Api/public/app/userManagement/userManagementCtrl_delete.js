    angular
        .module('app.userManagement')
        .controller('UserManagement', UserManagement);

    UserManagement.$inject = ["$scope", "resolvedUsers", "usersResource", "DTOptionsBuilder", "DTColumnBuilder", "$q", "$compile", "toaster", "$rootScope"];
    function UserManagement($scope, resolvedUsers, usersResource, DTOptionsBuilder, DTColumnBuilder, $q, $compile, toaster, $rootScope) {

        //   Table                 
        function renderer(api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
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
        $scope.dtInstance = {};

        $scope.dtOption = DTOptionsBuilder.fromFnPromise(function () {
            var defer = $q.defer();
            usersResource.users.get().$promise.then(function (data) {
                defer.resolve(JSON.parse(angular.toJson(data)));
            });
            return defer.promise;
        })
          .withDOM('lTfgtp<"bottom"<"clear">>')
          .withPaginationType('simple_numbers')
          .withOption('responsive', {
              details: {
                  renderer: renderer
              }
          })
        $scope.dtColumn = [
           // DTColumnBuilder.newColumn('branchId').withTitle('branchId').notVisible(),
            DTColumnBuilder.newColumn('branchName').withTitle('Branch').renderWith(branchHtml),
            // .notVisible() does not work in this case. Use .withClass('none') instead
          DTColumnBuilder.newColumn('users').withTitle().withClass('none').renderWith(actionsHtml)
        ];

        function branchHtml(data, type, full, meta) {
            return '<span >' + data + '&nbsp;&nbsp;' + full.users.length + '&nbsp;<i class="fa fa-user"></i></span>';
        }


        function actionsHtml(data, type, full, meta) {
            $scope.dataz = data;
            var html = '';
            angular.forEach(data, function (value, key) {
                var activeHtml = '';
                var activateUserHtml = '';
                if (!value.active) {
                    activeHtml = '<span  class="inactive">inactive</span>';
                    activateUserHtml = '<button class="btn btn-primary btn-xs m-l-xs" ng-click="activateUser(' + value.id + ')"><i class="fa fa-check"></i></button>'
                } else {
                    activateUserHtml = '<button class="btn btn-danger btn-xs m-l-xs" ng-click="deactivateUser(' + value.id + ')"><i class="fa fa-power-off"></i></button>'
                }

                html +=
                       '<div class="feed-element col-xs-12 p-sides-0">' +
                       // '            <a href="" class="pull-left"><img alt="image" class="img-circle" src="img/a4.jpg"></a>  '+
                       '           <div class="media-body "> ' +
                       '                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">' +
                       '                    <div class="col-xs-12 p-sides-0" ><strong>' + value.firstName + ' ' + value.lastName + '</strong>. ' + activeHtml + '</div>' +
                       '                    <div class="col-xs-12" ><small class="text-muted">' + value.role + '</small> - <small class="text-muted"><i class="fa fa-phone"></i>&nbsp;' + value.mobile + '</small> </div>' +
                       '               </div> ' +
                       '               <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 p-t-xs">' +
                       '                   <button class="btn btn-warning btn-xs" ng-click="showEditUser(' + value.id + ')" ><i class="fa fa-pencil-square-o"></i></button>' +
                                               activateUserHtml +
                       '                </div>     ' +
                       '            </div>      ' +
                       '        </div>     '
                ;
            });
            var newUserButton = '<button class="btn btn-primary btn-xs" ng-click="showNewUser(' + full.id + ')"><i class="fa fa-plus"></i> New user</button>';
            var table = '<div  class="feed-activity-list">' + newUserButton + html + '</div>'
            return table;
        }

        //      Functions             
        $scope.reloadData = function () {
            $scope.dtInstance._renderer.rerender();
            console.log($scope.dtInstance)
        }

        $scope.$watch('dtInstance', function () {
            if ($scope.dtInstance.DataTable) {

                $scope.dtInstance.DataTable.on('responsive-display', function (e, datatable, row, showHide, update) {
                    console.log('Details for row ' + row.index() + ' ' + (showHide ? 'shown' : 'hidden'), update, datatable, e);
                });
            }


        });

        $scope.check = function () {
            $scope.dtInstance.DataTable.on('responsive-display', function (e, datatable, row, showHide, update) {
                console.log('Details for row ' + row.index() + ' ' + (showHide ? 'shown' : 'hidden'));
            });
        }
        $scope.activateUser = function (userId) {

            var userStatus = {
                id: userId,
                active: true
            }
            usersResource.user.updateStatus(userStatus).$promise.then(function (data) {
                toaster.pop('success', "Notification", "User activated successfully", 4000);
                $scope.reloadData();
            });

        }
        $scope.deactivateUser = function (userId) {
            var userStatus = {
                id: userId,
                active: false
            }
            usersResource.user.updateStatus(userStatus).$promise.then(function (data) {
                toaster.pop('success', "Notification", "User deactivated successfully", 4000);
                $scope.reloadData();
            });
        }



        $scope.passwordField = true;
        $scope.showEditUser = function (userId) {
            $scope.user = {};
            $scope.showForm = false;
            usersResource.user.get({ id: userId }).$promise.then(function (data) {
                var user = JSON.parse(angular.toJson(data))
                $scope.user = user;
                $scope.showEditForm = true;
            })
        }
        $scope.showNewUser = function (branchId) {
            $scope.user = {};
            $scope.cPassword = '';
            $scope.user.branchId = branchId;
            $scope.showEditForm = false;
            $scope.showForm = true;
        }

        $scope.deleteUser = function (userId) {
            // For Publish
            // usersResource.user.delete({id:userId}).$promise.then(function(data){
            //         $scope.reloadData(); 
            //         toaster.pop('success', "Notification", "User Deleted successfully", 4000);
            //     });
        }

        $scope.saveUserForm = function (form) {
            //Edit user- update
            if ($scope.user.id) {
                usersResource.user.update($scope.user).$promise.then(function (data) {
                    $scope.reloadData();
                    $scope.showForm = false;
                    $scope.showEditForm = false;
                    form.$setPristine();
                    $scope.user = {};
                    toaster.pop('success', "Notification", "User updated successfully", 4000);
                });
            } else {
                $scope.user.active = true;
                //New User- POST
                usersResource.user.post($scope.user).$promise.then(function (data) {
                    $scope.reloadData();
                    $scope.showEditForm = false;
                    $scope.showForm = false;
                    form.$setPristine();
                    $scope.user = {};
                    toaster.pop('success', "Notification", "User created successfully", 4000);
                });
            }
        }

        $scope.canceluserForm = function (form) {
            $scope.showForm = false;
            $scope.showEditForm = false;
            $scope.user = {};
            form.$setPristine();
        }


    };

