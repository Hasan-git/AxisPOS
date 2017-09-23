    angular
        .module('app.dashboard')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$rootScope', '$scope', '$interval', 'resolvedVendorStatus', 'dashboardResource', 'toaster', 'resolvedVendorOrdersReport'];
    function Dashboard($rootScope, $scope, $interval, resolvedVendorStatus, dashboardResource, toaster, resolvedVendorOrdersReport) {

        var yesterdayObj = {
            'new': 0,
            'inprogress': 0,
            'shipped': 0,
            'completed': 0,
            'rejected': 0,
        };
        var todayObj = {
            'new': 0,
            'inprogress': 0,
            'shipped': 0,
            'completed': 0,
            'rejected': 0,
        };

        // map over and categorize each status
        resolvedVendorOrdersReport.map(function (status) {

            //Get time offset 
            var offset = moment().utcOffset();
            if (moment(moment().startOf('day').utcOffset(offset * -1)).isAfter(moment(status.lastUpdated).toDate())) {
                yesterdayObj[status.status.toLowerCase().split(" ").join("")] += 1
            } else {
                todayObj[status.status.toLowerCase().split(" ").join("")] += 1
            }
        });

        var newOrderAddedListener = $rootScope.$on('NewOrderAdded', function (event, args) {
            // Order sent directly from the client, over Signalr right into the dashboard
            var order = args.order;
            todayObj["new"] += 1;
        });

        $scope.$on('$destroy', function () {
            newOrderAddedListener();
        });

        $scope.openingStatus = "Opened";

        $scope.today = todayObj;
        $scope.yesterday = yesterdayObj;
        //Itialize Date
        $scope.Ifrom = moment('1900-12-12 ' + resolvedVendorStatus.serviceTimeFrom);
        $scope.Ito = moment('1900-12-12 ' + resolvedVendorStatus.serviceTimeTo);
        // Display  
        $scope.from = moment($scope.Ifrom).format('h:mm A');
        $scope.to = moment($scope.Ito).format('h:mm A');
        // Edit inputs
        //datepicker Fixes
        $scope.opening = {
            from: new Date($scope.Ifrom),
            to: new Date($scope.Ito)
        };

        //Checking time against the opening status / if current time vendor Opened / Closed  
        var callbackTimer = function () {

            var currentTime = moment(moment(new Date()).format('HH:mm:ss'), 'HH:mm:ss');
            //Opening Status
            var openTime = moment(moment(new Date($scope.Ifrom)).format('HH:mm:ss'), 'HH:mm:ss');
            var closeTime = moment(moment(new Date($scope.Ito)).format('HH:mm:ss'), 'HH:mm:ss');

            if (currentTime.isBefore(closeTime) && currentTime.isAfter(openTime)) {
                $scope.openingStatus = "Opened";
            } else {
                $scope.openingStatus = "Closed";
            }
            $scope.openingStatus = resolvedVendorStatus.serviceIsOpen;
        };

        //Intialize
        callbackTimer();

        //Update Opening Status every 10 Min
        $interval(function () {
            callbackTimer();
        }, 600000);


        // Hide/show  Opening Time Editor
        $scope.timeEditor = false;

        // close box and reset form
        $scope.closeBox = function (form) {
            $scope.timeEditor = false;
            form.$setPristine();
        };

        // save opening time changes
        $scope.saveTimeChanges = function (form) {

            //moment.tz.guess() -> to get local timezone name
            //Declare
            $scope.vendorUpdateStatusObj = {
                vendorId: resolvedVendorStatus.id,
                serviceTimeFrom: moment($scope.opening.from).format("HH:mm:ss"),
                serviceTimeTo: moment($scope.opening.to).format("HH:mm:ss"),
                serviceTimeZone: moment.tz.guess()
            };
            //Update opening time
            dashboardResource.vendorStatus.updateStatus($scope.vendorUpdateStatusObj).$promise.then(function (res) {
                //Refresh data
                dashboardResource.vendorStatus.get().$promise.then(function (data) {
                    var getdata = JSON.parse(angular.toJson(data.result));
                    //Fixes
                    $scope.Ifrom = moment('1900-12-12 ' + getdata.serviceTimeFrom);
                    $scope.Ito = moment('1900-12-12 ' + getdata.serviceTimeTo);
                    // Display  
                    $scope.from = moment($scope.Ifrom).format('h:mm A');
                    $scope.to = moment($scope.Ito).format('h:mm A');
                    //callbackTimer(); // can be deleted - used to refresh vendor status IsOpen
                    $scope.openingStatus = getdata.serviceIsOpen;
                    toaster.pop('success', "Notification", "Time Updated successfully", 4000);
                    $scope.closeBox(form);
                });
            });
        };

        // checking from - to range is correct
        $scope.$watch('[opening.from, opening.to]', function () {

            var frm = moment($scope.opening.from, 'HH:mm');
            var t = moment($scope.opening.to, 'HH:mm');
            if (t.isBefore(frm) || frm.isAfter(t)) {
                $scope.opening.from = $scope.opening.to = null;
            }
        });

        // $scope.c = 0;
        // Setting number Counter
        $scope.ctrl = {
            myValue: 0,
            //myTarget:300,
            myDuration: 7000,
            myEffect: "easeInOutExpo"
        };

    };
