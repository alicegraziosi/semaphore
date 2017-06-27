'use strict';

// App root module, app modules in dependencies
angular.module('myApp', [
  'ngRoute',
  'contactEndpointModule',
  'getJSONfileModule',
  'queryDatasetModule',
  'd3Module',
  'myApp.view1',
  'myApp.about',
  'myApp.d3view',
  'myApp.version'
])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/graph'});
}])


/*

set global timeout milliseconds for http request
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.timeout = 30000;
}])


but...
$http will not respect default setting for timeout set it in httpProvider

*/

.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
])

.controller('myAppCtrl', function($rootScope){
  $rootScope.appName = "project";

});
