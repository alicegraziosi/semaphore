'use strict';

var queryDatasetModule = angular.module('queryDatasetModule');

queryDatasetModule.controller('queryDatasetCtrl', function($scope, queryDatasetService, GetJSONfileService) {
  $scope.queryDataset = function () {
    queryDatasetService.queryDataset()
      .success(function(data, status, headers, config){
        GetJSONfileService.createJsonFile(data);
      });
    };
});
