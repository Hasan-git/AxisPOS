/**
 *
 * Main directives.js file
 * Define directives for used plugin
 *
 */

/**
 *
 * Pass all functions into module
 */
angular
    .module('blocks.directives')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('vectorMap', vectorMap)
    .directive('morrisArea', morrisArea)
    .directive('morrisBar', morrisBar)
    .directive('morrisLine', morrisLine)
    .directive('morrisDonut', morrisDonut)
    .directive('sparkline', sparkline)
    .directive('icheck', icheck)
    .directive('ionRangeSlider', ionRangeSlider)
    .directive('dropZone', dropZone)
    .directive('fancyBox', fancyBox)
    .directive('responsiveVideo', responsiveVideo)
    .directive('iboxToolsFullScreen', iboxToolsFullScreen)
    .directive('jjSwitchWhen', jjSwitchWhen)
    .directive('ngFileSelect', ngFileSelect) //http://plnkr.co/edit/y5n16v?p=preview
    .directive('numerical', numerical)
    .directive('pwStrength', pwStrength)
    .directive('pwCheck', pwCheck)
    .directive('isNumber', isNumber)
    .directive('smartTime', smartTime)
    .directive('popoverClose', popoverClose)
    .directive('popoverElement', popoverElement)
    .directive('defaultImage', defaultImage)

;


/**
 * smartTime - Directive that convert and update date to humanized time format 
 */
smartTime.$inject = ["$filter", "$interval"];
 function smartTime( $filter, $interval) {
     return {
        restrict: "A",
        scope: {
            smartTime: '=smartTime',
            smartTimeValue: '@'
        },
        link: function (scope, element) {

            var smartTime = function () {
                if (scope.smartTime && moment(scope.smartTime).isValid()) {

                    var date = $filter('timeAgo') (new Date (scope.smartTime) )
                    if (element[0].innerHTML != date) {
                        element[0].innerHTML = date;
                            $(element).removeClass('colorAnimated_1', function () {
                                $(element).addClass('colorAnimated_1')
                            });
                            } else {
                                element[0].innerHTML = date;
                            }
                } else if (scope.smartTimeValue && moment(scope.smartTimeValue).isValid()) {

                    var date = $filter('timeAgo')(new Date(scope.smartTimeValue))
                    if (element[0].innerHTML != date) {
                        element[0].innerHTML = date;
                            $(element).removeClass('colorAnimated_1', function () {
                                $(element).addClass('colorAnimated_1')
                            });
                    } else {
                        element[0].innerHTML = date;
                    }
                }

            }

            // update time every 70 sec
            $interval(function () {
                smartTime()
            }, 70000)
        }
    }
};


/**
 * pageTitle - Directive for set Page title - mata title
 */
pageTitle.$inject = ["$rootScope", "$timeout"];
function pageTitle($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'Orline | Admin';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'Orline | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            element.metisMenu();
        }
    };
};

/**
 * responsibleVideo - Directive for responsive video
 */
function responsiveVideo() {
    return {
        restrict: 'A',
        link:  function(scope, element) {
            var figure = element;
            var video = element.children();
            video
                .attr('data-aspectRatio', video.height() / video.width())
                .removeAttr('height')
                .removeAttr('width')

            //We can use $watch on $window.innerWidth also.
            $(window).resize(function() {
                var newWidth = figure.width();
                video
                    .width(newWidth)
                    .height(newWidth * video.attr('data-aspectRatio'));
            }).resize();
        }
    }
}

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
iboxTools.$inject = ["$timeout"];

function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'app/layout/common/ibox_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            },
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                }
        }
    };
};

/**
 * minimalizaSidebar - Directive for minimalize sidebar
*/
minimalizaSidebar.$inject = ["$timeout"];

function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 100);
                } else if ($('body').hasClass('fixed-sidebar')){
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 300);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
};

/**
 * vectorMap - Directive for Vector map plugin
 */
