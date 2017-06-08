'use strict';

var contactEndpointModule = angular.module('contactEndpointModule');

contactEndpointModule.controller('contactEndpointCtrl',
  function($scope, $rootScope, ContactSPARQLendpoint, queryDatasetService, GetJSONfileService) {

    $scope.selectedEndpoint = "";
    $scope.endpointList = ["http://dbpedia.org/sparql", 
                           "http://localhost:3030/spacin/query", 
                           "http://localhost:3030/semanticlancet/query",
                           "http://two.eelst.cs.unibo.it:8181/data/query"]

    $scope.selectedGraph = "";
    $scope.graphList = ["http://dbpedia.org", "default"];

    $scope.classes = [];
    $scope.selectedClass = {};

    $scope.classObjectProperties = [];
    $scope.selectedClassObjectProperties = [];

    $scope.classDatatypeProperties = [];
    $scope.selectedClassDatatypeProperties = [];

    var obj = [];

    $scope.objObjectProperties = [];
    $scope.selectedObjObjectProperties = [];

    $scope.objDatatypeProperties = [];
    $scope.selectedObjDatatypeProperties = [];

    //per risolvere problemi di performance di ng-repeat nei menu dropdown
    $scope.totalDisplayed = 100;

    $scope.loadMore = function () {
      $scope.totalDisplayed += 50;
    };

    $scope.selectEndpoint = function (endpoint) {
       $scope.selectedEndpoint = endpoint;
    };

    $scope.selectGraph = function (graph) {
       $scope.selectedGraph = graph;
    };

    // from uri to prefix
    // Per esempio:
    // from http://purl.org/spar/cito/CitationAct
    // to cito:CitationAct
    $scope.convertUriToPrefix = function(uri){
      var prefix;
      var promise = ContactSPARQLendpoint.convertUriToPrefix(uri);
      promise.then(function(response) {
        prefix = $(response.data).find('h1').text();
        console.log(prefix);
      });
      return prefix;
    };

    // clear selected graph and endpoint
    $scope.restoreToDefault = function(){
      $('#endpointandgraph .ui.dropdown').dropdown('restore placeholder text');
      $scope.selectedEndpoint = "";
      $scope.selectedGraph = "";
      
      $(".success.message").addClass("hidden");
      $(".negative.message").addClass("hidden");
    };

    // ask for endpoint
    $scope.contactSelectedEndpoint = function () {
      $(".success.message").addClass("hidden");
      $(".negative.message").addClass("hidden");
      ContactSPARQLendpoint.contactSelectedEndpoint($scope.selectedEndpoint, $scope.selectedGraph)
        .success(function(data, status, headers, config){
          $scope.contacted = $scope.selectedEndpoint + " reached";
        })
        .error(function(data, status, headers, config){
          $scope.contacted = $scope.selectedEndpoint + " unreachable";
        });
      $scope.queryDatasetClass();
    };

    // classi del dataset
    $scope.queryDatasetClass = function(){
      var promise = queryDatasetService.queryDatasetClass($scope.selectedEndpoint, $scope.selectedGraph);
      promise.then(function(response) {
        for(var i=0; i<response.data.results.bindings.length; i++){
          // La label della classe potrebbe non esserci, classLabel nella query è OPZIONALE
          // Alla fine si è scelto di non chiedere la label della classe nella query, 
          // ma si sceglie il rdf:type, e per la label si fa richiesta a prefix.cc

          var uri = response.data.results.bindings[i].classUri.value;
          
          $scope.classes.push({
            uri: uri,
            label: uri
          });

          //var label = $scope.convertUriToPrefix(uri);
          
          /*
          var label;
          var promise = ContactSPARQLendpoint.convertUriToPrefix(uri);
          promise.then(function(response) {
            label = $(response.data).find('h1').text();
            $scope.classes.push({
              uri: uri,
              label: label
            });
          });*/

          /*
          if(response.data.results.bindings[i].classLabel != undefined){
            label= response.data.results.bindings[i].classLabel.value
          } else {  
            label= response.data.results.bindings[i].classUri.value
          }
          */
        };
      });
    }

    // object properties della classe selezionata
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

    // datatype (=literal) properties della classe selezionata
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

    // object properties della object properties della classe selezionata 
    /*
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
    */

    // datatype properties della object properties della classe selezionata
    /*
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
    */

    // datatype properties della object properties della classe selezionata
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

    // object properties della object properties della classe selezionata
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

    // 
    $scope.selectClass = function(selectedClass){
      //nuova classe corrente
      $scope.selectedClass = selectedClass;

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
    }

    $scope.selectClassObjectProperty = function(selectedClassProperty){
      //aggiornate proprietà selezionate (aggiunte) della classe corrente
      $scope.selectedClassObjectProperties.push(selectedClassProperty);
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

    $scope.queryEndpointClassProperties = function(){
      $rootScope.dataInfo = {};
      $rootScope.dataInfo.classe = {
        uri : $scope.selectedClass.uri,
        label : $scope.selectedClass.label,
      }
      $scope.dataInfo.litPropClasse = [];
      $scope.dataInfo.objPropClasse = {};
  
      if($scope.selectedClassDatatypeProperties.length != 0){

        var promise = queryDatasetService.queryEndpointForLiteral($scope.selectedEndpoint, $scope.selectedGraph, $scope.selectedClass.uri, $scope.selectedClassDatatypeProperties);
        promise.then(function(response) {
          // nodi, literalNode e linkstoliterals della classe scelta
          var graph = GetJSONfileService.createNodeLiteral(response.data.results.bindings, "soggPropUri0");
          $rootScope.graph=graph;
        });

        $scope.selectedClassDatatypeProperties.forEach(function(prop){
          $rootScope.dataInfo.litPropClasse.push(prop);
        });
      };

   
      if($scope.selectedClassObjectProperties.length != 0){
        var promise = queryDatasetService.queryEndpointForObject($scope.selectedEndpoint, $scope.selectedGraph, $scope.selectedClass.uri, $scope.selectedClassObjectProperties);
        promise.then(function(response) {

          response.data.results.bindings.forEach(function(ob){
            obj.push(ob.oo.value);
          });
          $scope.queryDatasetValuesObjObjectProperty(obj);
          $scope.queryDatasetValuesObjDatatypeProperty(obj);

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
            $rootScope.dataInfo.objPropClasse =  {
              uri: prop.uri,
              label : prop.label,
              type : 'obj'}
          });
        });
      }
    }

    $scope.queryEndpoint = function(){
      
      //$rootScope.$digest(); // $apply è già in corso, quindi non si può usare $digest
      if($scope.selectedObjDatatypeProperties.length != 0){

        var promise = queryDatasetService.queryEndpointForObjLiteralVAL($scope.selectedEndpoint,
                                                                  $scope.selectedGraph,
                                                                  $scope.selectedClassObjectProperties[0].uri,
                                                                  $scope.selectedObjDatatypeProperties, obj);
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
        var promise = queryDatasetService.queryEndpointForObjObjectVAL($scope.selectedEndpoint,
                                                                 $scope.selectedGraph,
                                                                 $scope.selectedClassObjectProperties[0].uri,
                                                                 $scope.selectedObjObjectProperties, obj);
        promise.then(function(response) {
          // nodi, nodi e linkstoliterals della classe scelta
          var graph = GetJSONfileService.createNodeObject(response.data.results.bindings);
          graph.links.forEach(function(l){
            $rootScope.graph.links.push(l);
          });
        });
      }
    }

    $scope.clearQueryParam = function(){
      $scope.selectedClass = {};

      $('#datasetInfoRichieste .ui.dropdown').dropdown('restore placeholder text');

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
