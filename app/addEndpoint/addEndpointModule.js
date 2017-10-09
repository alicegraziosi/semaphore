'use strict';

angular.module('addEndpointModule', ['ngRoute', 'contactEndpointModule'])
.config(['$routeProvider', function($routeProvider) {
  /*
    attenzione!! se il controller è specificato nel config della route allora non bisogna
    scriverlo anche nel html altrimenti viene richiamato due volte!!
  */
  $routeProvider
    .when(
      '/addEndpoint', {
        templateUrl: 'addEndpoint/addEndpoint.html',
        controller: 'addEndpointCtrl'
      })
}])
.controller('addEndpointCtrl', ['$scope' , '$rootScope',
  function($scope, $rootScope, ContactSPARQLendpoint){

  $scope.endpointName = "";
  $scope.endpointURL = "";
  $scope.endpointGraph = "";

  $scope.addEndpoint = function(endpointName, endpointURL, endpointGraph) {
    $rootScope.datasetsAndGraphs.push(
      {
        'endpointUrl': $scope.endpointURL, 
        'endpointName': $scope.endpointName,
        'graphs' : [$scope.endpointGraph]
      }
    );
    console.log($rootScope.datasetsAndGraphs);
  }


	$scope.pingEndpoint = function(ContactSPARQLendpoint, endpointURL, endpointGraph) {
		ContactSPARQLendpoint.contactSelectedEndpoint(endpointURL, endpointGraph)
		.success(function(data, status, headers, config){
      $scope.addEndpoint();
		})
		.error(function(data, status, headers, config){
      console.log("error");
		});
	};
	
}]);