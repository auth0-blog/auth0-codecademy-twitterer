angular.module('auth0-sample', ['auth0', 'authInterceptor'])
.config(function (authProvider, $httpProvider) {
  authProvider.init({
    domain: 'codecademy.auth0.com',
    clientID: 'yUiinEhNCEa7jztDjn2d87KHIFUFYNHL',
    callbackURL: location.href
  });


  $httpProvider.interceptors.push('authInterceptor');
})
.controller('MainCtrl', function($scope, auth, $http) {
    $scope.auth = auth;
    $scope.loggedIn = false;
    
    $scope.login = function() {
        auth.signin({popup: true}).then(function() {
            $scope.loggedIn = true;
            $scope.handle = $scope.auth.profile.screen_name;
        }, function() {
            console.log("There was an error signin in");
            alert("Error signing in");
        });
    }

    $scope.tweet = function() {
        $http({
            method: 'POST',
            url: 'http://auth0-codecademy.herokuapp.com/api/finished',
            data: {
                handle: $scope.handle
            }
        }).then(function(data) {
            console.log(data);
        }).then(function(err) {
            console.log(err);
        });
    }
});