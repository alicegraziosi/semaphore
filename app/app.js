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
  //$routeProvider.otherwise({redirectTo: '/cluster'});
}])

.controller('myAppCtrl', function($rootScope){
  $rootScope.appName = "project";
});
