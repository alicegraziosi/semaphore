'use strict';

var contactEndpointModule = angular.module('contactEndpointModule');

contactEndpointModule.controller('contactEndpointCtrl',
  function($scope, $rootScope, ContactSPARQLendpoint, queryDatasetService, GetJSONfileService) {

    $scope.selectedEndpoint = "http://dbpedia.org/sparql";
    $scope.selectedGraph = "http://dbpedia.org";

    $scope.classes = [];
    $scope.selectedClass = {};

    $scope.classObjectProperties = [];
    $scope.selectedClassObjectProperties = [];

    $scope.classDatatypeProperties = [];
    $scope.selectedClassDatatypeProperties = [];

    $scope.objObjectProperties = [];
    $scope.selectedObjObjectProperties = [];

    $scope.objDatatypeProperties = [];
    $scope.selectedObjDatatypeProperties = [];

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
      var promise = queryDatasetService.queryDatasetClassObjectProperty($scope.selectedEndpoint, $scope.selectedGraph, $scope.selectedClass.uri);
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
      var promise = queryDatasetService.queryDatasetClassDatatypeProperty($scope.selectedEndpoint, $scope.selectedGraph, $scope.selectedClass.uri);
      promise.then(function(response) {
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.classDatatypeProperties.push({
            uri: response.data.results.bindings[i].propertyUri.value,
            label: response.data.results.bindings[i].propertyLabel.value
          });
        };
      });
    }

    $scope.queryDatasetObjDatatypeProperty = function(objClass){
      var promise = queryDatasetService.queryDatasetClassDatatypeProperty($scope.selectedEndpoint, $scope.selectedGraph, objClass);
      promise.then(function(response) {
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.objDatatypeProperties.push({
            uri: response.data.results.bindings[i].propertyUri.value,
            label: response.data.results.bindings[i].propertyLabel.value
          });
        };
      });
    }

    $scope.queryDatasetObjObjectProperty = function(objClass){
      var promise = queryDatasetService.queryDatasetClassObjectProperty($scope.selectedEndpoint, $scope.selectedGraph, objClass);
      promise.then(function(response) {
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.objObjectProperties.push({
            uri: response.data.results.bindings[i].propertyUri.value,
            label: response.data.results.bindings[i].propertyLabel.value
          });
        };
      });
    }

    $scope.queryDatasetValuesObjDatatypeProperty = function(obj){
      var promise = queryDatasetService.queryDatasetValuesObjDatatypeProperty($scope.selectedEndpoint, $scope.selectedGraph, obj);
      promise.then(function(response) {
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.objDatatypeProperties.push({
            uri: response.data.results.bindings[i].propertyUri.value,
            label: response.data.results.bindings[i].propertyLabel.value
          });
        };
      });
    }

    $scope.queryDatasetValuesObjObjectProperty = function(obj){
      var promise = queryDatasetService.queryDatasetValuesObjObjectProperty($scope.selectedEndpoint, $scope.selectedGraph, obj);
      promise.then(function(response) {
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.objObjectProperties.push({
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

    $scope.selectClassDatatypeProperty = function(selectedClassProperty){
      //aggiornate proprietà selezionate (aggiunte) della classe corrente
      $scope.selectedClassDatatypeProperties.push(selectedClassProperty);
      console.log($scope.selectedClassDatatypeProperties);
    }

    $scope.selectClassObjectProperty = function(selectedClassProperty){
      //aggiornate proprietà selezionate (aggiunte) della classe corrente
      $scope.selectedClassObjectProperties.push(selectedClassProperty);
      console.log($scope.selectedClassObjectProperties);

      /*
      var promise = queryDatasetService.queryDatasetObjectPropertyRange($scope.selectedEndpoint, $scope.selectedGraph, selectedClassProperty.uri);
      promise.then(function(response) {
        var rangeClass = response.data.results.bindings[0].rangeClass.value;
        console.log("rangeClass" + rangeClass);
        $scope.queryDatasetObjDatatypeProperty(rangeClass);
        $scope.queryDatasetObjObjectProperty(rangeClass);
      });*/

      //  obj.push(response.data.results.bindings[i].oo.value);

      var promise = queryDatasetService.queryEndpointForObject($scope.selectedEndpoint, $scope.selectedGraph, $scope.selectedClass.uri, $scope.selectedClassObjectProperties);
      promise.then(function(response) {
        $scope.queryDatasetValuesObjObjectProperty(obj)
        $scope.queryDatasetValuesObjDatatypeProperty(obj)
      });
    }

    $scope.selectObjDatatypeProperty = function(selectedClassProperty){
      $scope.selectedObjDatatypeProperties.push(selectedClassProperty);
    }

    $scope.selectObjObjectProperty = function(selectedClassProperty){
      $scope.selectedObjObjectProperties.push(selectedClassProperty);
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
      $rootScope.dataInfo.headClass = {
        uri : $scope.selectedClass.uri,
        label : $scope.selectedClass.label,
      }
      $scope.dataInfo.litPropHeadClass.splice(0, $scope.dataInfo.litPropHeadClass.length);
      $scope.dataInfo.objPropHeadClass.splice(0, $scope.dataInfo.objPropHeadClass.length);

      if($scope.selectedClassDatatypeProperties.length != 0){

        var promise = queryDatasetService.queryEndpointForLiteral($scope.selectedEndpoint, $scope.selectedGraph, $scope.selectedClass.uri, $scope.selectedClassDatatypeProperties);
        promise.then(function(response) {
          // nodi, literalNode e linkstoliterals della classe scelta
          var graph = GetJSONfileService.createNodeLiteral(response.data.results.bindings, "soggPropUri0");
          $rootScope.graph=graph;
        });

        $scope.selectedClassDatatypeProperties.forEach(function(prop){
          $rootScope.dataInfo.litPropHeadClass.push(prop);
        });
      };

      if($scope.selectedClassObjectProperties.length != 0){
        var promise = queryDatasetService.queryEndpointForObject($scope.selectedEndpoint, $scope.selectedGraph, $scope.selectedClass.uri, $scope.selectedClassObjectProperties);
        promise.then(function(response) {
          // nodi, nodi e linkstoliterals della classe scelta
          var graph = GetJSONfileService.createNodeObject(response.data.results.bindings);
          graph.nodes.forEach(function(node){
            $rootScope.graph.nodes.push(node);
          });
          graph.links.forEach(function(l){
            $rootScope.graph.links.push(l);
          });

          //
          $scope.selectedClassObjectProperties.forEach(function(prop){
            $rootScope.dataInfo.objPropHeadClass.push(prop);
          });
        });
      }
      //$rootScope.$digest(); // $apply è già in corso, quindi non si può usare $digest
      if($scope.selectedObjDatatypeProperties.length != 0){

        var promise = queryDatasetService.queryEndpointForObjLiteral($scope.selectedEndpoint,
                                                                  $scope.selectedGraph,
                                                                  $scope.selectedClassObjectProperties[0].uri,
                                                                  $scope.selectedObjDatatypeProperties);
        promise.then(function(response) {
          // nodi, literalNode e linkstoliterals della classe scelta
          var graph = GetJSONfileService.createNodeLiteral(response.data.results.bindings, "oggPropUri0");
          graph.nodeLiteral.forEach(function(node){
            $rootScope.graph.nodeLiteral.push(node);
          });
          graph.linksToLiterals.forEach(function(l){
            $rootScope.graph.linksToLiterals.push(l);
          });

        });
      };

      if($scope.selectedObjObjectProperties.length != 0){
        var promise = queryDatasetService.queryEndpointForObjObject($scope.selectedEndpoint,
                                                                 $scope.selectedGraph,
                                                                 $scope.selectedClassObjectProperties[0].uri,
                                                                 $scope.selectedObjObjectProperties);
        promise.then(function(response) {
          // nodi, nodi e linkstoliterals della classe scelta
          var graph = GetJSONfileService.createNodeObject(response.data.results.bindings);

          graph.nodes.forEach(function(node){
            if (_.findWhere($rootScope.graph.nodes, node) == null) {
              $rootScope.graph.nodes.push(node);
            }

          });
          graph.links.forEach(function(l){
            $rootScope.graph.links.push(l);
          });
        });
      }
    }

    $scope.clearQueryParam = function(){
      $scope.selectedClass = {};

      $scope.classObjectProperties = [];
      $scope.selectedClassObjectProperties = [];

      $scope.classDatatypeProperties = [];
      $scope.selectedClassDatatypeProperties = [];

      $scope.objObjectProperties = [];
      $scope.selectedObjObjectProperties = [];

      $scope.objDatatypeProperties = [];
      $scope.selectedObjDatatypeProperties = [];
    }
});
