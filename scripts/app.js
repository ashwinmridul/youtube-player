'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', ['ngStorage', 'ui.bootstrap', 'AddVideo']);
angular.module('AddVideo', ['ngStorage', 'ui.bootstrap']);

angular.module('videoKenApp', [
    'Authentication',
    'Home',
    'ngRoute',
    'ngCookies',
    'angularVideoBg'
])

.value('googleApiKey', 'AIzaSyC9kUXA3cwNysxZQu9ZllEebQvUgCLJSX4')

.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })
 
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })
 
        .otherwise({ redirectTo: '/login' });
}])
 
.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);