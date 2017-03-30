'use strict';

angular.module('myApp.d3view', ['d3Module', 'getJSONfileModule', 'ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when(
      '/graph', {
        templateUrl: 'd3Visualization/d3GraphView.html',
        controller: 'D3viewCtrl'
        /*attenzione!! se il controller è specificato nel config della route allora non bisogna
        scriverlo anche nel html altrimenti viene richiamato due volte!!
        */
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


    /*
    $http.get('../alicegraph.json').success(function (data) {
      $scope.graph = data;
      $scope.nodeLabels = [];
      for (var i = 0; i < $scope.graph.nodes.length - 1; i++) {
          $scope.nodeLabels.push($scope.graph.nodes[i].label);
      }
      $scope.nodeLabels = $scope.nodeLabels.sort();
    });
    */

    var promise = queryDatasetService.queryDataset();
    promise.then(function(response) {
      $scope.graph = GetJSONfileService.createJsonFile(response);
      $scope.nodeLabels = [];
      for (var i = 0; i < $scope.graph.nodes.length - 1; i++) {
          $scope.nodeLabels.push($scope.graph.nodes[i].label);
      }
      $scope.nodeLabels = $scope.nodeLabels.sort();
    });

    $scope.selected = " ";

    $scope.exportJSON = function () {
      console.log('"Export as JSON" button clicked');
    }

    $scope.selectNodeLabel = function(label) {
        $scope.selectedNodeLabel = label;
    };

    $scope.dropdown = function(){
      $('.ui.dropdown').dropdown();
    }

    $scope.searchNode = function(){
      console.log('"searchNode" button clicked');
    }

    $scope.menuItemClick = function(){
      console.log('"menuItemClick" button clicked');
    }

    // opzioni di clustrizzazione
    $scope.clusterByOptionsClass = ['band'];
    $scope.clusterByOptionsProperty = ['year', 'birth place'];

    $scope.selectedClusterOption = "";

    $scope.toggleSelectionClusterOption = function toggleSelection(selectedClusterOption) {
        $scope.selectedClusterOption = selectedClusterOption;
    };

    $scope.clearAll = function () {
      d3.selectAll(".links").remove();
      d3.selectAll(".nodes").remove();
      d3.selectAll(".label").remove();
      d3.selectAll(".image").remove();
      d3.selectAll(".rect").remove();
      d3.selectAll(".text").remove();
    }
});
