
    angular
        .module('app.branches')
        .controller('Branches', Branches);

    Branches.$inject = ["$scope", "DTOptionsBuilder", "DTColumnBuilder", "$q", "$compile", "toaster", "branchesResource"];
    function Branches($scope, DTOptionsBuilder, DTColumnBuilder, $q, $compile, toaster, branchesResource) {

    $scope.dtInstance = {};

    $scope.dtOptionBranch = DTOptionsBuilder.fromFnPromise(function () {
        var defer = $q.defer();
        branchesResource.vendorBranches.getAllBranches().$promise.then(function (data) {
            defer.resolve(JSON.parse(angular.toJson(data)));
            // console.log(JSON.parse(angular.toJson(data)))
        });
        return defer.promise;
    }).withOption('createdRow', function (row) {
        $compile(angular.element(row).contents())($scope);
    })
      .withPaginationType('simple_numbers')

    $scope.dtColumn = [
      DTColumnBuilder.newColumn('name').withTitle('Branch'),
      //DTColumnBuilder.newColumn('phoneNumber').withTitle('Phone'),
      DTColumnBuilder.newColumn('location').withTitle('Location'),
      DTColumnBuilder.newColumn(null).withTitle().renderWith(actionsHtml).notSortable()
    ];

    //------------ + Functions +------------------            
    $scope.reloadData = function () {
        //Bug-> not working
        //$scope.dtInstance._renderer.rerender();
        $scope.dtInstance.rerender();

    }

    $scope.showEditBranch = function (branchId) {
        $scope.branch = {};
        branchesResource.vendorBranches.getBranch({ id: branchId }).$promise.then(function (data) {
            var branch = JSON.parse(angular.toJson(data))
            $scope.branch = branch;
            $scope.showForm = true;
        })
    }
    $scope.showNewBranch = function (form) {
        form.$setPristine();
        $scope.branch = {};
        $scope.showForm = true;
    }

    $scope.deleteBranch = function (branchId) {
        branchesResource.vendorBranches.deleteBranch({ id: branchId }).$promise.then(function (data) {
            $scope.reloadData();
            toaster.pop('success', "Notification", "Branch deleted successfully", 4000);
        });
    }
    $scope.saveBranchForm = function (form) {
        //Edit user- update
        if ($scope.branch.id) {
            branchesResource.vendorBranches.updateBranch($scope.branch).$promise.then(function (data) {
                $scope.reloadData();
                $scope.showForm = false;
                form.$setPristine();
                toaster.pop('success', "Notification", "Branch updated successfully", 4000);
            });
        } else {
            //New User- POST
            branchesResource.vendorBranches.createBranch($scope.branch).$promise.then(function (data) {
                $scope.reloadData();
                $scope.showForm = false;
                form.$setPristine();
                toaster.pop('success', "Notification", "Branch created successfully", 4000);
            });
        }
    }

    $scope.cancelbranchForm = function (form) {
        $scope.showForm = false;
        $scope.branch = {};
        form.$setPristine();
    }

    function actionsHtml(data, type, full, meta) {
        return '               <div class="">' +
                '                   <button class="btn btn-warning btn-xs" ng-click="showEditBranch(\'' + data.id + '\')" ><i class="fa fa-pencil-square-o"></i></button>' +
                '                   <button class="btn btn-danger btn-xs" ng-click="deleteBranch(\'' + data.id + '\')"><i class="fa fa-trash"></i></button>' +
                '                </div>'
        ;
    }

};

