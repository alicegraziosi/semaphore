'use strict';

angular.module('myApp.d3view', ['d3Module', 'getJSONfileModule', 'ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when(
      '/graph', {
        templateUrl: 'd3Visualization/d3GraphView.html',
        controller: 'D3viewCtrl'
        /*attenzione!! se il controller è specificato nel config della route allora non bisogna
        scriverlo anche nel html altrimenti viene richiamato due volte!!*/
      })
    .when(
      '/cluster', {
      templateUrl: 'd3Visualization/d3ClusterView.html',
      controller: 'D3viewCtrl'
      /*attenzione!! se il controller è specificato nel config della route allora non bisogna
      scriverlo anche nel html altrimenti viene richiamato due volte!!*/
    }
  );
}])
.controller('D3viewCtrl',
  function($rootScope, $scope, $http, queryDatasetService, GetJSONfileService) {

    $http.get('../alicegraph.json').success(function (data) {
      $scope.graph = data;
    });

    var promise = queryDatasetService.queryDataset();
    promise.then(function(response) {
      //$scope.graph = GetJSONfileService.createJsonFile(response);
    });

    $scope.selected = " ";

    $scope.exportJSON = function () {
      console.log('"Export as JSON" button clicked');
    }

    $scope.newVisualization = function () {
      console.log('"newVisualization" button clicked');
      $scope.clearAll();
    }

    $scope.ripristina = function () {
      console.log('"ripristina" button clicked');
      $scope.clearAll();
    }

    $scope.clearAll = function () { //deve essere funzione di scope
      d3.selectAll(".links").remove();
      d3.selectAll(".nodes").remove();
      d3.selectAll(".label").remove();
      d3.selectAll(".image").remove();
      d3.selectAll(".rect").remove();
      d3.selectAll(".text").remove();
    }
});
