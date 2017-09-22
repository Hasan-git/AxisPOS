(function () {
    'use strict';

    angular.module("app.core", [
        "ngIdle",
        "SignalR",
        "flow",
        "unsavedChanges",
        "ngDesktopNotification",        //Chrome notification https://github.com/jmsanpascual/angular-desktop-notification
        'ngAudio',                      //angular audio
        //'ngTouch',                      // Touch plugin
        'LocalStorageModule',           // Local Storage
        'ngAnimate',                    // Angular-animate      
        'ui.sortable',                  // Sortable Plugin
        'toaster',                      // Toaster Dialog      https://github.com/jirikavi/AngularJS-Toaster   
        'localytics.directives',        // Chosen select       http://leocaseiro.github.io/angular-chosen/
        'angularFileUpload',            // Upload plugin       https://github.com/nervgh/angular-file-upload
        'ui.router',                    // Routing
        'ui.calendar',                  // Calendar        
        'ui.bootstrap',                 // Bootstrap
        'ui.checkbox',                  // Custom checkbox        
        'angular-ladda',                // Loading Buttons
        'NgSwitchery',                  // iOS7 swich style   http://abpetkov.github.io/switchery/
        //'angular-rickshaw',             // Rickshaw carts       
        'datePicker',                   // Datapicker        
        'datatables',                   // Dynamic tables     http://l-lin.github.io/angular-datatables/
        'datatables.buttons',           //databales buttons        
        //'ngGrid',                       // ngGrid
        'cgNotify',                     // Angular notify
        'counter',                      // numbers counter
        'xeditable',                    // X-editable        https://vitalets.github.io/angular-xeditable/#editable-popover
        'ngSanitize',
        'toggle-switch',                 //Switch plugin      https://github.com/JumpLink/angular-toggle-switch

        "blocks.logger",
        "blocks.exception",
        "blocks.security",
        "blocks.router",
        "blocks.services",
        "blocks.directives",
        "app.common.services"
    ])
    //.factory('_', ['$window', function ($window) {
    //    return $window._;
    //}])
    ;
})();
