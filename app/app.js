'use strict';

// App root module, app modules in dependencies
angular.module('myApp', [
  'ngRoute',
  'contactEndpointModule',
  'getJSONfileModule',
  'queryDatasetModule',
  'd3Module',
  'myApp.view1',
  'myApp.view2',
  'myApp.d3view',
  'myApp.version'
])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/view1'});
}])

.controller('myAppCtrl', function($rootScope){
  $rootScope.appName = "project";
});