function vectorMap() {
    return {
        restrict: 'A',
        scope: {
            myMapData: '=',
        },
        link: function (scope, element, attrs) {
            element.vectorMap({
                map: 'world_mill_en',
                backgroundColor: "transparent",
                regionStyle: {
                    initial: {
                        fill: '#e4e4e4',
                        "fill-opacity": 0.9,
                        stroke: 'none',
                        "stroke-width": 0,
                        "stroke-opacity": 0
                    }
                },
                series: {
                    regions: [
                        {
                            values: scope.myMapData,
                            scale: ["#1ab394", "#22d6b1"],
                            normalizeFunction: 'polynomial'
                        }
                    ]
                },
            });
        }
    }
}


/**
 * morrisArea - Directive for Morris chart - type Area
 */
function morrisArea() {
    return {
        restrict: 'A',
        scope: {
            chartOptions: '='
        },
        link: function(scope, element, attrs) {
            var chartDetail = scope.chartOptions;
            chartDetail.element = attrs.id;
            var chart = new Morris.Area(chartDetail);
            return chart;
        }
    }
}

/**
 * morrisBar - Directive for Morris chart - type Bar
 */
function morrisBar() {
    return {
        restrict: 'A',
        scope: {
            chartOptions: '='
        },
        link: function(scope, element, attrs) {
            var chartDetail = scope.chartOptions;
            chartDetail.element = attrs.id;
            var chart = new Morris.Bar(chartDetail);
            return chart;
        }
    }
}

/**
 * morrisLine - Directive for Morris chart - type Line
 */
function morrisLine() {
    return {
        restrict: 'A',
        scope: {
            chartOptions: '='
        },
        link: function(scope, element, attrs) {
            var chartDetail = scope.chartOptions;
            chartDetail.element = attrs.id;
            var chart = new Morris.Line(chartDetail);
            return chart;
        }
    }
}

/**
 * morrisDonut - Directive for Morris chart - type Donut
 */
function morrisDonut() {
    return {
        restrict: 'A',
        scope: {
            chartOptions: '='
        },
        link: function(scope, element, attrs) {
            var chartDetail = scope.chartOptions;
            chartDetail.element = attrs.id;
            var chart = new Morris.Donut(chartDetail);
            return chart;
        }
    }
}

/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
    return {
        restrict: 'A',
        scope: {
            sparkData: '=',
            sparkOptions: '=',
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.sparkData, function () {
                render();
            });
            scope.$watch(scope.sparkOptions, function(){
                render();
            });
            var render = function () {
                $(element).sparkline(scope.sparkData, scope.sparkOptions);
            };
        }
    }
};

/**
 * icheck - Directive for custom checkbox icheck
 */
icheck.$inject = ["$timeout"];
function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, $attrs, ngModel) {
            return $timeout(function() {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function(newValue){
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
            });
        }
    };
}

/**
 * ionRangeSlider - Directive for Ion Range Slider
 */
function ionRangeSlider() {
    return {
        restrict: 'A',
        scope: {
            rangeOptions: '='
        },
        link: function (scope, elem, attrs) {
            elem.ionRangeSlider(scope.rangeOptions);
        }
    }
}

/**
 * dropZone - Directive for Drag and drop zone file upload plugin
 */
function dropZone() {
    return function(scope, element, attrs) {
        element.dropzone({
            url: "/upload",
            maxFilesize: 100,
            paramName: "uploadfile",
            maxThumbnailFilesize: 5,
            init: function() {
                scope.files.push({file: 'added'});
                this.on('success', function(file, json) {
                });
                this.on('addedfile', function(file) {
                    scope.$apply(function(){
                        alert(file);
                        scope.files.push({file: 'added'});
                    });
                });
                this.on('drop', function(file) {
                    alert('file');
                });
            }
        });
    }
}

/**
 * fancyBox - Directive for Fancy Box plugin used in simple gallery view
 */
