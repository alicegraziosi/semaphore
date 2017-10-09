'use strict';

var customiseModule = angular.module('customiseModule', []);

customiseModule.controller('customiseCtrl', ['$scope', '$rootScope',
  function($scope, $rootScope) {

    $scope.apply = function(){
      $rootScope.dataInfo = $scope.dataInfo;
    };

    $scope.restoreDefault = function(){
      $scope.dataInfo = $rootScope.dataInfo;
    };

    $rootScope.$watch('dataInfo', function(dataInfo) {
      $scope.dataInfo = $rootScope.dataInfo;
      console.log("custom data " + $scope.dataInfo);
    });

  }
]);