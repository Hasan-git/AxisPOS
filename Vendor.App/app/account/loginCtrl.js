    angular
        .module('app.account')
        .controller('Login', Login);

    Login.$inject = ["$scope", "$log", "$state", "logger", "auth", "Idle", "toaster"];
    function Login($scope, $log, $state, logger, auth, Idle, toaster) {

        $scope.credentials = {};
        $scope.currentDate = new Date();

        $scope.login = function () {
            $scope.loadingButton = true
            auth.logIn($scope.credentials).then(
                                          function (answer) {
                                              // start watching when the app runs. also starts the Keepalive service by default.
                                              Idle.watch();

                                              $scope.$emit('loggedIn');

                                              // do something
                                              //$state.go("abstract.dashboard");
                                              auth.defaultPage();
                                              $scope.loadingButton = false;
                                          },
                                          function (error) {
                                              $scope.loadingButton = false;
                                              // report something
                                              if (error.data && error.data.error_description) {
                                                  toaster.pop('error', "Notification", error.data.error_description, 12000);
                                              } else {
                                                  toaster.pop('error', "Notification", "An error occured", 12000);
                                              }
                                          },
                                          function (progress) {
                                              // report progress
                                              $scope.loadingButton = false;
                                          });
        }
    }
