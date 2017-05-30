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
  function($rootScope, $scope, $http, queryDatasetService, GetJSONfileService, $q) {
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

    /*
    $rootScope.prova="prova";
    $rootScope.$watch('prova', function(prova, provaold) {
      $scope.prova=$rootScope.prova;
    }, true);
    */

    // wait for all promises
    $q.all([
      queryDatasetService.queryDataset(),
      queryDatasetService.queryDatasetLiteralBand()
      ]).then(function(data) {
        var graph = GetJSONfileService.createJsonFile(data[0].results.bindings);
        var graph2 = GetJSONfileService.createNodeLiteral(data[1].results.bindings, "soggPropLabel");
        $rootScope.nodeLabels = [];
        graph2.nodes.forEach(function(node){
          graph.nodes.push(node);
          $rootScope.nodeLabels.push(node.label)
        });
        graph2.links.forEach(function(l){
          graph.links.push(l);
        });
        graph2.linksToLiterals.forEach(function(ltl){
          graph.linksToLiterals.push(ltl);
        });
        graph2.nodeLiteral.forEach(function(nl){
          graph.nodeLiteral.push(nl);
        });
        $rootScope.graph = graph;
        $rootScope.nodeLabels = $rootScope.nodeLabels.sort();

        $rootScope.dataInfo = {
          headClass : {
            uri : 'http://dbpedia.org/ontology/Band',
            label : 'Band',
            type: "obj" 
          },
          litPropHeadClass: [
            {uri : 'http://dbpedia.org/property/genre',
             label : 'genre', 
             type : 'lit'},
            {uri : 'http://dbpedia.org/property/yearsActive',
             label : 'years active',
             type : 'lit'}
          ],
          objPropHeadClass: [
            {uri: 'http://dbpedia.org/ontology/formerBandMember',
             label : 'former band member',
             type : 'obj'},
            {uri: 'http://dbpedia.org/ontology/bandMember',
             label : 'band member',
             type : 'obj'}
          ]
        }

        $scope.dataInfo = $rootScope.dataInfo;

        // istanze da clusterizzare: quelle della classe principale o obj prop di classe p.
        $scope.clusterByHeadClass = $rootScope.dataInfo.headClass;
        $scope.clusterByOptionsClass = $rootScope.dataInfo.objPropHeadClass;

        // cluster by: proprietà sia della classe principale che delle sue object properties
        $scope.clusterByOptionsProperty = $rootScope.dataInfo.litPropHeadClass;

        $scope.selectedClusterOption = $scope.clusterByOptionsProperty[0];

    });

    $rootScope.$watch('graph', function(graph, graphold) {
      $scope.graph = $rootScope.graph;
      console.log("controller graph changed" + $scope.graph);
      $rootScope.nodeLabels = [];
      if($scope.graph != undefined){
        $scope.graph.nodes.forEach(function(node){
          $rootScope.nodeLabels.push(node.label)
        });
        $scope.nodeLabels = $scope.nodeLabels.sort();
      }
      $scope.nodeLabels = $rootScope.nodeLabels;
    }, true);


    $rootScope.$watch('dataInfo', function(dataInfo, dataInfoold) {
      $scope.dataInfo = $rootScope.dataInfo;
      console.log("controller datainfo changed" + $scope.dataInfo);
    }, true);

    $scope.selected = " ";

    $scope.exportJSON = function () {
      console.log('"Export as JSON" button clicked');
      console.log($rootScope.graph);
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
