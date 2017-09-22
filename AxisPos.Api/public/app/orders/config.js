
         angular.module('app.orders')
        .config(['$uibTooltipProvider', function ($uibTooltipProvider) {
            $uibTooltipProvider.setTriggers({'click': 'close',});
        }])