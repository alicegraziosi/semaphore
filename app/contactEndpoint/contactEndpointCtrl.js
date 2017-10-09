'use strict';

var contactEndpointModule = angular.module('contactEndpointModule');

contactEndpointModule.controller('contactEndpointCtrl',
  function($http, $scope, $rootScope, ContactSPARQLendpoint, queryDatasetService, GetJSONfileService) {

    $scope.datasetsAndGraphs = []; // dati dal file datasetsAndGraphs.json
    $scope.endpointList = [];
    $scope.graphList = [];
    
    $scope.selectedEndpointUrl = "";
    $scope.selectedEndpointName = "";
    $scope.selectedGraph = "";

    $rootScope.selectedEndpointUrl = "";
    $rootScope.selectedEndpointName = "";
    $rootScope.selectedGraph = "";

    $scope.successMessageToAppear = false;
    $scope.negativeMessageToAppear = false;
    $scope.attentionMessageToAppear = false;
    $scope.fetchingMessageToAppear = false;

    // numeri per label info da cui si può selezionare
    $rootScope.numClasses = 0;
    $rootScope.numClassObjectProperties = 0;
    $rootScope.numClassDatatypeProperties = 0;
    $rootScope.numObjObjectProperties = 0;
    $rootScope.numObjDatatypeProperties = 0;

    $scope.dismissMessage = function(){
      $('.message').transition('fade');
    };

    // clear selected graph and endpoint
    $scope.restoreToDefault = function(){
      $('#endpointandgraph .ui.dropdown').dropdown('restore placeholder text');
        $scope.selectedEndpointUrl = "";
        $scope.selectedEndpointName = "";
        $scope.selectedGraph = "";

        $rootScope.selectedEndpointUrl = "";
        $rootScope.selectedEndpointName = "";
        $rootScope.selectedGraph = "";

        $scope.successMessageToAppear = false;
        $scope.negativeMessageToAppear = false;
        $scope.attentionMessageToAppear = false;
        $scope.fetchingMessageToAppear = false;

        $rootScope.numClasses = 0;
        $rootScope.numClassObjectProperties = 0;
        $rootScope.numClassDatatypeProperties = 0;
        $rootScope.numObjObjectProperties = 0;
        $rootScope.numObjDatatypeProperties = 0;

        $scope.selectClass = "";
        $scope.selectedClassObjectProperties = [];
        $scope.selectedClassDatatypeProperties = [];
        $scope.selectedObjDatatypeProperties = [];
        $scope.selectedObjDatatypeProperties = [];

        $scope.classes = [];
        $scope.classDatatypeProperties = []; 
        $scope.classObjectProperties = [];
        $scope.objDatatypeProperties = [];
        $scope.objObjectProperties = [];

    };

    $scope.restoreToDefault();

    $http.get('../datasetsAndGraphs.json').then(function (response) {
      $scope.datasetsAndGraphs = response.data;
      $scope.datasetsAndGraphs.forEach(function(endpoint){
        $scope.endpointList.push({'url': endpoint.endpointUrl, 'name': endpoint.endpointName});
      });
      $rootScope.datasetsAndGraphs = $scope.datasetsAndGraphs;
    });

    $rootScope.prefixes = [];
    $http.get('../prefixes.json').then(function (response) {
      $rootScope.prefixes = response.data;
    });

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

    //per risolvere problemi di performance di ng-repeat nei menu dropdown
    $scope.totalDisplayed = 100;

    $scope.loadMore = function () {
      $scope.totalDisplayed += 50;
    };

    $scope.selectEndpoint = function (endpoint) {

      $scope.successMessageToAppear = false;
      $scope.negativeMessageToAppear = false;
      $scope.attentionMessageToAppear = false;
      $scope.fetchingMessageToAppear = false;

      $scope.selectedEndpointUrl = endpoint.url;
      $scope.selectedEndpointName = endpoint.name;
      $scope.selectedGraph = "";

      $scope.datasetsAndGraphs.forEach(function(endpoint){
        if(endpoint.endpointUrl === $scope.selectedEndpointUrl){
          $scope.graphList = endpoint.graphs;
        }
      });

      $rootScope.numClasses = 0;
      $rootScope.numClassObjectProperties = 0;
      $rootScope.numClassDatatypeProperties = 0;
      $rootScope.numObjObjectProperties = 0;
      $rootScope.numObjDatatypeProperties = 0;

    };

    $scope.selectGraph = function (graph) {
       $scope.selectedGraph = graph;
    };

    // ask for endpoint
    $scope.contactSelectedEndpoint = function () {
      if ($scope.selectedEndpointUrl != "" && $scope.selectedGraph != "") {
        ContactSPARQLendpoint.contactSelectedEndpoint($scope.selectedEndpointUrl, $scope.selectedGraph)
          .success(function(data, status, headers, config){
            $scope.contacted = $rootScope.selectedEndpointUrl + " reached";

                $scope.successMessageToAppear = true;
                $scope.queryDatasetClass();
                $('#datasetInfoRichieste').addClass("active");
          })
          .error(function(data, status, headers, config){
            $scope.contacted = $rootScope.selectedEndpointUrl + " unreachable";

                $scope.negativeMessageToAppear = true;
          });
        } else {
          $scope.attentionMessageToAppear = true;
        }

      $rootScope.numClasses = 0;
      $rootScope.numClassObjectProperties = 0;
      $rootScope.numClassDatatypeProperties = 0;
      $rootScope.numObjObjectProperties = 0;
      $rootScope.numObjDatatypeProperties = 0;

      $scope.classes.splice(0, $scope.classObjectProperties.length);
      $scope.classObjectProperties.splice(0, $scope.classObjectProperties.length);
      $scope.classDatatypeProperties.splice(0, $scope.classDatatypeProperties.length);

      //vuotato l'array delle proprietà selezionate della classe corrente
      $scope.selectedClassObjectProperties.splice(0, $scope.selectedClassObjectProperties.length);
      $scope.selectedClassDatatypeProperties.splice(0, $scope.selectedClassDatatypeProperties.length);
    };

 

    $scope.convertUriToPrefixProxy = function(classUri, uriToFind, name){  // uri="http://xmlns.com/foaf/0.1/"
      var promise = ContactSPARQLendpoint.convertUriToPrefixProxy(uriToFind);
      promise.then(function(data) {
        var prefix = Object.keys(data)[0];
        var url = Object.values(data)[0];
        var prefixUrl = {
          'prefix' : prefix,
          'url' : url
        };
        console.log(prefixUrl);
        if (_.findWhere($rootScope.prefixes, prefixUrl) == null) {
            $rootScope.prefixes.push(prefixUrl);
        };
        $scope.classes.push({
            uri: classUri,
            label: prefix + ":" + name
          });
        $rootScope.numClasses++;
      }, function (error) {
          console.error(error);
      });

    };

    // classi del dataset
    $scope.queryDatasetClass = function(){
      $scope.fetchingMessageToAppear = true;

      var promise = queryDatasetService.queryDatasetClass($scope.selectedEndpointUrl, $scope.selectedGraph);
      
      promise.then(function(response) {

        $rootScope.selectedEndpointUrl = $scope.selectedEndpointUrl;
        $rootScope.selectedEndpointName = $scope.selectedEndpointName;
        $rootScope.selectedGraph = $scope.selectedGraph;
      

        $rootScope.numClasses = 0;
        if(response.data.results.bindings.length == 0){
          $scope.fetchingMessageToAppear = false;
        }

        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.fetchingMessageToAppear = false;

          // La label della classe potrebbe non esserci, classLabel nella query è OPZIONALE
          // Alla fine si è scelto di non chiedere la label della classe nella query,
          // ma si sceglie il rdf:type, e per la label si fa richiesta a prefix.cc

          var classUri = response.data.results.bindings[i].classUri.value;
          var lastSlash = classUri.lastIndexOf('/');
          var lastHash = classUri.lastIndexOf('#');
          var name = ""; // nome classe
          var label = ""; //prefix:name
          var uriToFind = "";
          if(lastHash>lastSlash){
            name = classUri.substring(lastHash+1, classUri.length);
            uriToFind = classUri.substring(0, lastHash+1);
          } else {
            name = classUri.substring(lastSlash+1, classUri.length);
            uriToFind = classUri.substring(0, lastSlash+1);
          }

          // cerco uriToFind in $scope.prefixes
          var found = false;
          for(var k = 0; k < $rootScope.prefixes.length; k++) {
              if ($rootScope.prefixes[k].url == uriToFind) {
                  found = true;
                  label = $rootScope.prefixes[k].prefix + ":" + name;
                  $scope.classes.push({
                    uri: classUri,
                    label: label
                  });
                  break;
              }
              
          }

          // se non c'è, richiedo il prefisso
          if(!found) {
            $scope.convertUriToPrefixProxy(classUri, uriToFind, name);
          } else {
            $rootScope.numClasses++;
          }
        };
      });
    }

    // object properties della classe selezionata
    $scope.queryDatasetClassObjectProperty = function(){
      var promise = queryDatasetService.queryDatasetClassObjectProperty($rootScope.selectedEndpointUrl, $rootScope.selectedGraph, $scope.selectedClass.uri);
      promise.then(function(response) {

        console.log("num: " + response.data.results.bindings.length);
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.classObjectProperties.push({
            uri: response.data.results.bindings[i].propertyUri.value,
            label: response.data.results.bindings[i].propertyLabel.value
          });
          $rootScope.numClassObjectProperties++;
        };
      });
    }

    // datatype (=literal) properties della classe selezionata
    $scope.queryDatasetClassDatatypeProperty = function(){
      var promise = queryDatasetService.queryDatasetClassDatatypeProperty($rootScope.selectedEndpointUrl, $rootScope.selectedGraph, $scope.selectedClass.uri);
      promise.then(function(response) {

        
        console.log("num: " + response.data.results.bindings.length);
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.classDatatypeProperties.push({
            uri: response.data.results.bindings[i].propertyUri.value,
            label: response.data.results.bindings[i].propertyLabel.value
          });
          $rootScope.numClassDatatypeProperties++;
        };
      });
    }

    // object properties della object properties della classe selezionata
    /*
    $scope.queryDatasetObjDatatypeProperty = function(objClass){
      var promise = queryDatasetService.queryDatasetClassDatatypeProperty($rootScope.selectedEndpointUrl, $rootScope.selectedGraph, objClass);
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
      var promise = queryDatasetService.queryDatasetClassObjectProperty($rootScope.selectedEndpointUrl, $rootScope.selectedGraph, objClass);
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
      var promise = queryDatasetService.queryDatasetValuesObjDatatypeProperty($rootScope.selectedEndpointUrl, $rootScope.selectedGraph, obj);
      promise.then(function(response) {
        console.log("num: " + response.data.results.bindings.length);
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.objDatatypeProperties.push({
            uri: response.data.results.bindings[i].propertyUri.value,
            label: response.data.results.bindings[i].propertyLabel.value
          });
          $rootScope.numObjDatatypeProperties++;
        };
      });
    }

    // object properties della object properties della classe selezionata
    $scope.queryDatasetValuesObjObjectProperty = function(obj){
      var promise = queryDatasetService.queryDatasetValuesObjObjectProperty($rootScope.selectedEndpointUrl, $rootScope.selectedGraph, obj);
      promise.then(function(response) {
        console.log("num: " + response.data.results.bindings.length);
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.objObjectProperties.push({
            uri: response.data.results.bindings[i].propertyUri.value,
            label: response.data.results.bindings[i].propertyLabel.value
          });
          $rootScope.numObjObjectProperties++;
        };
      });
    }

    //
    $scope.selectClass = function(selectedClass){

      $rootScope.numClassObjectProperties = 0;
      $rootScope.numClassDatatypeProperties = 0;
      $rootScope.numObjObjectProperties = 0;
      $rootScope.numObjDatatypeProperties = 0;

      //nuova classe corrente
      $scope.selectedClass = selectedClass;

      // se lo elimino poi non partono le query

      //eliminate le proprietà della classe precedente
      $scope.classObjectProperties.splice(0, $scope.classObjectProperties.length);
      $scope.classDatatypeProperties.splice(0, $scope.classDatatypeProperties.length);

      //vuotato l'array delle proprietà selezionate della classe corrente
      $scope.selectedClassObjectProperties.splice(0, $scope.selectedClassObjectProperties.length);
      $scope.selectedClassDatatypeProperties.splice(0, $scope.selectedClassDatatypeProperties.length);

      //ricerca delle proprietà della nuova classe corrente
      $scope.queryDatasetClassObjectProperty();
      $scope.queryDatasetClassDatatypeProperty();
    };

    $scope.selectClassDatatypeProperty = function(selectedClassProperty){
      //aggiornate proprietà selezionate (aggiunte) della classe corrente
      $scope.selectedClassDatatypeProperties.push(selectedClassProperty);
    }

    $scope.selectClassObjectProperty = function(selectedClassProperty){
      //aggiornate proprietà selezionate (aggiunte) della classe corrente
      $scope.selectedClassObjectProperties.push(selectedClassProperty);
    }

    $scope.selectObjDatatypeProperty = function(selectedClassProperty){
      $scope.selectedObjDatatypeProperties.splice(0, $scope.selectedObjDatatypeProperties);
      $scope.selectedObjDatatypeProperties.push(selectedClassProperty);
    }

    $scope.selectObjObjectProperty = function(selectedClassProperty){
      $scope.selectedObjObjectProperties.splice(0, $scope.selectedObjObjectProperties);
      $scope.selectedObjObjectProperties.push(selectedClassProperty);
    }

    $scope.dropdown = function(){
      $('.ui.dropdown').dropdown();

      //aggiornate proprietà selezionate (eliminate) della classe corrente
      $('.ui.dropdown .delete.icon').on('click', function(index){
        var index = $scope.selectedClassObjectProperties.indexOf(index);
        $scope.selectedClassObjectProperties.splice(index, 1);
      });
    }

    $scope.queryEndpointClassProperties = function(){
      $rootScope.dataInfo = {};
      $rootScope.dataInfo.classe = {
        uri : $scope.selectedClass.uri,
        label : $scope.selectedClass.label,
        type : "obj",
        group: 1,
        color : '#f53453'
      }
      $rootScope.dataInfo.litPropClasse = [];
      $rootScope.dataInfo.objPropClasse = {};

      if($scope.selectedClassDatatypeProperties.length != 0){

        var promise = queryDatasetService.queryEndpointForLiteral($rootScope.selectedEndpointUrl, $rootScope.selectedGraph, $scope.selectedClass.uri, $scope.selectedClassDatatypeProperties);
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
        var promise = queryDatasetService.queryEndpointForObject($rootScope.selectedEndpointUrl, $rootScope.selectedGraph, $scope.selectedClass.uri, $scope.selectedClassObjectProperties);
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

          $scope.selectedClassObjectProperties.forEach(function(prop){
            $rootScope.dataInfo.objPropClasse =  {
              uri: prop.uri,
              label : prop.label,
              type : 'obj',
              group: 5,
              color : '#f53453'
            }
          });
        });
      }
    }

    $scope.queryEndpoint = function(){

      //$rootScope.$digest(); // $apply è già in corso, quindi non si può usare $digest
      if($scope.selectedObjDatatypeProperties.length != 0){

        var promise = queryDatasetService.queryEndpointForObjLiteralVAL($rootScope.selectedEndpointUrl,
                                                                  $rootScope.selectedGraph,
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
        var promise = queryDatasetService.queryEndpointForObjObjectVAL($rootScope.selectedEndpointUrl,
                                                                 $rootScope.selectedGraph,
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
