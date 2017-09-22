
    angular
        .module('app.orders')
        .controller('Orders', Orders)
;

    Orders.$inject = ["$scope", "DTOptionsBuilder", "DTColumnBuilder", "_resolvedOrders", "ordersResource", "toaster", "$q", "$compile", "$rootScope", "$uibModal", "dates", "$timeout", "$stateParams"];
    function Orders($scope, DTOptionsBuilder, DTColumnBuilder, _resolvedOrders, ordersResource, toaster, $q, $compile, $rootScope, $uibModal, dates, $timeout, $stateParams) {

        console.log(_resolvedOrders)

        if ($stateParams.navigateTo) {
            var naviagte = $stateParams.navigateTo.toString();

            if (naviagte === "inProgress")
                $scope.activeTab = 1;
            else if(naviagte === "shipped")
                $scope.activeTab = 2;
            else if (naviagte === "completed")
                $scope.activeTab = 3;
            else if (naviagte === "rejected")
                $scope.activeTab = 4;
        }

        var dateToLocal = function (submittedDate) {
            var stillUtc = moment.utc(submittedDate).toDate();
            var local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');

            return local
        }

        // convert dates from utc to local
        _resolvedOrders.result.map(function (order) {
            //var stillUtc = moment.utc(order.submittedDate).toDate();
            //var local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
            order.submittedDate = new Date(dates.utcToLocal(order.submittedDate))
            order.eta = moment(order.eta).isValid() ? new Date(dates.utcToLocal(order.eta)) : order.eta;
        });

        Array.prototype.getIndexOfObject = function (prop, value) {
            for (var i = 0; i < this.length; i++) {
                if (this[i][prop] === value) {
                    return i;
                }
            }
        }
        //var getOrderById = function (itemId,object) {
        //    var result ;
        //    object.map(function (item, iIdex) {
        //        if (item.id === itemId) {
        //                itemIdx: iIdex
        //        }
        //    })
        //    return result
        //}

        $scope.openModal = function (order, idx) {
            $scope.orderModal = {
                selectedOrder: order,
                orderindex: idx,
                map: {
                    center: {
                        latitude: order.latitude,
                        longitude: order.longitude,
                    },
                    marker: [
                        {
                        id: Math.floor((Math.random() * 100) + 1),
                        latitude: order.latitude,
                        longitude: order.longitude,
                            client: {
                                phone: order.clientPhone,
                                name: order.clientName,
                                address: order.clientAddress
                            }
                        }
                    ]
                }
            }

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'orderDetails.html',
                scope: $scope,
                size: 'lg',
            });

            $scope.ok = function () {
                modalInstance.close();
            };

            $scope.cancel = function () {
                modalInstance.dismiss('cancel');
            };
        }

        //openModal();

        $scope.dateRange = {
            fromArrived: null,
            toArrived: null,
            fromEta: null,
            toEta: null
        };
        $scope.clear = function () {
            $scope.dateRange = {
                fromArrived: null,
                toArrived: null,
                fromEta: null,
                toEta: null,
            };
        };

        var refreshData = function (Obj) {

            $scope.newOrders = Obj["new"];
            $scope.inProgressOrders = Obj["inprogress"];
            $scope.shippedOrders = Obj["shipped"];
            $scope.completedOrders = Obj["completed"];
            $scope.rejectedOrders = Obj["rejected"];
            $scope.allOrders = Obj["all"];

            //datepiker fixes
            angular.forEach($scope.inProgressOrders, function (value, key) {
                $scope.inProgressOrders[key].eta = new Date(value.eta);
            });
        };


        //Get Resolved orders from server
        $scope._orders = _resolvedOrders.result;
        //Initialize Orders Object
        $scope.ordersObj = {
            "new": [],
            "inprogress": [],
            "shipped": [],
            "completed": [],
            "rejected": [],
            "all": [],
        }

        $scope.mapOrders = function () {
            var defer = $q.defer();
            // Go through each record and categorize orders
            $scope._orders.map(function (order) {

                if (order.status) {
                    $scope.ordersObj["all"].push(order);

                    if (order.status === "New")
                        $scope.ordersObj["new"].push(order);
                    else if (order.status === "InProgress")
                        $scope.ordersObj["inprogress"].push(order);
                    else if (order.status === "Shipped")
                        $scope.ordersObj["shipped"].push(order);
                    else if (order.status === "Completed")
                        $scope.ordersObj["completed"].push(order);
                    else if (order.status === "Rejected")
                        $scope.ordersObj["rejected"].push(order);
                }
            });
            $q.all([$scope.ordersObj]).then(function(response) {
                 defer.resolve(response[0]);
            });
            return defer.promise;
        }

        // Map Orders
        $scope.mapOrders().then(function (MappedOrders) {
            // set Orders Object
            refreshData(MappedOrders);
        });

        var newOrderAddedListener = $rootScope.$on('NewOrderAdded', function (event, args) {
            // Order sent directly from the client, over Signalr right into the dashboard
            var order = args.order;
            order.submittedDate = new Date(dates.utcToLocal(order.submittedDate))
            order.eta = moment(order.eta).isValid() ? new Date(dates.utcToLocal(order.eta)) : order.eta;
            $scope.ordersObj["new"].unshift(order);
        });

        $scope.$on('$destroy', function () {
            newOrderAddedListener();
        });

        // if autoEta is true server will calculate eta order based on products eta else user should specify the eta
        $scope.autoEta = true

        $scope.etaPopover = {
            content: '',
            templateUrl: 'eta.html',
            title: 'Order ETA',
            onOpen: function (order) {
                $scope.etaPopover.clonedOrder = angular.copy(order);
                $scope.etaPopover.clonedOrder.eta = new Date($scope.etaPopover.clonedOrder.eta);
                $scope.etaPopover.clonedOrder.eta =
                moment($scope.etaPopover.clonedOrder.eta).isAfter(new Date())
                ? new Date($scope.etaPopover.clonedOrder.eta): new Date();
            },
            etaChecked: function (autoEta) {
                // autoEta variable need to be updated on each change, directive not applying the changes to the scope  
                $scope.autoEta = autoEta
            },
            updateEta: function (order, idx) {

                var now = new Date();
                var then = new Date(order.eta);

                // calculate the diff btw now and eta time (max diff is 1 month)
                var preciseDiff = moment.preciseDiff(now, then, true);
                var etaTimeSpan = $scope.autoEta === true ? '' : ([preciseDiff.days, preciseDiff.hours, preciseDiff.minutes, preciseDiff.seconds]).join(":")

                // TODO//: api serice url changed from /inprogress to /accepted - please check it 
                ordersResource._orders.updateEta({orderId: order.id, eta: etaTimeSpan}).$promise.then(function (data) {
                    var response = JSON.parse(angular.toJson(data.result))
                    if (response.status === "updated") {
                        orderIdx = $scope.inProgressOrders.getIndexOfObject('id', order.id);
                        $scope.inProgressOrders[orderIdx].eta = dates.utcToLocal(response.eta)
                        order.eta = new Date(dates.utcToLocal(response.eta))
                        //$('.popover').remove();
                        toaster.pop('success', "Notification", "Order updated successfully", 4000);
                    }
                });
            }
        };



        $scope.acceptOrderPopover = {
            content: '',
            templateUrl: 'acceptOrderPopover.html',
            title: 'Order ETA',
            onOpen: function (order) {
                $scope.acceptLoading = false;
                $scope.acceptOrderPopover.clonedOrder = angular.copy(order);
                $scope.acceptOrderPopover.clonedOrder.eta = new Date($scope.acceptOrderPopover.clonedOrder.eta);
                $scope.acceptOrderPopover.clonedOrder.eta = 
                    moment($scope.acceptOrderPopover.clonedOrder.eta).isAfter(new Date())
                    ? new Date($scope.acceptOrderPopover.clonedOrder.eta) : new Date();
            },
            etaChecked: function (autoEta) {
                // autoEta variable need to be updated on each change, directive not applying the changes to the scope  
                $scope.autoEta = autoEta
            },
            acceptOrder: function (order, idx) {
                $scope.acceptLoading = true;
                var now = new Date();
                var then = new Date(order.eta);

                // calculate the diff btw now and eta time (max diff is 1 month)
                var preciseDiff = moment.preciseDiff(now, then, true);
                var etaTimeSpan = $scope.autoEta === true ? '' :([preciseDiff.days, preciseDiff.hours, preciseDiff.minutes, preciseDiff.seconds]).join(":")

                 // TODO//: api serice url changed from /inprogress to /accepted - please check it 
                ordersResource._orders.accept({ orderId: order.id, eta: etaTimeSpan }).$promise.then(function (data) {
                    var response = JSON.parse(angular.toJson(data.result))
                    if (response.status === "InProgress" || response.status === "accepted") {
                        $scope.newOrders.splice(idx, 1)
                        order.eta = new Date(dates.utcToLocal(response.eta))
                        $scope.inProgressOrders.push(order);
                        $scope.acceptLoading = false;
                        toaster.pop('success', "Notification", "Order accepted successfully", 4000);
                      //$('.popover').remove();
                    }
                }, function (error) {
                    $scope.acceptLoading = false;
                });
            },            
        };


            

        $scope.rejectOrderPopover = {
            content: '',
            templateUrl: 'rejectOrderPopover.html',
            title: 'Reject Order',
            onOpen: function (order, callerTable) {
                $scope.rejectLoading = false;
                $scope.rejectOrderPopover.clonedOrder = angular.copy(order);
                $scope.rejectOrderPopover.clonedOrder.callerTable = callerTable;
            },
            rejectOrder: function (order, idx, callerTable) {
                $scope.rejectLoading = true;
                
                ordersResource._orders.reject({ orderId: order.id, clientId: order.clientId,reason:order.reason }).$promise.then(function (data) {
                    var response = JSON.parse(angular.toJson(data.result))
                    
                    if (response === "rejected") {
                        if (callerTable === "fromNewOrders") {
                            $scope.newOrders.splice(idx, 1)
                            $scope.rejectedOrders.push(order)
                        } else if (callerTable === "fromInProgressOrders") {
                            $scope.inProgressOrders.splice(idx, 1)
                            $scope.rejectedOrders.push(order)
                        }
                        $scope.rejectLoading = false;
                        toaster.pop('success', "Notification", "Order rejected successfully", 4000);
                    }
                }, function (error) {

                    $scope.rejectLoading = false;
                    if (error.data && error.data.error_description) {
                        toaster.pop('error', "Notification", error.data.error_description, 8000);
                    }
                });

            }
        };

        // to be deleted / temporary
        var params = {
            vendorId: $rootScope.currentUser.vendorId,
            page: 1,
            size: 1000
        }
     
        $scope.acceptOrder = function (order, idx) {
            // -> In progress
            ordersResource._orders.inProgress({ orderId: order.id }).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data.result))
                if (response === "InProgress" || response === "accepted") {
                    $scope.newOrders.splice(idx, 1)
                    $scope.inProgressOrders.push(order)
                    toaster.pop('success', "Notification", "Order accepted successfully", 4000);
                }
            }, function (err) {
                toaster.pop('error', "Notification", err, 6000);
            });

        };

        $scope.rejectOrder = function (order, idx, objName) {
            //objName -> specify rejection comming from new orders table or inprogress table
            // -> Rejected
            ordersResource._orders.reject({ orderId: order.id,clientId:order.clientId }).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data.result))
                if (response === "rejected") {
                    if (objName === "fromNewOrders") {
                        $scope.newOrders.splice(idx, 1)
                        $scope.rejectedOrders.push(order)
                    } else if (objName === "fromInProgressOrders") {
                        $scope.inProgressOrders.splice(idx, 1)
                        $scope.rejectedOrders.push(order)
                    }
                    toaster.pop('success', "Notification", "Order rejected successfully", 4000);
                }
            }, function (err) {
                toaster.pop('error', "Notification", err, 6000);
            });
        };

        $scope.shipOrder = function (order, idx) {
            // -> Shipped
            ordersResource._orders.ship({ orderId: order.id }).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data.result))
                if (response === "Shipped") {
                    $scope.inProgressOrders.splice(idx, 1)
                    $scope.shippedOrders.push(order)
                    toaster.pop('success', "Notification", "Order shipped successfully", 4000);
                }
            });
        };
        $scope.completedOrder = function (order, idx) {
            // -> Completed
            ordersResource._orders.complete({ orderId: order.id }).$promise.then(function (data) {

                var response = JSON.parse(angular.toJson(data.result))
                if (response === "Completed") {
                    $scope.shippedOrders.splice(idx, 1)
                    $scope.completedOrders.push(order)
                    toaster.pop('success', "Notification", "Order completed successfully", 4000);
                }
            });
        };


        $scope.advancedSearch = false;
        $scope.dtInstance = {};
        $scope.alldtOptions = DTOptionsBuilder.fromFnPromise(function () {
            var defer = $q.defer();
            //$scope.mapOrders().then(function (MappedOrders) {
            //    defer.resolve(MappedOrders['all']);
            //})
            var params = {
                vendorId: $rootScope.currentUser.vendorId,
                page: 1,
                size: 1000
            }
            ordersResource._orders.get(params).$promise.then(function (data) {
                var response = JSON.parse(angular.toJson(data)).result;
                // convert dates from utc to local
                response.map(function (order) {
                    order.submittedDate = new Date(dates.utcToLocal(order.submittedDate))
                    order.eta = moment(order.eta).isValid() ? new Date(dates.utcToLocal(order.eta)) : order.eta;
                });

                defer.resolve(response);
            });

            return defer.promise;
        })
            .withOption('createdRow', createdRow)
            //.withOption('paging', false) // Disable Pagination
            .withDOM('<"html5buttons"B>lTfgtp<"bottom"i<"clear">>')
            .withButtons([
                { extend: 'copy', title: 'All Orders', filename: "All Orders", exportOptions: { columns: [0, 1, 2, 3, 4] } },
                { extend: 'csv', title: 'All Orders', filename: "All Orders", exportOptions: { columns: [0, 1, 2, 3, 4] } },
                { extend: 'excel', title: 'All Orders', filename: "All Orders", exportOptions: { columns: [0, 1, 2, 3, 4] } },
                { extend: 'pdf', title: 'All Orders', filename: "All Orders", exportOptions: { columns: [0, 1, 2, 3, 4] } },
                {
                    extend: 'print',
                    customize: function (win) {
                        $(win.document.body).addClass('white-bg');
                        $(win.document.body).css('font-size', '10px');
                        $(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit');
                        $(win.document.body).find("tbody>tr").each(function () {
                            //Fixes date caused by datatables compiler
                            var arrivedHtml = $(this).find('td:first').html();
                            var arrivedVal = arrivedHtml.split("@");
                            $(this).find('td:first').html(arrivedVal[1]);
                            //Fixes date caused by datatables compiler
                            var etaHtml = $(this).find('td:nth-of-type(3)').html();
                            var etaVal = etaHtml.split("@");
                            $(this).find('td:nth-of-type(3)').html(etaVal[1]);

                        });
                    }
                },

                {
                    text: '<i class="fa fa-search" > </i>&nbsp;Advanced',
                    key: '1',
                    action: function (e, dt, node, config) {
                        $scope.advancedSearch = !$scope.advancedSearch;
                        $scope.$apply();
                    }
                }
            ]);

        //DTColumnBuilder.newColumn('arrived').withTitle('Arrived').renderWith(actionsHtml),
        $scope.dtColumns = [
          DTColumnBuilder.newColumn('submittedDate').withTitle('Arrived').renderWith(actionsHtml),
          DTColumnBuilder.newColumn('price').withTitle('Price'),
          DTColumnBuilder.newColumn('eta').withTitle('Eta').renderWith(actionsHtml),
          DTColumnBuilder.newColumn('orderDetails').withTitle('Details').renderWith(orderDetailsHtml),
          DTColumnBuilder.newColumn('status').withTitle('Status'),
          // DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml)
        ];

        function orderDetailsHtml(data, type, full, meta) {
            return '<span>'+data.length + ' Item(s)</span>' 
        }

        function actionsHtml(data, type, full, meta) {

            var named = data;
            var result = '<span><div class="hide-date" style="display:none;"> ' + named + ' @</div> <span>' + named + '</span></span> ';

            if (moment.isDate(new Date(data)) && data != '' && data != "ASAP" && moment(data).isValid()) {
                var dateFromNow = moment(moment.parseZone(data).toDate(), "YYYYMMDD").fromNow();
                var date = moment(data).format();
                result = '<span><div class="hide-date" style="display:none;">' + date + '@</div> <span smart-time smart-time-value="' + date + '" >' + dateFromNow + '</span></span> ';
            }

            return result;
        };
        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        };
        $scope.search = function () {
            setTimeout(function () {
                $scope.dtInstance.dataTable.fnDraw();
            }, 200);
        };
        // DtInstance Fixes
        $scope.dtIntanceCallback = function (instance) {
            $scope.dtInstance = instance;

            $scope.$watch('[dateRange.fromArrived, dateRange.toArrived,dateRange.fromEta,dateRange.toEta]', function () {
                setTimeout(function () {
                    $scope.dtInstance.dataTable.fnDraw();
                }, 200);
            });
        };

        //--------------------------
        //  Filter All orders table
        //--------------------------
        $.fn.dataTableExt.afnFiltering.push(
            function (oSettings, aData, iDataIndex) {

                //oSettings.nTable.className.indexOf('all-orders-tbl')
                if (oSettings.nTable.id == 'oTable1') {

                    var price = document.getElementById('priceIn').value == '' ? '' : document.getElementById('priceIn').value;
                    var details = document.getElementById('detailsIn').value == '' ? '' : document.getElementById('detailsIn').value;
                    var status = document.getElementById('statusIn').value == '' ? '' : document.getElementById('statusIn').value;
                    var etaFrom = document.getElementById('etaFrom').value == '' ? '1900-08-26T00:00:00' : document.getElementById('etaFrom').value;
                    var etaTo = document.getElementById('etaTo').value == '' ? '2900-08-26T00:00:00' : document.getElementById('etaTo').value;
                    var arrivedFrom = document.getElementById('arrivedFrom').value == '' ? '1900-08-26T00:00:00' : document.getElementById('arrivedFrom').value;
                    var arrivedTo = document.getElementById('arrivedTo').value == '' ? '2900-08-26T00:00:00' : document.getElementById('arrivedTo').value;

                    // Fixes datatable renderer / ^ actionsHtml callback return 2 dates / split '@' -> first position -> valid Date 
                    var arrivedOData_ = aData[0].split("@");
                    var etaOData_ = aData[2].split("@");

                    // ETA Fixes // -> it might be ASAP
                    var etaCheckFrom, etaCheckFromTo;
                    if (etaOData_[0].indexOf('ASAP') && !moment(new Date(etaOData_[0])).isValid()) {
                        etaCheckFrom = true
                        etaCheckFromTo = true
                    }
                    else {
                        etaCheckFrom = moment(new Date(etaOData_[0])).isSameOrAfter(moment(new Date(etaFrom)))
                        etaCheckFromTo = moment(new Date(etaOData_[0])).isSameOrBefore(moment(new Date(etaTo)))
                    }

                    if (
                         aData[1].indexOf(price) !== -1 &&
                            aData[3].toLowerCase().indexOf(details) !== -1 &&
                                aData[4].toLowerCase().indexOf(status) !== -1 &&
                                    moment(new Date(arrivedOData_[0])).isSameOrAfter(moment(new Date(arrivedFrom))) &&
                                        moment(new Date(arrivedOData_[0])).isSameOrBefore(moment(new Date(arrivedTo))) &&
                                            etaCheckFrom &&
                                                etaCheckFromTo

                    ) return true;

                } else {
                    return true;
                }
            });

        //---------------------------
        //  Filter All orders table
        //--------------------------


        var inAndNew = [1, 2, 3, 4];
        var rejectAndShipped = [0, 1, 2, 3];
        // Tables : Rejected  - Completed
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            //.withOption('paging', false) // Disable Pagination
            .withDOM('<"html5buttons"B>lTfgtp<"bottom"i<"clear">>')
            .withButtons([
                { extend: 'copy', title: 'Orders', filename: "Orders", exportOptions: { columns: [0, 1, 2, 3] } },
                { extend: 'csv', title: 'Orders', filename: "Orders", exportOptions: { columns: [0, 1, 2, 3] } },
                { extend: 'excel', title: 'Orders', filename: "Orders", exportOptions: { columns: [0, 1, 2, 3] } },
                { extend: 'pdf', title: 'Orders', filename: "Orders", exportOptions: { columns: [0, 1, 2, 3] } },
                {
                    extend: 'print',

                    customize: function (win) {
                        $(win.document.body).addClass('white-bg');
                        $(win.document.body).css('font-size', '10px');
                        $(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit');
                        $(win.document.body).find("tr").each(function () {
                            // $(this).find('td:last').css('display', 'none').css('visibility', 'hidden').remove();
                            // $(this).find('th:last').css('display', 'none').css('visibility', 'hidden').remove();
                        });
                    }
                }
            ]);


        // Tables : - shipped
        $scope.shippedDtOptions = DTOptionsBuilder.newOptions()
            //.withOption('paging', false) // Disable Pagination
            .withDOM('<"html5buttons"B>lTfgtp<"bottom"i<"clear">>')
            .withButtons([
                { extend: 'copy', title: 'Orders', filename: "Orders", exportOptions: { columns: [0, 1, 2, 3] } },
                { extend: 'csv', title: 'Orders', filename: "Orders", exportOptions: { columns: [0, 1, 2, 3] } },
                { extend: 'excel', title: 'Orders', filename: "Orders", exportOptions: { columns: [0, 1, 2, 3] } },
                { extend: 'pdf', title: 'Orders', filename: "Orders", exportOptions: { columns: [0, 1, 2, 3] } },
                {
                    extend: 'print',

                    customize: function (win) {
                        $(win.document.body).addClass('white-bg');
                        $(win.document.body).css('font-size', '10px');
                        $(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit');
                        $(win.document.body).find("tr").each(function () {
                            $(this).find('th:last').css('display', 'none').css('visibility', 'hidden').remove();
                            $(this).find('td:last').css('display', 'none').css('visibility', 'hidden').remove();

                        });
                    }
                }
            ]);

        // Table : in Progress - new 
        $scope.inPAndNewdtOptions = DTOptionsBuilder.newOptions()
            //.withOption('paging', false) // Disable Pagination
            .withDOM('<"html5buttons"B>lTfgtp<"bottom"i<"clear">>')
            .withButtons([
                { extend: 'copy', title: 'Orders', filename: "Orders", exportOptions: { columns: [1, 2, 3, 4] } },
                { extend: 'csv', title: 'Orders', filename: "Orders", exportOptions: { columns: [1, 2, 3, 4] } },
                { extend: 'excel', title: 'Orders', filename: "Orders", exportOptions: { columns: [1, 2, 3, 4] } },
                { extend: 'pdf', title: 'Orders', filename: "Orders", exportOptions: { columns: [1, 2, 3, 4] } },
                {
                    extend: 'print',

                    customize: function (win) {
                        $(win.document.body).addClass('white-bg');
                        $(win.document.body).css('font-size', '10px');
                        $(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit');
                        $(win.document.body).find("tr").each(function () {
                            $(this).find('td:first').css('display', 'none').css('visibility', 'hidden').remove();
                            $(this).find('td:last').css('display', 'none').css('visibility', 'hidden').remove();
                            $(this).find('th:first').css('display', 'none').css('visibility', 'hidden').remove();
                            $(this).find('th:last').css('display', 'none').css('visibility', 'hidden').remove();
                        });
                    }
                }
            ]);
    };
