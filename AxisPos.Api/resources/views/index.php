<!DOCTYPE html>
<html ng-app="inspinia" >

<head>
    <base href="/">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Page title set in pageTitle directive -->
    <title page-title></title>

    <link href="https://fonts.googleapis.com/css?family=Keania+One" rel="stylesheet">

    <!-- Angular switch toggle -->
    <link href="css/plugins/toggle-switch/bootstrap3/angular-toggle-switch-bootstrap-3.css" rel="stylesheet">

    <!-- Angular notify -->
    <link href="css/plugins/angular-notify/angular-notify.min.css" rel="stylesheet">

    <!-- Font awesome -->
    <link href="font-awesome/css/font-awesome.css" rel="stylesheet">

    <!-- Bootstrap and Fonts -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Full Calendar -->
    <link href="css/plugins/fullcalendar/fullcalendar.css" rel="stylesheet">

    <!-- @@Style for wizard - based on Steps plugin-->
    <!--<link href="css/plugins/steps/jquery.steps.css" rel="stylesheet">-->
    <!-- @@FancyBox -->
    <!--<link href="js/plugins/fancybox/jquery.fancybox.css" rel="stylesheet">-->
    <!-- @@Dropzone style -->
    <!--<link href="css/plugins/dropzone/basic.css" rel="stylesheet">-->
    <!--<link href="css/plugins/dropzone/dropzone.css" rel="stylesheet">-->

    <!-- Data Tables -->
    <link href="css/plugins/dataTables/dataTables.bootstrap.css" rel="stylesheet">
    <link href="css/plugins/dataTables/plugins/responsive/responsive.dataTables.css" rel="stylesheet">

    <!-- iCheck -->
    <link href="css/plugins/iCheck/custom.css" rel="stylesheet">

    <!-- Chosen Plugin -->
    <link href="css/plugins/chosen/chosen.css" rel="stylesheet">



    <!-- Switchery iOS style -->
    <link href="css/plugins/switchery/switchery.css" rel="stylesheet">

    <!-- DataPicker -->
    <link href="css/plugins/datapicker/angular-datapicker.css" rel="stylesheet">

    <!-- @@Ng-Grid -->
    <!--<link href="js/plugins/nggrid/ng-grid.css" rel="stylesheet">-->

    <!-- Main Inspinia CSS files -->
    <link href="css/animate.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">

    <!-- X-editable  -->
    <link href="css/plugins/x-editable/xeditable.css" rel="stylesheet">

    <!-- toaster  -->
    <link href="css/plugins/toaster/toastr.min.css" rel="stylesheet">
    <link href="js/plugins/loading-buttons/ladda-themeless.min.css" rel="stylesheet" />

    <style type="text/css">
        .pace-fixes{
            left: 0;
        }
    </style>

</head>

