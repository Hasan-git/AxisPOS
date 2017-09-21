
    angular
        .module('app.settings')
        .controller('Settings', Settings);

    Settings.$inject = ["$scope", "dashboardResource", "vendorResource", "toaster", "resolvedContactInfo", "resolvedVendorStatus", "$interval", "currencyService", "resolvedVendorCurrencies"];
    function Settings($scope, dashboardResource, vendorResource, toaster, resolvedContactInfo, resolvedVendorStatus, $interval, currencyService, resolvedVendorCurrencies) {

        $scope.currencies = currencyService.getCurrencies();

        var vendorCurrencies = resolvedVendorCurrencies.result;

        $scope.financial = {
            id: vendorCurrencies.id,
            primaryCurrency: currencyService.getCodeByName(vendorCurrencies.primaryCurrency),
            secondaryCurrency: currencyService.getCodeByName(vendorCurrencies.secondaryCurrency)
        }

        $scope.showFinancialFormfn = function (form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.originalVendorCurrencies = angular.copy($scope.financial)
            $scope.showFinancialForm = true;
        }

        $scope.cancelFinancialForm = function (form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.financial = angular.copy($scope.originalVendorCurrencies)
            $scope.showFinancialForm = false;
        }

        $scope.saveFinancialChanges = function (form) {
            var _vendorCurrencies = {};
            _vendorCurrencies.vendorId = $scope.financial.id;
            _vendorCurrencies.secondaryCurrency = $scope.financial.secondaryCurrency
            _vendorCurrencies.primaryCurrency = $scope.financial.primaryCurrency

            vendorResource.vendor.updateCurrencies(_vendorCurrencies).$promise.then(function (data) {

                //$scope.financial.primaryCurrency = currencyService.getNameByCode(_vendorCurrencies.primaryCurrency)
                //$scope.financial.secondaryCurrency = currencyService.getNameByCode(_vendorCurrencies.secondaryCurrency)
                $scope.showFinancialForm = false;
                form.$setPristine();
                form.$setUntouched();
                toaster.pop('success', "Notification", "Currency Updated successfully", 4000);

            }, function (error) {
                showError(error)
                $scope.financial = angular.copy($scope.originalVendorCurrencies)
            });
        }

        var showError = function (response) {

            if (response.data.modelState) {
                var message = "";
                for (var key in response.data.modelState) {
                    message += response.data.modelState[key] + "</br>";
                }
                toaster.pop('error', "Notification", message, 12000);
            }
            else if (response.data.result && response.data.result.modelState) {
                var message = "";
                for (var key in response.data.result.modelState) {
                    message += response.data.result.modelState[key] + "</br>";
                }
                toaster.pop('error', "Notification", message, 12000);
            } else {
                toaster.pop('error', "Notification", "An error Occured", 12000);
            }
        };

        
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
            //callbackTimer();
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
            vendorResource.vendorStatus.updateStatus($scope.vendorUpdateStatusObj).$promise.then(function (res) {
                //Refresh data
                vendorResource.vendorStatus.get().$promise.then(function (data) {
                    var getdata = JSON.parse(angular.toJson(data.result));
                    console.log(JSON.parse(angular.toJson(data.result)))
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

        //-------------------------
        //     Contact Info
        //-------------------------

        var info = angular.copy(resolvedContactInfo.result);
        info.addresses = []
        info.contactNumbers = []

        resolvedContactInfo.result.addresses.map(function (elem) {
            info.addresses.push({ address: elem })
        });

        resolvedContactInfo.result.contactNumbers.map(function (elem) {
            info.contactNumbers.push({ number: elem })
        });

        $scope.contactInfo = info

        $scope.addNewAddress = function () {
            $scope.contactInfo.addresses.push({ address: "" });
        };

        $scope.removeAddress = function (itemIdx) {
            $scope.contactInfo.addresses.splice(itemIdx, 1);
        };

        $scope.addContactNumber = function () {
            $scope.contactInfo.contactNumbers.push({number:""});
        };

        $scope.removeContactNumber = function (itemIdx) {
            $scope.contactInfo.contactNumbers.splice(itemIdx, 1);
        };
    
        $scope.showEditForm = function () {
            $scope.original = angular.copy($scope.contactInfo);
            console.log($scope.original)
        }

        $scope.saveContactChanges = function () {
            var contactInfo_ = angular.copy($scope.contactInfo);

            var contact = $scope.contactInfo.contactNumbers.map(function (elem) {
                return elem.number;
            }).join("^");
            var addresses = $scope.contactInfo.addresses.map(function (elem) {
                return elem.address;
            }).join("^");

            contactInfo_.vendorId = $scope.contactInfo.id
            contactInfo_.addresses = addresses
            contactInfo_.contactNumbers = contact

            vendorResource.vendor.updateContact(contactInfo_).$promise.then(function (data) {
                JSON.parse(angular.toJson(data));
                toaster.pop('success', "Notification", "Vendor Updated successfully", 4000);
            }, function (err) {
            
                toaster.pop('error', "Notification", "An error occured", 4000);

                $scope.contactInfo = angular.copy($scope.original);
                $scope.original = null;
                return "error";
            });

        }

    };
