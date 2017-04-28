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
    })
    .when(
      '/barchart', {
      templateUrl: 'd3Visualization/d3BarChartView.html',
      controller: 'D3viewCtrl'
      /*attenzione!! se il controller è specificato nel config della route allora non bisogna
      scriverlo anche nel html altrimenti viene richiamato due volte!!*/
    });
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



    $rootScope.graph = {
      nodes : [],
      linksToLiterals : [],
      nodeLiteral : [],
      links : []
    }
    $scope.graph = $rootScope.graph;

    $rootScope.$watch(function() {
      return $rootScope.graph;
    }, function(graph) {
      $scope.graph = $rootScope.graph;
      $scope.nodeLabels = [];
      for (var i = 0; i < $scope.graph.nodes.length - 1; i++) {
        $scope.nodeLabels.push($scope.graph.nodes[i].label);
      }
      $scope.nodeLabels = $scope.nodeLabels.sort();
    }, true);

    var promise = queryDatasetService.queryDataset();
    promise.then(function(response) {

      $scope.graph = GetJSONfileService.createJsonFile(response.results.bindings);

      for (var i = 0; i < $scope.graph.nodes.length - 1; i++) {
        $scope.nodeLabels.push($scope.graph.nodes[i].label);
      }
      $scope.nodeLabels = $scope.nodeLabels.sort();
    });

    $rootScope.dataInfo = {
      headClass : {
        uri : ' ',
        label : ' '
      },
      litPropHeadClass: [],
      objPropHeadClass: []
    }
    $scope.dataInfo = $rootScope.dataInfo;

    $rootScope.$watch(function() {
      return $rootScope.dataInfo;
    }, function(dataInfo) {
      $scope.dataInfo = $rootScope.dataInfo;
      console.log($scope.dataInfo);
    }, true);


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

    // opzioni di clusterizzazione
    $scope.clusterByOptionsClass = ['http://dbpedia.org/ontology/Band', 'Band', 'former band member', 'birth place'];
    $scope.clusterByOptionsProperty = ['years active', 'genre'];

    $scope.selectedClusterOption = "";

    $scope.toggleSelectionClusterOption = function toggleSelection(selectedClusterOption) {
        $scope.selectedClusterOption = selectedClusterOption;
    };

    // opzioni di visualizzazione (shape)
    $scope.selectObjectShape = function(shape) {
      $scope.objectShape = shape;
    };

    $scope.selectDataTypeShape = function(shape) {
      $scope.datatypeShape = shape;
    };
});
