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
.controller('addEndpointCtrl', ['$scope' , '$rootScope', 'ContactSPARQLendpoint',
  function($scope, $rootScope, ContactSPARQLendpoint){

    $scope.endpointName = "";
    $scope.endpointURL = "";
    $scope.endpointGraph = "";

    $scope.successMessageToAppear = false;
    $scope.negativeMessageToAppear = false;
    $scope.attentionMessageToAppear = false;

  $scope.addEndpoint = function(endpointName, endpointURL, endpointGraph) {
    var endpoint = {
      'endpointUrl': $scope.endpointURL, 
      'endpointName': $scope.endpointName,
      'graphs' : [$scope.endpointGraph]
    };
    // se c'è già
    if (_.findWhere($rootScope.datasetsAndGraphs, endpoint) != null) {
      $scope.attentionMessageToAppear = true;
    } else {  // se non c'è
      $scope.pingEndpoint($scope.endpointURL, $scope.endpointGraph);
    } 
  }


	$scope.pingEndpoint = function(endpointURL, endpointGraph) {
		ContactSPARQLendpoint.contactSelectedEndpoint(endpointURL, endpointGraph)
		.success(function(data, status, headers, config){
      $scope.successMessageToAppear = true;
      var endpoint = {
        'endpointUrl': $scope.endpointURL, 
        'endpointName': $scope.endpointName,
        'graphs' : [$scope.endpointGraph]
      };
      $rootScope.datasetsAndGraphs.push(endpoint);
      console.log($rootScope.datasetsAndGraphs);
		})
		.error(function(data, status, headers, config){
      console.log("error");
      /*
      var endpoint = {
        'endpointUrl': $scope.endpointURL, 
        'endpointName': $scope.endpointName,
        'graphs' : [$scope.endpointGraph]
      };
      $rootScope.datasetsAndGraphs.push(endpoint);
      console.log($rootScope.datasetsAndGraphs);
      */
      $scope.negativeMessageToAppear = true;
		});
	};
	
  $scope.dismissMessage = function(){
    $('.message').transition('fade');
  };


  // clear selected graph and endpoint
  $scope.restoreToDefault = function(){
    $scope.endpointName = "";
    $scope.endpointURL = "";
    $scope.endpointGraph = "";

    $scope.successMessageToAppear = false;
    $scope.negativeMessageToAppear = false;
    $scope.attentionMessageToAppear = false;
  };

  $scope.restoreToDefault();

}]);