<body ng-controller="MainCtrl" id="top">

    <!-- Wrapper-->
    <div id="wrapper">
        <!-- log-in -->
        <div  ui-view="loginView" ></div>

        <div ui-view="mainView"></div>
    </div>

    <div ng-include="'app/layout/common/skin-config.html'" ng-show="auth.isLoggedIn()"></div>

    <!-- Toaster initializer -->
    <toaster-container toaster-options="{'close-button': true,'body-output-type': 'trustedHtml'}"></toaster-container>

    <!-- jQuery and Bootstrap , momentJs -->
    <script src="js/jquery/jquery-2.1.1.min.js"></script>
    <script src="js/plugins/jquery-ui/jquery-ui.js"></script>
    <script src="js/bootstrap/bootstrap.min.js"></script>
    <script src="js/plugins/moment/moment.2.14.1.js"></script>
    <script src="js/plugins/moment/moment-timezone-with-data-0.5.9.js"></script>
    <script src="js/plugins/moment/moment-precise-range.js"></script>


    <!-- MetsiMenu -->
    <script src="js/plugins/metisMenu/jquery.metisMenu.js"></script>

    <!-- SlimScroll #skin-config -->
    <script src="js/plugins/slimscroll/jquery.slimscroll.min.js"></script>

    <!-- @@Fancy box -->
    <!--<script src="js/plugins/fancybox/jquery.fancybox.js"></script>-->
    <!-- ##Morris Charts -->
    <!--<script src="js/plugins/morris/raphael-2.1.0.min.js"></script>-->
    <!--<script src="js/plugins/morris/morris.js"></script>-->
    <!-- ##Rickshaw charts -->
    <!--<script src="js/plugins/rickshaw/vendor/d3.v3.js"></script>-->
    <!-- <script src="js/plugins/rickshaw/rickshaw.min.js"></script>-->

    <!-- iCheck -->
    <script src="js/plugins/iCheck/icheck.min.js"></script>

    <!-- Chosen -->
    <script src="js/plugins/chosen/chosen.jquery.js"></script>

    <!-- Peace JS Loading page plugin -->
    <script src="js/plugins/pace/pace.min.js"></script>



    <!-- Ion Range Slider-->
    <script src="js/plugins/ionRangeSlider/ion.rangeSlider.min.js"></script>

    <!-- Input Mask http://www.jasny.net/bootstrap -->
    <script src="js/plugins/jasny/jasny-bootstrap.min.js"></script>

    <!-- Switchery -->
    <script src="js/plugins/switchery/switchery.js"></script>

    <!-- Data Tables jquery -->
    <script src="js/plugins/dataTables/datatables.min.js"></script>
    <script src="js/plugins/dataTables/Plugins/buttons.colVis.js"></script>

    <!-- Dropzone -->
    <script src="js/plugins/dropzone/dropzone.js"></script>

    <!-- Full Calendar jquery -->
    <script src="js/plugins/fullcalendar/fullcalendar.min.js"></script>

    <!-- GOOGLE MAPS -->
    <script src='//maps.googleapis.com/maps/api/js?key=AIzaSyDtlaZTFhWE2Zu6l9oaQ3vrVvwTnjBM8so'></script>

    <!-- Angular scripts-->
    <script src="js/angular/angular.min.js"></script>
    <script src="js/angular/angular-animate.min.js"></script>
    <script src="js/angular/angular-sanitize.min.1.4.9.js"></script>
    <script src="js/ui-router/angular-ui-router.min.js"></script>
    <!--<script src="js/plugins/temp/route/angular-ui-router.js"></script>-->
    <script src="js/bootstrap/ui-bootstrap-tpls-1.3.3.min.js"></script>
    <script src="js/angular/angular-resource.min.js"></script>
    <script src="js/plugins/sortable/sortable.js"></script>
    <script src="js/angular/angular-local-storage.js"></script>
    <script src="js/plugins/toggle-switch/angular-toggle-switch.min.js"></script>

    <!-- Angular google maps -->
    <script src="js/plugins/angular-google-maps/lodash.4.17.4.js"></script>
    <script src="js/plugins/angular-google-maps/angular-maps.js"></script>
    <script src="js/plugins/angular-google-maps/angular-simple-logger.js"></script>

    <!-- Angular Dependiences -->
    <script src="js/plugins/loading-buttons/spin.min.js"></script>
    <script src="js/plugins/loading-buttons/ladda.min.js"></script>
    <script src="js/plugins/loading-buttons/angular-ladda.min.js"></script>
    <!--<script src="js/plugins/rickshaw/angular-rickshaw.js"></script>-->
    <script src="js/bootstrap/angular-bootstrap-checkbox.js"></script>
    <script src="js/plugins/switchery/ng-switchery.js"></script>
    <script src="js/plugins/datapicker/datePicker.js"></script>
    <script src="js/plugins/chosen/angular-chosen.min(angular-1.49).js"></script>
        <!-- Datatables plugins -->
    <script src="js/plugins/dataTables/angular-datatables.js"></script>
    <script src="js/plugins/dataTables/Plugins/angular-datatables.buttons.min.js"></script>
    <script src="js/plugins/dataTables/Plugins/responsive/dataTables.responsive.js"></script>
        <!--  plugins -->
    <script src="js/plugins/fullcalendar/gcal.js"></script>
    <script src="js/plugins/fullcalendar/calendar.js"></script>
    <script src="js/plugins/uievents/event.js"></script>
    <script src="js/plugins/angular-notify/angular-notify.min.js"></script>
    <script src="js/plugins/colorpicker/bootstrap-colorpicker-module.js"></script>
    <script src="js/plugins/counter/angular-counter-with-easing.min.js"></script>
    <script src="js/plugins/x-editable/xeditable.js"></script>
    <script src="js/plugins/toaster/toaster-0.4.16.min.js"></script>
    <script src="js/angular/angular-touch-1.5.8.js"></script>
    <script src="js/plugins/angular-sounds/anguar.audio.js"></script>
        <!-- Requirments -->
    <script src="js/plugins/toastr/toastr.min.js"></script>
    <script src="js/plugins/angular-idle/angular-idle.min.js"></script>
    <script src="js/plugins/angular-signalr-hub/jquery.signalR-2.2.1.min.js"></script>
    <script src="js/plugins/angular-signalr-hub/signalr-hub.min.js"></script>
    <script src="js/plugins/angular-aria/angular-aria.min.js"></script>
    <script src="js/plugins/angular-unsavedChanges/unsavedChanges.min.js"></script>
    <script src="js/plugins/ngFader/ngFader.js"></script>
    <script src="js/plugins/flow/ng-flow-standalone.min.js"></script>
    <script src="js/plugins/flow/fusty-flow-factory.js"></script>
    <script src="js/plugins/flow/fusty-flow.js"></script>
    <script src="js/plugins/angular-chrome-notification/angular-desktop-notification.js"></script>

    <!-- Custom and plugin javascript -->
    <script src="js/inspinia.js"></script>

    <script src="environment.js" ></script>

    <!-- Load AngularJS application -->
    <script src="js/app.module.js"></script>

    <!-- blocks module -->
    <script src="app/blocks/logger/logger.module.js"></script>
    <script src="app/blocks/logger/logger.js"></script>
    <script src="app/blocks/exception/exception.module.js"></script>
    <script src="app/blocks/exception/exception.js"></script>
    <script src="app/blocks/exception/exception-handler.provider.js"></script>
    <script src="app/blocks/router/router.module.js"></script>
    <script src="app/blocks/router/constants.js"></script>
    <script src="app/blocks/router/router.js"></script>
    <script src="app/blocks/security/security.module.js"></script>
    <script src="app/blocks/security/auth.service.js"></script>
    <script src="app/blocks/security/session.service.js"></script>
    <script src="app/blocks/security/checkAccessOnStateChange.js"></script>
    <script src="app/blocks/security/auth.interceptor.js"></script>
    <script src="app/blocks/services/services.module.js"></script>
    <script src="app/blocks/services/branchesResources.js"></script>
    <script src="app/blocks/services/dashboardResources.js"></script>
    <script src="app/blocks/services/ordersResources.js"></script>
    <script src="app/blocks/services/sectionResources.js"></script>
    <script src="app/blocks/services/subscriptionResources.js"></script>
    <script src="app/blocks/services/usersResources.js"></script>
    <script src="app/blocks/services/rolesResources.js"></script>
    <script src="app/blocks/services/vendorResources.js"></script>
    <script src="app/blocks/directives/directives.module.js"></script>
    <script src="app/blocks/directives/directives.js"></script>

    <!-- common module -->
    <script src="app/common/common.services.module.js"></script>
    <script src="app/common/dates.js"></script>
    <script src="app/common/filter.js"></script>
    <script src="app/common/currency.js"></script>

    <!-- core module -->
    <script src="app/core/core.module.js"></script>
    <script src="app/core/constants.js"></script>
    <script src="app/core/config.js"></script>
    <script src="app/core/localStorage.js"></script>
    <script src="app/core/assignServicesToRootScope.js"></script>
    <script src="app/core/angularIdleMgr.js"></script>
    
    <!-- layout module -->
    <script src="app/layout/layout.module.js"></script>
    <script src="app/layout/mainCtrl.js"></script>

    <!-- account module -->
    <script src="app/account/account.module.js"></script>
    <script src="app/account/loginCtrl.js"></script>

    <!-- branches module -->
    <script src="app/branches/branches.module.js"></script>
    <script src="app/branches/branchesCtrl.js"></script>

    <!-- dashboard module -->
    <script src="app/dashboard/dashboard.module.js"></script>
    <script src="app/dashboard/dashboardCtrl.js"></script>

    <!-- menu module -->
    <script src="app/menu/menu.module.js"></script>
    <script src="app/menu/menuCtrl.js"></script>

    <!-- orders module -->
    <script src="app/orders/orders.module.js"></script>
    <script src="app/orders/config.js"></script>
    <script src="app/orders/ordersCtrl.js"></script>

    <!-- reports module -->
    <script src="app/reports/reports.module.js"></script>
    <script src="app/reports/reporstCtrl.js"></script>

    <!-- settings module -->
    <script src="app/settings/settings.module.js"></script>
    <script src="app/settings/settingsCtrl.js"></script>

    <!-- subscriptions module -->
    <script src="app/subscriptions/subscriptions.module.js"></script>
    <script src="app/subscriptions/subscriptionCtrl.js"></script>

    <!-- userManagement module -->
    <script src="app/userManagement/users.module.js"></script>
    <script src="app/userManagement/usersCtrl.js"></script>

    <!-- ES5 shim for old browsers UPLOAD -->
    <script src="js/jquery/es5-shim.min.js"></script>
    <script src="js/jquery/es5-sham.min.js"></script>
    <!-- Uploader -->
    <script src="js/plugins/upload/console-sham.js"></script>
    <script src="js/plugins/upload/angular-file-upload.min.js"></script>
    <script src="js/plugins/upload/directives.js"></script>

</body>
</html>
