

    angular
        .module('app.menu')
        .controller('Menu', Menu);

    Menu.$inject = ["$scope", "$timeout", "resolvedMenu", "$compile", "sectionResource", "FileUploader", "toaster", "__env", "$rootScope", "$filter", "dates", "session", "$uibModal", "$q", "vendorResource", "currencyService"];
    function Menu($scope, $timeout, resolvedMenu, $compile, sectionResource, FileUploader, toaster, __env, $rootScope, $filter, dates, session, $uibModal, $q, vendorResource, currencyService) {

        console.log(resolvedMenu)
        $scope.menusResolved = resolvedMenu.result;
        $scope.VendorCurrency = {};

        ////////////////////////////////////////////////

        vendorResource.vendor.getVendorCurrencies().$promise.then(function (data) {
            $scope.VendorCurrency = JSON.parse(angular.toJson(data.result));
            $scope.VendorCurrency.primaryCurrency = currencyService.getCodeByName($scope.VendorCurrency.primaryCurrency)
            $scope.VendorCurrency.secondaryCurrency = currencyService.getCodeByName($scope.VendorCurrency.secondaryCurrency)
            console.log($scope.VendorCurrency)
        });

        $scope.mapMenuSections = function (menuObj) {
            $scope.menuSections = [];
            var menus = menuObj;
            menus['result'].map(function (menu) {
                menu['sections'].map(function (section) {
                    //Adding menu Id foreach section , to order section by first by menu then by positionOrder
                    section.menuId = menu.id;
                    $scope.menuSections.push(section)
                })
            });
            return $scope.menuSections;
        }

        //Intialtize data / Map Menu Sections
        $scope.sections_ = [];
        $scope.sections_.items = [];

        $scope.sections_ = $scope.mapMenuSections(resolvedMenu);

        $scope.item = { option: [] };
        $scope.section = {};

        // Hide forms on page load
        $scope.showSection = false;
        $scope.showItem = false;

        //Display buttons counter Initialization
        //$scope.sectionslength = $scope.sections_.length;
        $scope.itemslength = 0;
        $scope.itemsDisabledLength = 0;
        $scope.specialItems = [];

        $scope.sizeOptionStatus = { open: false };
        $scope.sizeOption = {};

        //////////////////////////////////////////////////////


        $scope.refreshData = function () {

            //map over each menu sections and order the sections by positionOrder in case the server returning unordered sections (Case existing)
            $scope.menusResolved.map(function (menu, menuIdx) {
                $scope.menusResolved[menuIdx].sections = $filter('orderBy')($scope.menusResolved[menuIdx].sections, 'positionOrder')
            })


            // For first Version  -> just one menu of menus will be returned -> take first menu id  
            $scope.defaultMenuId = $scope.menusResolved[0].id;

            // Special Items / Special Tab
            $scope.specialItems = [];
            $scope.menusResolved.map(function (menu) {
                menu.sections.map(function (i) {
                    if (i.items) {
                        if (i.items.length) {
                            return i.items.map(function (idx) {
                                if (idx.isSpecial === true) {
                                    return $scope.specialItems.push(idx);
                                }
                            });
                        }
                    }
                })
            })

            // Items grouped by section for special item select chosen
            $scope.groupedItems = [];
            $scope.menusResolved.map(function (menu) {
                menu.sections.map(function (section) {
                    if (section.items) {
                        if (section.items.length) {
                            return section.items.map(function (item) {
                                //if (item.isSpecial === false) {
                                    item.sectionName = section.name;
                                    return $scope.groupedItems.push(item);
                                //}
                            });
                        }
                    }
                })
            })

            $scope.itemsDisabledLength = 0;
            // items disabled - not active
            $scope.menusResolved.map(function (menu) {
                menu.sections.map(function (i) {
                    if (i.items) {
                        if (i.items.length) {
                            i.items.map(function (idx) {
                                if (idx.isActive === false) {
                                    return $scope.itemsDisabledLength++;
                                }
                            });
                        }
                    }
                })
            })

            //  select options -> sections - item 
            $scope.sectionsNames = [];
            $scope.menusResolved.map(function (menu) {
                menu.sections.map(function (i) {
                    return $scope.sectionsNames.push({ id: i.id, name: i.name });
                });
            })

            // Items length / section Length -> for display
            $scope.itemslength = 0;
            $scope.sectionslength = 0;
            $scope.menusResolved.map(function (menu) {
                menu.sections.map(function (section) {
                    $scope.sectionslength++;
                    if (section.items) {
                        if (section.items.length) {
                            return $scope.itemslength += section.items.length;
                        }
                    }
                });
            })

        };// Refresh Data

        //intialize on load
        $scope.refreshData();

        
        
        // ----------------------------------------------------------
        //                  Sortable region
        //-----------------------------------------------------------

        //setup sortable sections 
        $scope.sortableSections = {
            start: function (e, ui) {
                ui.placeholder.height(ui.item.height());
            },
            stop: function (event, ui) {
            },
            update: function (event, ui) {

                //check if moved , and oreordering sections with the same menuId
                if (angular.isUndefined(ui.item.sortable.dropindex) || angular.isUndefined(ui.item.sortable.index) || $scope.sections_[ui.item.sortable.index].menuId != $scope.sections_[ui.item.sortable.dropindex].menuId) {
                    ui.item.sortable.cancel();
                    return;
                }
                else {

                    var menuIdx = ui.item[0].id;
                    var oldIdx = ui.item.sortable.index
                    var newIdx = ui.item.sortable.dropindex


                    //TODO : DELETE 
                    //var old_ = $scope.sections_[ui.item.sortable.index]
                    //var new_ = $scope.sections_[ui.item.sortable.dropindex]
                    var old_ = $scope.menusResolved[menuIdx].sections[ui.item.sortable.index]
                    var new_ = $scope.menusResolved[menuIdx].sections[ui.item.sortable.dropindex]
                    var oldPosition = old_.positionOrder;
                    var newPosition = new_.positionOrder;

                    var log = { id: old_.id, order: new_.positionOrder };
                    sectionResource.menu.reorderSection(log).$promise.then(function (data) {

                        if (data.result === "reordered") {
                            if (oldPosition < newPosition) {

                                var obj = $scope.menusResolved[menuIdx].sections;
                                console.log("OBJ o L n > ", obj)
                                angular.forEach(obj, function (value, key) {
                                    if (obj[key].menuId === old_.menuId && obj[key].positionOrder > oldPosition && obj[key].positionOrder <= newPosition) {
                                        obj[key].positionOrder -= 1;
                                    }
                                })
                                obj[newIdx].positionOrder = newPosition
                                $scope.menusResolved[menuIdx].sections = obj;

                            } else if (oldPosition > newPosition) {

                                var obj = $scope.menusResolved[menuIdx].sections;
                                console.log("OBJ o G n  > ", obj)

                                angular.forEach(obj, function (value, key) {
                                    if (obj[key].menuId === old_.menuId && obj[key].positionOrder < oldPosition && obj[key].positionOrder >= newPosition) {
                                        obj[key].positionOrder += 1;
                                    }
                                })
                                obj[newIdx].positionOrder = newPosition
                                $scope.menusResolved[menuIdx].sections = obj;
                            }
                            toaster.pop('success', "Notification", "Section resorted successfully", 4000);
                        }
                    }, function(err) {
                        toaster.pop('error', "Notification", "An error occured", 4000);
                    });
                }
            },
            handle: '.handle',
            axis: 'y',
            cursor: 'move',
        };//sortable 

        //setup sortable Items 
        $scope.sortableItems = {
            start: function (e, ui) {
                ui.placeholder.height(ui.item.height());
            },
            stop: function (event, ui) {

            },//  /-> Stop
            update: function (event, ui) {


                var sectionId = ui.item[0].id;
                var sectionIdx = angular.element(ui.item[0]).attr("parentidx")
                var menuIdx = angular.element(ui.item[0]).attr("menuIdx")

                //check if moved , and oreordering sections with the same menuId
                if (1 === 2 || angular.isUndefined(ui.item.sortable.dropindex) || angular.isUndefined(ui.item.sortable.index)) {
                    ui.item.sortable.cancel();
                    return;
                }
                else {

                    var oldIdx = ui.item.sortable.index
                    var newIdx = ui.item.sortable.dropindex
                    var old_ = $scope.menusResolved[menuIdx].sections[sectionIdx].items[oldIdx]
                    var new_ = $scope.menusResolved[menuIdx].sections[sectionIdx].items[newIdx]
                    var oldPosition = old_.positionOrder;
                    var newPosition = new_.positionOrder;
                    var log = { id: old_.id, order: new_.positionOrder };
                    sectionResource.menu.reorderItem(log).$promise.then(function (data) {

                        if (data.result === "reordered") {
                            if (oldPosition < newPosition) {

                                var obj = $scope.menusResolved[menuIdx].sections[sectionIdx].items;
                                angular.forEach(obj, function (value, key) {
                                    if (obj[key].positionOrder > oldPosition && obj[key].positionOrder <= newPosition)
                                        obj[key].positionOrder -= 1;
                                })
                                obj[newIdx].positionOrder = newPosition
                                $scope.menusResolved[menuIdx].sections[sectionIdx].items = obj;
                                console.log($scope.menusResolved[menuIdx].sections[sectionIdx].items)

                            } else if (oldPosition > newPosition) {

                                var obj = $scope.menusResolved[menuIdx].sections[sectionIdx].items;
                                angular.forEach(obj, function (value, key) {
                                    if (obj[key].positionOrder < oldPosition && obj[key].positionOrder >= newPosition)
                                        obj[key].positionOrder += 1;
                                })
                                obj[newIdx].positionOrder = newPosition
                                $scope.menusResolved[menuIdx].sections[sectionIdx].items = obj;
                                console.log($scope.menusResolved[menuIdx].sections[sectionIdx].items)
                            }
                            toaster.pop('success', "Notification", "Secitions resorted successfully", 4000);
                        }
                    }, function(err) {
                        toaster.pop('error', "Notification", "An error occured", 4000);
                    });
                }
            },
            handle: '.handle',
            axis: 'y',
            cursor: 'move',
        };//sortable Items

        //setup sortable options 
        $scope.sortableOptions = {
            start: function (e, ui) {
                ui.placeholder.height(ui.item.height());
            },
            stop: function (event, ui) {
                angular.forEach($scope.item.options, function (value, key) {
                    var newPosition = key + 1;
                    $scope.item.options[key].position = newPosition
                });
            },
            update: function (event, ui) {
                $scope.$apply();
            },
            handle: '.handle',
            axis: 'y',
            cursor: 'move',
        };

        //------------------------------------------------------
        //                      End  sortable region  
        //------------------------------------------------------
    
        //------------------------------------------------------
        //                      Size option region  
        //------------------------------------------------------

        $scope.sizeOptionIsEnabled = false;
        $scope.toggleSizeOption = function () {
            // close/open panel & toggle size option
            $scope.sizeOptionStatus.open = $scope.sizeOptionIsEnabled ? false : true;
            $scope.sizeOptionIsEnabled = !$scope.sizeOptionIsEnabled;
        }
        
        // add new value in size option
        $scope.addSizeOptnVal = function (defId, idx, e) {
            e.preventDefault();
            e.stopPropagation();
            $scope.sizeOption.values.push({ key: 'Opt' + Math.round((Math.random() * 10) * 10), name: '', price: "0.00" });
        };

        // remove value from size option
        $scope.removeSizeOptnVal = function (defId, defIdx, vId, vidx) {
            $scope.sizeOption.values.splice(vidx, 1);
        };

        //------------------------------------------------------
        //                      End size option region  
        //------------------------------------------------------
    
        // -----------------------------------------------------
        //                      Item region
        //------------------------------------------------------

        // Creating new Item Form
        $scope.newItemForm = function (editForm) {
            //declare option (Object) fixes push issue  
            $scope.item = { options: [] };
            editForm.$setPristine();
            editForm.$setUntouched();
            $scope.showItem = true;
            $scope.creationMode = true;
            
            // Reset Size Option
            $scope.sizeOption = {
                isMultiOption: false,
                name: "Size",
                values: [{
                            key: null,
                            name: "Small",
                            price: "0.00"
                        },
                        {
                            key: null,
                            name: "large",
                            price: "0.00"
                        }]
            };

            document.getElementById('topTab').scrollIntoView();
        };
    
        // Clone Existing item data and past in new form 
        $scope.cloneItem = function (editForm, menuIdx, sectionIdx, itemIdx, itemId) {
            //declare option (Object) fixes push issue  
            $scope.item = { options: [] };
            var itemObject = $scope.getOrderById(itemId)
            $scope.item = angular.copy(itemObject.item)
            $scope.item.price = parseInt($scope.item.price);
            $scope.item.eTATicks = moment($scope.item.etaTicks, "HH:mm:ss");
            $scope.item.sectionId = $scope.menusResolved[itemObject.menuIdx].sections[itemObject.sectionIdx].id;
            $scope.item.sectionId = { "id": $scope.item.sectionId, "name": "" };
            $scope.item.name = '';
            $scope.item.imageUrl = '';
            $scope.item.isSpecial = false;
            $scope.item.id = null;
            
            editForm.$setPristine();
            editForm.$setUntouched();
            $scope.showItem = true;
            $scope.creationMode = true;
            //$scope.scrollTo('#edit_form')
            document.getElementById('topTab').scrollIntoView();

        };

        
        //$scope.hideIcon = false;
        // item form for Editing item
        $scope.editItemForm = function (editForm, menuIdx, sectionIdx, itemIdx, itemId) {

            editForm.$setPristine();
            editForm.$setUntouched();
            
            $scope.creationMode = false;

            //$scope.item = { options: [] };
            //Get item from the local object
            var itemObject = $scope.getOrderById(itemId)

            //$scope.item = $scope.menusResolved[menuIdx].sections[sectionIdx].items[itemIdx];
            $scope.item = itemObject.item

            // split ( Price - Currency )
            $scope.item.price = parseInt($scope.item.price);

            // eta is required && reset time counter
            //$scope.item.eTATicks = moment().set({ hour: 0, minute: 5, second: 0, millisecond: 0 });
            $scope.item.eTATicks = moment($scope.item.etaTicks, "HH:mm:ss");

            // Get Item's sectionId
            //$scope.item.sectionId = $scope.menusResolved[itemObject.menuIdx].sections[itemObject.sectionIdx].id;
            $scope.item.sectionId = $scope.menusResolved[itemObject.menuIdx].sections[itemObject.sectionIdx].id;
            // Chosen bug Fixes | Important
            $scope.item.sectionId = { "id": $scope.item.sectionId, "name": "" };
            //$scope.hideIcon = $scope.item.imageUrl.length===0 ? true : false ;
            $scope.showItem = true;
            document.getElementById('topTab').scrollIntoView();
        };

        //-----------------------
        //      Uploader region
        //-----------------------

        var uploader = $scope.uploader = new FileUploader({
            url: __env.BackendUrl + '/upload?vendorId=' + $rootScope.currentUser.vendorId,
            method: "POST",
            queueLimit: 1,
            headers: {
                'Authorization': 'Bearer ' + session.getAccessToken() // Inject Tokens
            }
            //formData: $scope.item,
        });

        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 1;
            }
        });

        var controller = $scope.controller = {
            isImage: function (item) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        uploader.onWhenAddingFileFailed = function (item, filter, options) {
            uploader.clearQueue();
            if (filter.name == "queueLimit") {
                $scope.hideIcon = true;
                uploader.clearQueue();
                uploader.addToQueue(item);
            }
        };

        uploader.onAfterAddingFile = function (fileItem) {
            $scope.hideIcon = true;
            $scope.hideItemImg = true;
            $scope.item.img = '';
        };

        //----------------------------+
        //      End Uploader region
        //----------------------------+

        // fn to edit and creating new item
        $scope.saveItemForm = function (editForm) {

            $scope.Gparams = {
                vendorId: $rootScope.currentUser.vendorId,
                page: 1,
                size: 100
            };

            // Take a copy of item 
            $scope.clonedItem_ = angular.copy($scope.item)

            //TODO: currency should be resolved by vendor status
            //$scope.clonedItem_.currency = $rootScope.currentUser.currency;
            $scope.clonedItem_.currency = $scope.VendorCurrency.primaryCurrency;

           

            // Convert eta time to ticks before sending the post request
            $scope.clonedItem_.eTATicks = dates.timetoTimeSpan($scope.clonedItem_.eTATicks);

            // Update an existing Item 
            if ($scope.clonedItem_.id) {

                // Chosen bug Fixes
                $scope.clonedItem_.sectionId = $scope.clonedItem_.sectionId.id;

                // there is a File to Upload using file uploader
                if (uploader.queue[0]) {
                    uploader.onBeforeUploadItem = function (item) {
                        //item.formData = [$scope.clonedItem_];
                    };

                    $scope.uploader.uploadAll(); //  upload

                    // when upload is ok . next is to update the item
                    uploader.onSuccessItem = function (item, response, status, headers) {
                        $scope.clonedItem_.imageUrl = response;
                        sectionResource.menu.updateItem($scope.clonedItem_).$promise.then(function (data) {
                            sectionResource.menu.get($scope.Gparams).$promise.then(function (res) {
                                $scope.menusResolved = JSON.parse(angular.toJson(res)).result;
                                console.log("Item Updated > ", $scope.sections)
                                $scope.refreshData();
                                $scope.item = {};
                                editForm.$setPristine();
                                editForm.$setUntouched();
                                $scope.showItem = false;
                                uploader.clearQueue();
                                toaster.pop('success', "Notification", "Item updated successfully", 4000);
                            });
                        }, function (error) {

                            showError(error);
                        });
                    }

                    uploader.onErrorItem = function (item, response, status, headers) {
                        $scope.item = {};
                        editForm.$setPristine();
                        editForm.$setUntouched();
                        $scope.showItem = false;
                        uploader.clearQueue();
                        toaster.pop('error', "Notification", "An error occured while uploading", 4000);
                    }

                } else {
                    //there is no images or files to upload 

                    //var item_ = {}
                    //angular.forEach($scope.item, function (v,k) {
                    //    if (k != "imageUrl") item_[k] = v;
                    //})

                    // split url / image name
                    var updatedItem = angular.copy($scope.clonedItem_);
                    if (updatedItem.imageUrl.indexOf('azure/') > 0) {
                        var imageUrl_ = updatedItem.imageUrl.split("azure/")
                        updatedItem.imageUrl = 'azure/' + imageUrl_[1];
                    }

                    var params1 = {
                        vendorId: $rootScope.currentUser.vendorId,
                        page: 1,
                        size: 100
                    };
                    
                    sectionResource.menu.updateItem(updatedItem).$promise.then(function (data) {
                        sectionResource.menu.get(params1).$promise.then(function (res) {
                            //$scope.menusResolved[$scope.modifiedItem.menuIdx].sections[$scope.modifiedItem.sectionIdx].items[$scope.modifiedItem.itemIdx] = item_
                            $scope.menusResolved = JSON.parse(angular.toJson(res)).result;
                            console.log($scope.menusResolved)
                            //$scope.sections_ = $scope.mapMenuSections(JSON.parse(angular.toJson(res)));
                            $scope.refreshData();
                            $scope.modifiedItem = {};
                            $scope.item = {};
                            updatedItem = {};
                            editForm.$setPristine();
                            editForm.$setUntouched();
                            $scope.showItem = false;
                            uploader.clearQueue();
                            toaster.pop('success', "Notification", "Item updated successfully", 4000);
                        });
                    }, function (error) {
                           showError(error);
                        });
                }

            } else { // It's a New Item  

                // Chosen bug Fixes
                $scope.clonedItem_.sectionId = $scope.clonedItem_.sectionId.id;

                if ($scope.sizeOptionIsEnabled) {
                    $scope.clonedItem_.options.unshift($scope.sizeOption);
                }

                // there is File to Upload using file uploader
                if (uploader.queue[0]) {

                    uploader.onBeforeUploadItem = function (item) {
                        //item.formData = [$scope.item];
                    };
                    $scope.uploader.uploadAll(); //  upload

                    // when upload is ok . next it is time to create the item
                    uploader.onSuccessItem = function (item, response, status, headers) {
                        $scope.clonedItem_.imageUrl = response;
                        sectionResource.menu.createItem($scope.clonedItem_).$promise.then(function (data) {
                            sectionResource.menu.get($scope.Gparams).$promise.then(function (res) {
                                $scope.menusResolved = JSON.parse(angular.toJson(res)).result
                                $scope.refreshData();
                                $scope.item = {};
                                editForm.$setPristine();
                                editForm.$setUntouched();
                                $scope.showItem = false;
                                $scope.creationMode = false;
                                uploader.clearQueue();
                                toaster.pop('success', "Notification", "Item created successfully", 4000);
                            });
                        }, function (error) {
                            showError(error);
                        });
                    }

                    uploader.onErrorItem = function (item, response, status, headers) {
                        $scope.item = {};
                        editForm.$setPristine();
                        editForm.$setUntouched();
                        $scope.showItem = false;
                        $scope.creationMode = false;
                        uploader.clearQueue();
                        toaster.pop('error', "Notification", "An error occured while uploading", 4000);
                    }

                } else { // there is no image just create an item

                    // Currency is required on server side
                    //$scope.clonedItem_.currency = $rootScope.currentUser.currency;
                    $scope.clonedItem_.currency = $scope.VendorCurrency.primaryCurrency;
                    
                    // New Item WIthout Image
                    sectionResource.menu.createItem($scope.clonedItem_).$promise.then(function (data) {
                        sectionResource.menu.get($scope.Gparams).$promise.then(function (res) {
                            $scope.menusResolved = JSON.parse(angular.toJson(res)).result;
                            //$scope.sections_ = $scope.mapMenuSections(JSON.parse(angular.toJson(res)));
                            $scope.refreshData();
                            $scope.item = {};
                            editForm.$setPristine();
                            editForm.$setUntouched();
                            $scope.showItem = false;
                            $scope.creationMode = false;
                            uploader.clearQueue();
                            toaster.pop('success', "Notification", "Item created successfully", 4000);
                        });
                    }, function (error) {
                            showError(error)
                    });
                }
            }
        };

        $scope.cancelItemForm = function (editForm) {
            $scope.item = {};
            editForm.$setPristine();
            editForm.$setUntouched();
            $scope.showItem = false;
            uploader.clearQueue();
        };

        $scope.addOption = function () {
            var position = $scope.item.options.length + 1;
            $scope.item.options.push({ name: 'OPTION NAME', position: position, values: [] });
        };

        $scope.addOptionValues = function (defId, idx, e) {
            e.preventDefault();
            e.stopPropagation();
            $scope.item.options[idx].values.push({ key: 'Opt' + Math.round((Math.random() * 10) * 10), name: '', price: "0.00" });
        };

        $scope.removeOption = function (idx, e) {
            e.preventDefault();
            e.stopPropagation();
            $scope.item.options.splice(idx, 1);
        };

        $scope.removeValue = function (defId, defIdx, vId, vidx) {
            $scope.item.options[defIdx].values.splice(vidx, 1);
        };

        // checkbox active / Disable - Change event    
        $scope.itemActive = function (menuIdx, sectionIdx, itemIdx, itemId, value) {
            if (value === true) {
                sectionResource.menu.activateItem({ id: itemId }).$promise.then(function (data) {
                    $scope.menusResolved[menuIdx].sections[sectionIdx].items[itemIdx].isActive = true;
                    $scope.refreshData();
                    toaster.pop('success', "Notification", "Item activated successfully", 4000);
                }, function (error) {
                    $scope.menusResolved[menuIdx].sections[sectionIdx].items[itemIdx].isActive = false;
                    $scope.refreshData();
                    toaster.pop('error', "Notification", "An error occured", 4000);
                });
            } else {
                sectionResource.menu.deactivateItem({ id: itemId }).$promise.then(function (data) {
                    $scope.menusResolved[menuIdx].sections[sectionIdx].items[itemIdx].isActive = false;
                    $scope.refreshData();
                    toaster.pop('success', "Notification", "Item deactivated successfully", 4000);
                }, function (error) {
                    $scope.menusResolved[menuIdx].sections[sectionIdx].items[itemIdx].isActive = true;
                    $scope.refreshData();
                    toaster.pop('error', "Notification", "An error occured", 4000);
                });
            }
        };

        // Remove Special Item
        $scope.deactivateSpecial = function (id, idx) {

            sectionResource.menu.deactivateItemSpeciality({ id: id }).$promise.then(function (data) {
                angular.forEach($scope.menusResolved, function (vMenu, keyMenu) {
                    angular.forEach(vMenu.sections, function (vSection, keySection) {
                        angular.forEach(vSection.items, function (valueItems, itemkey) {
                            if (valueItems.id === id) {
                                $scope.menusResolved[keyMenu].sections[keySection].items[itemkey].isSpecial = false;
                            }
                        })
                    })
                })
                $scope.specialItems.splice(idx, 1);
                $scope.refreshData();
                toaster.pop('success', "Notification", "Item speciality deactivated", 4000);
            }, function (err) {
                toaster.pop('error', "Notification", "An error occured", 4000);
            })
        }

        // Activate Special Item
        $scope.activateSpecial = function (id) {
            if (!id)
                return
            sectionResource.menu.activateItemSpeciality({ id: id }).$promise.then(function (data) {
                angular.forEach($scope.menusResolved, function (vMenu, keyMenu) {
                    angular.forEach(vMenu.sections, function (vSection, keySection) {
                        angular.forEach(vSection.items, function (valueItems, itemkey) {
                            if (valueItems.id === id) {
                                $scope.menusResolved[keyMenu].sections[keySection].items[itemkey].isSpecial = true;
                            }
                        })
                    })
                })
                $scope.refreshData();
                toaster.pop('success', "Notification", "Item speciality activated", 4000);
            }, function (err) {
                toaster.pop('error', "Notification", "An error occured", 4000);
            })
        }
        
        // filter disabled items by pressing disabled btn (top of menu tab)
        $scope.filterDisabled = function () {
            $scope.filterDisableditems = $scope.filterDisableditems === '' ? false : '';
            
            document.getElementsByClassName("col-lg-12 menu")[0].scrollIntoView();
        }

        //------------------------------------------------------
        //                      End item region
        //------------------------------------------------------
        

        //------------------------------------------------------
        //                      Section region  
        //------------------------------------------------------

        // New section - form 
        $scope.newSectionForm = function (form_) {
            form_.$setUntouched();
            form_.$setPristine();

            $scope.section = { items: [] };
            $scope.section.menuId = $scope.defaultMenuId;
            $scope.showSection = true;
            document.getElementById('topTab').scrollIntoView();
        };

        // Edit section - form 
        $scope.editSectionForm = function (sectionForm, menuIdx, sectionIdx, sectionId) {
            sectionForm.$setPristine();
            sectionForm.$setUntouched();

            $scope.section = {}
            $scope.section = angular.copy($scope.menusResolved[menuIdx].sections[sectionIdx]);
            $scope.section.menuId = $scope.menusResolved[menuIdx].id;
            $scope.showSection = true;
            document.getElementById('topTab').scrollIntoView();
        };

        // section form  - cancel
        $scope.cancelSectionForm = function (form_) {
            form_.$setUntouched();
            form_.$setPristine();

            $scope.section = { items: [] };
            $scope.showSection = false;
        };
        // Create new section 
        $scope.saveSectionForm = function (form_) {

            if (!$scope.section.id) {
                sectionResource.menu.createSection($scope.section).$promise.then(function (apiResponse) {
                    var response = JSON.parse(angular.toJson(apiResponse.result))
                    if (response === "created") {
                        var params = {
                            vendorId: $rootScope.currentUser.vendorId,
                            page: 1,
                            size: 100
                        }
                        sectionResource.menu.get(params).$promise.then(function (data) {
                            $scope.section = { items: [] };
                            form_.$setPristine();
                            form_.$setUntouched();
                            $scope.showSection = false;
                            $scope.menusResolved = JSON.parse(angular.toJson(data)).result;
                            $scope.refreshData();
                            toaster.pop('success', "Notification", "Section created successfully", 4000);
                        });
                    }
                    }, function (error) {
                        showError(error)
                    });
            } else {
                sectionResource.menu.updateSection($scope.section).$promise.then(function (apiResponse) {
                    var params = {
                            vendorId: $rootScope.currentUser.vendorId,
                        page: 1,
                        size: 100
                }
                    sectionResource.menu.get(params).$promise.then(function (data) {
                        $scope.section = {
                        items: []
                    };
                        form_.$setPristine();
                        form_.$setUntouched();
                        $scope.showSection = false;
                        $scope.menusResolved = JSON.parse(angular.toJson(data)).result;
                        $scope.refreshData();
                        toaster.pop('success', "Notification", "Section Updated successfully", 4000);
                });
                }, function (error) {
                    showError(error)
                });
            }
        };

        $scope.deleteSection = function (menuIdx, sectionIdx, sectionId) {
            var menuIdx_ = menuIdx, sectionIdx_ = sectionIdx, sectionId_ = sectionId;
            $scope.deleteRejection = false
            
            /////////////////

            var deleteSectionModIns = $uibModal.open({
                animation: true,
                templateUrl: 'deleteSection.html',
                scope: $scope,
                size: 'lg',
            });
            
            //Check if the section contains any active or special items to ignore delete action
            $scope.menusResolved[menuIdx].sections[sectionIdx].items.map(function (item) {
                if (item.isActive || item.isSpecial) {
                    $scope.deleteRejection = true
                }
            });

            $scope.confirmSectionDelete = function () {

                sectionResource.menu.deleteSection({ id: sectionId_ }).$promise.then(function (data) {
                    $scope.menusResolved[menuIdx_].sections.splice(sectionIdx_, 1);
                    $scope.refreshData();
                    toaster.pop('success', "Notification", "Section deleted successfully", 4000);
                }, function (error) {
                    toaster.pop('error', "Notification", "An error occured", 4000);
                });
                deleteSectionModIns.close();
            };

            $scope.cancel = function () {
                deleteSectionModIns.dismiss('cancel');
            };

            
        }
        
        //------------------------------------------------------
        //                      End section region  
        //------------------------------------------------------


        //--------------------------------------------------
        //              
        //--------------------------------------------------

        $scope.oneAtATime = true;
        $scope.oneAtATimeOption = true;
        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };
        $scope.statusOption = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };

        $scope.swtch = true;

        // click to upload | open browse when image overlay is clicked
        $scope.open = function () {
            uploader.clearQueue();
            $scope.hideIcon = false;
            $("#file").show().focus().click().hide();
        };

        // hide the overlay icon in the item image
        $scope.check = function () {
            $scope.hideIcon = false;
        }


        //--------------------------------------------------
        //                  Common 
        //--------------------------------------------------

        var getItemById = function (id) {

            var result;
            var defer = $q.defer();
            $scope.menusResolved.map(function (menu, mIdx) {
                menu.sections.map(function (section, sIdx) {
                    if (section.items) {
                        if (section.items.length) {
                            return section.items.map(function (item, iIdx) {
                                if (item.id === id) {
                                    return result = { item: item, menuIdx: mIdx, sectionIdx: sIdx, itemIdx: iIdx }
                                }
                            });
                        }
                    }
                })
            })
            $q.when(result).then(function (response) { defer.resolve(response); });
            return defer.promise;
        }

        var showError = function (response) {

            if (response.data.modelState) {
                var message = "";
                for (var key in response.data.modelState) {
                    message += response.data.modelState[key] + "</br>";
                }
                toaster.pop('error', "Notification", message, 16000);
            }

            if (response.data.result && response.data.result.modelState) {
                var message = "";
                for (var key in response.data.result.modelState) {
                    message += response.data.result.modelState[key] + "</br>";
                }
                toaster.pop('error', "Notification", message, 16000);
            }
        };

        $scope.getOrderById = function (itemId) {
            var result = {
                item: {},
                menuIdx: 0,
                sectionIdx: 0,
                itemIdx: 0
            }
            var menukey, sectionIdx, itemIdx = 0
            $scope.menusResolved.map(function (menu, mIdx) {
                menu.sections.map(function (section, sIdx) {
                    section.items.map(function (item, iIdex) {
                        if (item.id === itemId) {
                            result = {
                                item: item,
                                menuIdx: mIdx,
                                sectionIdx: sIdx,
                                itemIdx: iIdex
                            }
                        }
                    })
                });
            })
            return result
        }

    };


