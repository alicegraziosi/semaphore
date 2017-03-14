'use strict';

var contactEndpointModule = angular.module('contactEndpointModule');

contactEndpointModule.controller('contactEndpointCtrl', function($scope, ContactSPARQLendpoint) {
  $scope.contactSelectedEndpoint = function () {
    ContactSPARQLendpoint.contactSelectedEndpoint($scope.selectedEndpoint)
      .success(function(data, status, headers, config){
        $scope.contacted = $scope.selectedEndpoint + " reached";
      })
      .error(function(data, status, headers, config){
        $scope.contacted = $scope.selectedEndpoint + " unreachable";
      });
  }
});
