'use strict';

angular.module('myApp.d3view', ['d3Module', 'getJSONfileModule', 'ngRoute', 'contactEndpointModule'])

.config(['$routeProvider', function($routeProvider) {
  
  /*
    attenzione!! se il controller è specificato nel config della route allora non bisogna
    scriverlo anche nel html altrimenti viene richiamato due volte!!
  */

  $routeProvider
    .when(
      '/graph', {
        templateUrl: 'd3Visualization/d3GraphView.html',
        controller: 'D3viewCtrl'
      })
    .when(
      '/cluster', {
      templateUrl: 'd3Visualization/d3ClusterView.html',
      controller: 'D3viewCtrl'
    })
    .when(
      '/barchart', {
      templateUrl: 'd3Visualization/d3BarChartView.html',
      controller: 'D3viewCtrl'
    });
}])
.controller('D3viewCtrl',
  function($rootScope, $scope, $http, queryDatasetService, 
    GetJSONfileService, $q, ContactSPARQLendpoint, d3ServiceVersion3, d3Service) {    
    
    /*
    var newD3;
    d3ServiceVersion3.then(function(d3) {
       console.log(d3);
    }); // d3Service.then(function(d3) {
    d3Service.then(function(d3v4) {
      newD3 = d3v4;
      console.log(d3v4);
    }); // d3Service.then(function(d3) {
      */

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

        /*
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
        }*/


        
        $rootScope.dataInfo = {
          classe : {
            uri : 'http://dbpedia.org/ontology/Band',
            label : 'Band',
            type: "obj" 
          },
          litPropClasse: [
            {uri : 'http://dbpedia.org/property/genre',
             label : 'genre', 
             type : 'lit'}
          ],
          objPropClasse: 
            {uri: 'http://dbpedia.org/ontology/bandMember',
             label : 'band member',
             type : 'obj'}
          ,
          litPropObj: [
            {uri : 'http://dbpedia.org/property/yearsActive',
             label : 'years active',
             type : 'lit'}
          ],
          objPropObj: [
          ]
        };

        $scope.dataInfo = $rootScope.dataInfo;
        $scope.info = $rootScope.info;

        $scope.clusterClasse = $rootScope.dataInfo.classe;
        $scope.litPropClasse = $rootScope.dataInfo.litPropClasse;
        $scope.clusterObj = $rootScope.dataInfo.objPropClasse;
        $scope.litPropObj = $rootScope.dataInfo.litPropObj;
        $scope.objPropObj = $rootScope.dataInfo.objPropObj;

        /*
        $scope.selectedClusterOption =  
          {uri : 'http://dbpedia.org/property/genre',
             label : 'genre', 
             type : 'lit'};
        */

    });


    $rootScope.$watch('graph', function(graph, graphold) {
      $scope.graph = $rootScope.graph;

      $rootScope.nodeLabels = [];
      if($scope.graph != undefined){
        $scope.graph.nodes.forEach(function(node){
          $rootScope.nodeLabels.push(node.label)
        });
        $scope.nodeLabels = $scope.nodeLabels.sort();
      }
      $scope.nodeLabels = $rootScope.nodeLabels;
    }, true);


    $rootScope.$watch('dataInfo', function(dataInfo) {
      $scope.dataInfo = $rootScope.dataInfo;
      console.log("controller datainfo changed" + $scope.dataInfo);
    });

    $rootScope.$watch('info', function(info) {
      $scope.info = $rootScope.info;
      console.log("controller info changed" + $scope.info);
    });

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
