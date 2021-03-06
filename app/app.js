'use strict';

// App root module, app modules in dependencies
angular.module('myApp', [
  'ngRoute',
  'contactEndpointModule',
  'getJSONfileModule',
  'queryDatasetModule',
  'menuModule',
  'customiseModule',
  'addEndpointModule',
  'd3Module',
  'myApp.about',
  'myApp.d3view'
  //'myApp.version'
])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/graph'});
}])

// https://stackoverflow.com/questions/21446054/angular-ng-if-specific-route
.run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeSuccess', function() {
      $rootScope.showSection = $location.path() !== "/about";
      //$rootScope.showSection = $location.path() !== "/addEndpoint";
  });
})

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
  $rootScope.appName = "GIG";
  $rootScope.subtitle = "generating interfaces for RDF graphs";

  $rootScope.serviceUrl = "http://eelst.cs.unibo.it:8095/api";
  //$rootScope.serviceUrl = "http://localhost:8095/api";
});