function fancyBox() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.fancybox({
                openEffect	: 'none',
                closeEffect	: 'none'
            });
        }
    }
}
function iboxToolsFullScreen($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'app/layout/common/ibox_tools_full_screen.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            };
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            };
            // Function for full screen
            $scope.fullscreen = function () {
                var ibox = $element.closest('div.ibox');
                var button = $element.find('i.fa-expand');
                $('body').toggleClass('fullscreen-ibox-mode');
                $('.animated').toggleClass('fadeInRightBig');
                button.toggleClass('fa-expand').toggleClass('fa-compress');
                ibox.toggleClass('fullscreen');
                setTimeout(function() {
                    $(window).trigger('resize');
                }, 100);
            }
        }
    };
}
jjSwitchWhen.$inject = ["$compile"];
 function jjSwitchWhen($compile) {
        // Exact same definition as ngSwitchWhen except for the link fn
        return {
            // Same as ngSwitchWhen
            priority: 1200,
            transclude: 'element',
            require: '^ngSwitch',
            link: function(scope, element, attrs, ctrl, $transclude) {

                var caseStms = scope.$eval(attrs.jjSwitchWhen);
                caseStms = angular.isArray(caseStms) ? caseStms : [caseStms];

                angular.forEach(caseStms, function(caseStm) {
                    caseStm = '!' + caseStm;
                    ctrl.cases[caseStm] = ctrl.cases[caseStm] || [];
                    ctrl.cases[caseStm].push({ transclude: $transclude, element: $compile(element)(scope) });
                });
            }
        };
    }

//http://plnkr.co/edit/y5n16v?p=preview
   function ngFileSelect(){
      return {
        link: function($scope,el){      
          el.bind("change", function(e){      
            $scope.file = (e.srcElement || e.target).files[0];
            $scope.getFile();
            })      
          }    
      } 
    }

   function numerical(){
      return {
          require: 'ngModel',
          link: function (scope, elem, attrs, ctrl) {

            elem.add(elem).on('keyup', function () {
              scope.$apply(function () {
                if (    !elem.val().match('^[0-9]*$')   ){
                    ctrl.$setValidity('numericalmatch', false);
                }else{
                    ctrl.$setValidity('numericalmatch', true);
                }
              });
            });
          }
        }
    }

   function pwStrength(){
      return {
          require: 'ngModel',
          link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;

            elem.add(firstPassword).on('keyup', function () {
              scope.$apply(function () {
                if (    elem.val().match('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$')   ){
                    var v = elem.val().match('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$')
                    console.log(v)
                    ctrl.$setValidity('pwStrengthMatch', v);
                }
              });
            });
          }
        }
    }

   function pwCheck(){
      return {
          require: 'ngModel',
          link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
              scope.$apply(function () {
                var v = elem.val()===$(firstPassword).val();
                ctrl.$setValidity('pwmatch', v);
              });
            });
          }
        }
    }

   function isNumber() {
       return {
           require: 'ngModel',
           link: function (scope) {
               scope.$watch('wks.number', function (newValue, oldValue) {
                   var arr = String(newValue).split("");
                   if (arr.length === 0) return;
                   if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.')) return;
                   if (arr.length === 2 && newValue === '-.') return;
                   if (isNaN(newValue)) {
                       scope.wks.number = oldValue;
                   }
               });
           }
       };
   }

   popoverClose.$inject = ["$timeout"];

   function popoverClose($timeout) {
       return {
           scope: {
               excludeClass: '@'
           },
           link: function (scope, element, attrs) {
               var trigger = document.getElementsByClassName('trigger');

               function closeTrigger(i) {
                   $timeout(function () {
                       angular.element(trigger[0]).triggerHandler('close')
                       angular.element(trigger[0]).removeClass('trigger');
                   });
               }
               element.on('click', function (event) {

                   var etarget = angular.element(event.target);
                   var tlength = trigger.length;

                   if (!etarget.hasClass('trigger') && !etarget.hasClass(scope.excludeClass)) {
                       for (var i = 0; i < tlength; i++) {
                           closeTrigger(i)
                       }
                   } else if (!etarget.hasClass(scope.excludeClass)) {
                       $('*').find('.trigger').not(event.target).triggerHandler('close')
                       $('*').find('.trigger').not(event.target).removeClass('trigger')
                   }
               });
           }
       };
   };
   function popoverElement() {
       return {
           link: function (scope, element, attrs) {
               element.on('click', function () {
                   element.addClass('trigger');
               });
           }
       };
   };

   defaultImage.$inject = ["$location"];
   function defaultImage($location) {
       return {
           restrict: 'A',
           link: function (scope, element, attrs) {
               var host = $location.protocol() + '://' + $location.host() + ':' + $location.port()+ '/';
               attrs.$observe('ngSrc', function (ngSrc) {
                   if (!element.attr('src')) {
                       element.attr('src', host + 'img/default.png'); // set default image
                   }
               });
           }
       };
   };












