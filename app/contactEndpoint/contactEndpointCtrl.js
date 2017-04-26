'use strict';

var contactEndpointModule = angular.module('contactEndpointModule');

contactEndpointModule.controller('contactEndpointCtrl',
  function($scope, $rootScope, ContactSPARQLendpoint, queryDatasetService, GetJSONfileService) {

    $scope.selectedEndpoint = "http://dbpedia.org/sparql";
    $scope.selectedGraph = "http://dbpedia.org";

    $scope.classes = [];
    $scope.selectedClass = "";

    $scope.classObjectProperties = [];
    $scope.selectedClassObjectProperties = [];

    $scope.classDatatypeProperties = [];
    $scope.selectedClassDatatypeProperties = [];

    //per risolvere proplemi di performance di ng-repeat delle classi
    $scope.totalDisplayed = 100;

    $scope.loadMore = function () {
      $scope.totalDisplayed += 200;
    };

    $scope.contactSelectedEndpoint = function () {
      ContactSPARQLendpoint.contactSelectedEndpoint($scope.selectedEndpoint, $scope.selectedGraph)
        .success(function(data, status, headers, config){
          $scope.contacted = $scope.selectedEndpoint + " reached";
        })
        .error(function(data, status, headers, config){
          $scope.contacted = $scope.selectedEndpoint + " unreachable";
        });
      $scope.queryDatasetClass();
    };

    $scope.queryDatasetClass = function(){
      var promise = queryDatasetService.queryDatasetClass($scope.selectedEndpoint, $scope.selectedGraph);
      promise.then(function(response) {
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.classes.push({
            uri: response.data.results.bindings[i].classUri.value,
            label: response.data.results.bindings[i].classLabel.value
          });
        };
      });
    }

    $scope.queryDatasetClassObjectProperty = function(){
      var promise = queryDatasetService.queryDatasetClassObjectProperty($scope.selectedEndpoint, $scope.selectedGraph, $scope.selectedClass);
      promise.then(function(response) {
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.classObjectProperties.push({
            uri: response.data.results.bindings[i].propertyUri.value,
            label: response.data.results.bindings[i].propertyLabel.value
          });
        };
      });
    }

    $scope.queryDatasetClassDatatypeProperty = function(){
      var promise = queryDatasetService.queryDatasetClassDatatypeProperty($scope.selectedEndpoint, $scope.selectedGraph, $scope.selectedClass);
      promise.then(function(response) {
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.classDatatypeProperties.push({
            uri: response.data.results.bindings[i].propertyUri.value,
            label: response.data.results.bindings[i].propertyLabel.value
          });
        };
      });
    }

    //quando si seleziona una classe
    $scope.selectClass = function(selectedClass){
      //nuova classe corrente
      $scope.selectedClass = selectedClass;
      console.log($scope.selectedClass);
      //eliminate le proprietà della classe precedente
      $scope.classObjectProperties.splice(0, $scope.classObjectProperties.length);
      $scope.classDatatypeProperties.splice(0, $scope.classDatatypeProperties.length);
      //vuotato l'array delle proprietà selezionate della classe corrente
      $scope.selectedClassObjectProperties.splice(0, $scope.selectedClassObjectProperties.length);
      $scope.selectedClassDatatypeProperties.splice(0, $scope.selectedClassDatatypeProperties.length);
      $('.ui.label.transition.visible').remove();
      //ricerca delle proprietà della nuova classe corrente
      $scope.queryDatasetClassObjectProperty();
      $scope.queryDatasetClassDatatypeProperty();
    }

    $scope.selectClassObjectProperty = function(selectedClassProperty){
      //aggiornate proprietà selezionate (aggiunte) della classe corrente
      $scope.selectedClassObjectProperties.push(selectedClassProperty);
      console.log($scope.selectedClassObjectProperties);
    }

    $scope.selectClassDatatypeProperty = function(selectedClassProperty){
      //aggiornate proprietà selezionate (aggiunte) della classe corrente
      $scope.selectedClassDatatypeProperties.push(selectedClassProperty);
      console.log($scope.selectedClassDatatypeProperties);
    }

    $scope.dropdown = function(){
      $('.ui.dropdown').dropdown();

      //aggiornate proprietà selezionate (eliminate) della classe corrente
      $('.ui.dropdown .delete.icon').on('click', function(index){
        var index = $scope.selectedClassObjectProperties.indexOf(index);
        $scope.selectedClassObjectProperties.splice(index, 1);
      });
      console.log($scope.selectedClassObjectProperties);
    }

    $scope.queryEndpoint = function(){
      console.log("*****************queryEndpoint*****************");
      console.log("Classe: " + $scope.selectedClass);
      $rootScope.graph = {
        nodes : [],
        linksToLiterals : [],
        nodeLiteral : [],
        links : []
      }
      console.log("data prop: " + $scope.selectedClassDatatypeProperties);
      if($scope.selectedClassDatatypeProperties.length != 0){
        var promise = queryDatasetService.queryEndpointForLiteral($scope.selectedEndpoint, $scope.selectedGraph, $scope.selectedClass, $scope.selectedClassDatatypeProperties);
        promise.then(function(response) {
          // nodi, literalNode e linkstoliterals della classe scelta
          var graph = GetJSONfileService.createNodeLiteral(response.data.results.bindings);
          graph.nodes.forEach(function(node){
            $rootScope.graph.nodes.push(node);
          });
          graph.linksToLiterals.forEach(function(ltl){
            $rootScope.graph.linksToLiterals.push(ltl);
          });
          graph.nodeLiteral.forEach(function(nl){
            $rootScope.graph.nodeLiteral.push(nl);
          });
          console.log($rootScope.graph);
        });
      };

      console.log("obj prop: " + $scope.selectedClassObjectProperties);
      if($scope.selectedClassObjectProperties.length != 0){
        var promise = queryDatasetService.queryEndpointForObject($scope.selectedEndpoint, $scope.selectedGraph, $scope.selectedClass, $scope.selectedClassObjectProperties);
        promise.then(function(response) {
          // nodi, nodi e linkstoliterals della classe scelta
          var graph = GetJSONfileService.createNodeObject(response.data.results.bindings);
          graph.nodes.forEach(function(node){
            $rootScope.graph.nodes.push(node);
          });
          graph.links.forEach(function(l){
            $rootScope.graph.links.push(l);
          });
          console.log($rootScope.graph);
        });
      }

    }
});
