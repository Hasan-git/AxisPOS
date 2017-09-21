    angular
        .module('app.subscriptions')
        .controller('Subscription', Subscription);

    Subscription.$inject = ["$scope", "DTOptionsBuilder", "DTColumnBuilder", "resolvedCurrentSubcription", "resolvedPreviousSubcription", "toaster", "$compile", "$q"];
    function Subscription($scope, DTOptionsBuilder, DTColumnBuilder, resolvedCurrentSubcription, resolvedPreviousSubcription, toaster, $compile, $q) {

        $scope.currentSub = resolvedCurrentSubcription;
        $scope.previousSub = resolvedPreviousSubcription;

        $scope.purchaseBox = false;

        $scope.purchase = function () {
            toaster.pop('success', "Notification", "Purchased successfully", 4000);
            $scope.purchaseBox = false;
        }

        $scope.dtInstance = {};

        $scope.dtOption = DTOptionsBuilder.fromFnPromise(function () {
            var defer = $q.defer();
            if (resolvedPreviousSubcription) {
                defer.resolve(JSON.parse(angular.toJson(resolvedPreviousSubcription)));
            }
            return defer.promise;
        }).withOption('createdRow', function (row) {
            $compile(angular.element(row).contents())($scope);
        })
          .withPaginationType('simple_numbers')

        $scope.dtColumn = [
          DTColumnBuilder.newColumn('purchasedAt').withTitle('Purchase Date'),
          DTColumnBuilder.newColumn('expiryDate').withTitle('Expiry Date'),
          DTColumnBuilder.newColumn('amount').withTitle('Amount').renderWith(amountHtml),
          DTColumnBuilder.newColumn('status').withTitle('Status').renderWith(statusHtml)
        ];

        function statusHtml(data, type, full, meta) {
            return '<span class="label label-' + data + ' " ng-class="">' + data + '</span>';
        }
        function amountHtml(data, type, full, meta) {
            return '{{' + data + ' | currency }}';
        }
    };

