'use strict';

var contactEndpointModule = angular.module('contactEndpointModule');

contactEndpointModule.controller('contactEndpointCtrl',
  function($http, $scope, $rootScope, ContactSPARQLendpoint, queryDatasetService, GetJSONfileService) {

    $scope.datasetsAndGraphs = []; // dati dal file datasetsAndGraphs.json
    $scope.endpointList = [];
    $scope.graphList = [];
    
    $scope.classeColor = '#1f77b4';
    $scope.litPropClasseColor = '#ff7f0e';
    $scope.objPropClasse = '#2ca02c';
    $scope.litPropObj = '#d62728';
    $scope.objPropObj = '#9467bd';

    $scope.selectedEndpointUrl = "https://dbpedia.org/sparql";
    $scope.selectedEndpointName = "DBpedia";
    $scope.selectedGraph = "http://dbpedia.org";

    $rootScope.selectedEndpointUrl = $scope.selectedEndpointUrl;
    $rootScope.selectedEndpointName = $scope.selectedEndpointName;
    $rootScope.selectedGraph = $scope.selectedGraph;

    $scope.successMessageToAppear = false;
    $scope.negativeMessageToAppear = false;
    $scope.attentionMessageToAppear = false;
    $scope.fetchingMessageToAppear = false;
    $scope.classDatatypePropertiesLoading = false;

    // numeri per label info da cui si può selezionare
    $rootScope.numClasses = 0;
    $rootScope.numClassObjectProperties = 0;
    $rootScope.numClassDatatypeProperties = 0;
    $rootScope.numObjObjectProperties = 0;
    $rootScope.numObjDatatypeProperties = 0;

    $scope.dismissMessage = function(){
      $('.message').transition('fade');
    };

    // clear ALL
    $scope.restoreToDefault = function(){
      //check
        $('#endpointandgraph .ui.dropdown').dropdown('restore placeholder text');

        $scope.selectedEndpointUrl = "https://dbpedia.org/sparql";
        $scope.selectedEndpointName = "DBpedia";
        $scope.selectedGraph = "http://dbpedia.org";


        $rootScope.selectedEndpointUrl = $scope.selectedEndpointUrl;
        $rootScope.selectedEndpointName = $scope.selectedEndpointName;
        $rootScope.selectedGraph = $scope.selectedGraph;

        $scope.successMessageToAppear = false;
        $scope.negativeMessageToAppear = false;
        $scope.attentionMessageToAppear = false;
        $scope.fetchingMessageToAppear = false;
        $scope.classDatatypePropertiesLoading = false;

        $rootScope.numClasses = 0;
        $rootScope.numClassObjectProperties = 0;
        $rootScope.numClassDatatypeProperties = 0;
        $rootScope.numObjObjectProperties = 0;
        $rootScope.numObjDatatypeProperties = 0;

        $scope.numClasses = 0;
        $scope.numClassObjectProperties = 0;
        $scope.numClassDatatypeProperties = 0;
        $scope.numObjObjectProperties = 0;
        $scope.numObjDatatypeProperties = 0;

        $scope.selectedClass = '';
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

    $http.get('../datasetsAndGraphs.json').then(function (response) {
      $scope.datasetsAndGraphs = response.data;
      $scope.datasetsAndGraphs.forEach(function(endpoint){
        $scope.endpointList.push({'url': endpoint.endpointUrl, 'name': endpoint.endpointName});
      });
      $rootScope.datasetsAndGraphs = $scope.datasetsAndGraphs;
      $scope.selected = $scope.endpointList[0];
    });

    $rootScope.$watch('datasetsAndGraphs', function(datasetsAndGraphs) {
      if(datasetsAndGraphs){
        $scope.endpointList = [];
        $scope.datasetsAndGraphs.forEach(function(endpoint){
          $scope.endpointList.push({'url': endpoint.endpointUrl, 'name': endpoint.endpointName});
        });
      }
    }, true);

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
    $scope.totalDisplayed = 150;

    $scope.loadMore = function () {
      $scope.totalDisplayed += 100;
    };

    $scope.selectEndpoint = function (endpoint) {

      $scope.successMessageToAppear = false;
      $scope.negativeMessageToAppear = false;
      $scope.attentionMessageToAppear = false;
      $scope.fetchingMessageToAppear = false;

      $scope.selectedEndpointUrl = endpoint.url;
      $scope.selectedEndpointName = endpoint.name;
      $scope.selectedGraph = "";
      console.log("$scope.selectedEndpointUrl " + $scope.selectedEndpointUrl + " " + $scope.selectedEndpointName); 

      $scope.datasetsAndGraphs.forEach(function(endpoint){
        if(endpoint.endpointUrl === $scope.selectedEndpointUrl){
          $scope.graphList = endpoint.graphs;
        }
      });

      $scope.numClasses = 0;
      $scope.numClassObjectProperties = 0;
      $scope.numClassDatatypeProperties = 0;
      $scope.numObjObjectProperties = 0;
      $scope.numObjDatatypeProperties = 0;
    };

    $scope.selectGraph = function (graph) {
       $scope.selectedGraph = graph;
    };

    // ask for endpoint
    $scope.contactSelectedEndpoint = function () {
      if ($scope.selectedEndpointUrl != "" && $scope.selectedGraph != "") {
        ContactSPARQLendpoint.contactSelectedEndpoint($scope.selectedEndpointUrl, $scope.selectedGraph)
          .success(function(data, status, headers, config){
            $scope.successMessageToAppear = true;
            $scope.queryDatasetClass();
            $('#datasetInfoRichieste').addClass("active");
          })
          .error(function(data, status, headers, config){
            $scope.negativeMessageToAppear = true;
          });
        } else {
          $scope.attentionMessageToAppear = true;
          console.log("endpoint: " + $scope.selectedEndpointUrl + "graph: " + $scope.selectedGraph);
        }

      $scope.numClasses = 0;
      $scope.numClassObjectProperties = 0;
      $scope.numClassDatatypeProperties = 0;
      $scope.numObjObjectProperties = 0;
      $scope.numObjDatatypeProperties = 0;

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
      $scope.classes = []
      $scope.fetchingMessageToAppear = true;

      var promise = queryDatasetService.queryDatasetClass($scope.selectedEndpointUrl, $scope.selectedGraph);
      
      promise.then(function(response) {
        // forse meglio farlo ancora piu tardi
        $rootScope.selectedEndpointUrl = $scope.selectedEndpointUrl;
        $rootScope.selectedEndpointName = $scope.selectedEndpointName;
        $rootScope.selectedGraph = $scope.selectedGraph;
      

        $scope.numClasses = 0;
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
          var result = $.grep($rootScope.prefixes, function(e){ return e.url == uriToFind; });
          //console.log(result[0].prefix);
          if(result.length==0){
            //$scope.convertUriToPrefixProxy(classUri, uriToFind, name);
          } else {
            var label = result[0].prefix + ":" + name;
            $scope.classes.push({
              uri: classUri,
              label: label
            });
            $scope.numClasses++;
          }


        };
      });
    }

    $scope.restoreToDefault();
    $scope.contactSelectedEndpoint();
    $scope.queryDatasetClass();


    // object properties della classe selezionata
    $scope.queryDatasetClassObjectProperty = function(){
      var promise = queryDatasetService.queryDatasetClassObjectProperty($rootScope.selectedEndpointUrl, $rootScope.selectedGraph, $scope.selectedClass.uri);
      promise.then(function(response) {

        console.log("num class obj prop: " + response.data.results.bindings.length);
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.classObjectProperties.push({
            uri: response.data.results.bindings[i].propertyUri.value,
            label: response.data.results.bindings[i].propertyLabel.value
          });
          $scope.numClassObjectProperties++;
        };
      });
    }

    // datatype (=literal) properties della classe selezionata
    $scope.queryDatasetClassDatatypeProperty = function(){
      $scope.classDatatypePropertiesLoading = true;
      var promise = queryDatasetService.queryDatasetClassDatatypeProperty($rootScope.selectedEndpointUrl, $rootScope.selectedGraph, $scope.selectedClass.uri);
      promise.then(function(response) {
        
        console.log("num class data prof: " + response.data.results.bindings.length);
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.classDatatypeProperties.push({
            uri: response.data.results.bindings[i].propertyUri.value,
            label: response.data.results.bindings[i].propertyLabel.value
          });
          $scope.numClassDatatypeProperties++;
        };
      });
      $scope.classDatatypePropertiesLoading = false;
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
        console.log("num data obj prop: " + response.data.results.bindings.length);
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.objDatatypeProperties.push({
            uri: response.data.results.bindings[i].propertyUri.value,
            label: response.data.results.bindings[i].propertyLabel.value
          });
          $scope.numObjDatatypeProperties++;
        };
      });
    }

    // object properties della object properties della classe selezionata
    $scope.queryDatasetValuesObjObjectProperty = function(obj){
      var promise = queryDatasetService.queryDatasetValuesObjObjectProperty($rootScope.selectedEndpointUrl, $rootScope.selectedGraph, obj);
      promise.then(function(response) {
        console.log("num obj obj proprietà: " + response.data.results.bindings.length);
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.objObjectProperties.push({
            uri: response.data.results.bindings[i].propertyUri.value,
            label: response.data.results.bindings[i].propertyLabel.value
          });
          $scope.numObjObjectProperties++;
        };
      });
    }

    //
    $scope.selectClass = function(selectedClass){

      $('#allClassPropertiesDropown .ui.dropdown').dropdown('restore placeholder text');

      $scope.numClassObjectProperties = 0;
      $scope.numClassDatatypeProperties = 0;
      $scope.numObjObjectProperties = 0;
      $scope.numObjDatatypeProperties = 0;

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
      $scope.selectedClassDatatypeProperties.splice(0, $scope.selectedClassDatatypeProperties.length);
      $scope.selectedClassDatatypeProperties.push(selectedClassProperty);
    }

    // quando si cambia la object property della classe scelta
    $scope.selectClassObjectProperty = function(selectedClassProperty){
      //aggiornate proprietà selezionate (aggiunte) della classe corrente
      $scope.selectedClassObjectProperties.length = 0;
      $scope.selectedClassObjectProperties.push(selectedClassProperty);

      //todo aggiornare dinamicamente

      $scope.numObjObjectProperties = 0;
      $scope.numObjDatatypeProperties = 0;
      $scope.objDatatypeProperties.length = 0;
      $scope.objObjectProperties.length = 0;
      $scope.selectedObjDatatypeProperties.length = 0;
      $scope.selectedObjObjectProperties.length = 0;

      var promise = queryDatasetService.queryEndpointForObject($rootScope.selectedEndpointUrl, $rootScope.selectedGraph, $scope.selectedClass.uri, $scope.selectedClassObjectProperties);
        promise.then(function(response) {
          $scope.obj = [];
          response.data.results.bindings.forEach(function(ob){
            $scope.obj.push(ob.oo.value);
          });
          $scope.queryDatasetValuesObjObjectProperty($scope.obj);
          $scope.queryDatasetValuesObjDatatypeProperty($scope.obj);
        });
      
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
    };

    $scope.clearRootScopeGraph= function(){
      $rootScope.graph.nodes.length = 0;
      $rootScope.graph.linksToLiterals.length = 0;
      $rootScope.graph.links.length = 0;
      $rootScope.graph.nodeLiteral.length = 0;
    }

    // primo bottone load data
    $scope.queryEndpointClassProperties = function(){

      $scope.classeColor = '#1f77b4';
      $scope.litPropClasseColor = '#ff7f0e';
      $scope.objPropClasse = '#2ca02c';
      $scope.litPropObj = '#d62728';
      $scope.objPropObj = '#9467bd';

      $scope.clearRootScopeGraph();

      if($scope.selectedClassDatatypeProperties.length != 0){
        $rootScope.dataInfo = {};
        $rootScope.dataInfo.litPropClasse = [];
        $rootScope.dataInfo.classe = {
          uri : $scope.selectedClass.uri,
          label : $scope.selectedClass.label,
          type : "obj",
          group: 1,
          color : $scope.classeColor
        }

        var promise = queryDatasetService.queryEndpointForLiteral($rootScope.selectedEndpointUrl, $rootScope.selectedGraph, $scope.selectedClass.uri, $scope.selectedClassDatatypeProperties);
        promise.then(function(response) {
          // nodi, literalNode e linkstoliterals della classe scelta
          var graph = GetJSONfileService.createNodeLiteral(response.data.results.bindings, "soggPropUri0");
          graph.nodes.forEach(function(n){
            n.group = "1";
          });
          $rootScope.graph.nodes = removeDuplicates(graph.nodes, "id");

          graph.nodeLiteral.forEach(function(nl){
            $rootScope.graph.nodeLiteral.push(nl);
          });

          graph.linksToLiterals.forEach(function(ll){
            $rootScope.graph.linksToLiterals.push(ll);
          });

          graph.links.forEach(function(l){
            $rootScope.graph.links.push(l);
          });
        });

        $scope.selectedClassDatatypeProperties.forEach(function(prop){
          $rootScope.dataInfo.litPropClasse.push(
            {
              uri : prop.uri,
              label : prop.label,
              type : 'lit',
              group: 2,
              color : $scope.litPropClasseColor
            });
        });
      };

        if($scope.selectedClassObjectProperties.length != 0){
        $rootScope.dataInfo.objPropClasse = {};
        var promise = queryDatasetService.queryEndpointForObject($rootScope.selectedEndpointUrl, $rootScope.selectedGraph, $scope.selectedClass.uri, $scope.selectedClassObjectProperties);
        promise.then(function(response) {
          $scope.obj = [];
          response.data.results.bindings.forEach(function(ob){
            $scope.obj.push(ob.oo.value);
          });

          //

          //
          $scope.queryDatasetValuesObjObjectProperty($scope.obj);
          $scope.queryDatasetValuesObjDatatypeProperty($scope.obj);

          // nodi, nodi e linkstoliterals della classe scelta
          var graph = GetJSONfileService.createNodeObject(response.data.results.bindings);
          graph.nodes.forEach(function(n){
            n.group = "3";
          });

          $rootScope.graph.nodes = removeDuplicates(graph.nodes, "id");

          graph.links.forEach(function(l){
            $rootScope.graph.links.push(l);
          });

          $scope.selectedClassObjectProperties.forEach(function(prop){
            $rootScope.dataInfo.objPropClasse =  {
              uri: prop.uri,
              label : prop.label,
              type : 'obj',
              group: 3,
              color : $scope.objPropClasse
            }
          });
        });
      }

      $rootScope.dataInfo.litPropObj = [];
      $rootScope.dataInfo.objPropObj = {};
    }


    $scope.queryEndpoint = function(){

      //$rootScope.$digest(); // $apply è già in corso, quindi non si può usare $digest
      if($scope.selectedObjDatatypeProperties.length != 0){

        var promise = queryDatasetService.queryEndpointForObjLiteralVAL($rootScope.selectedEndpointUrl,
                                                                  $rootScope.selectedGraph,
                                                                  $scope.selectedClassObjectProperties[0].uri,
                                                                  $scope.selectedObjDatatypeProperties, $scope.obj);
        promise.then(function(response) {
          // nodi, literalNode e linkstoliterals della classe scelta
          var graph = GetJSONfileService.createNodeLiteral(response.data.results.bindings, "oggPropUri0");
          
          graph.nodeLiteral.forEach(function(node){
            $rootScope.graph.nodeLiteral.push(node);
          });
          
          $rootScope.dataInfo.litPropObj = [];
          $rootScope.dataInfo.litPropObj.push({
              uri : $scope.selectedObjDatatypeProperties[0].uri,
              label : $scope.selectedObjDatatypeProperties[0].label,
              type : 'lit',
              group: 4,
              color : $scope.litPropObj
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
                                                                 $scope.selectedObjObjectProperties, $scope.obj);
        promise.then(function(response) {
          // nodi, nodi e linkstoliterals della classe scelta
          var graph = GetJSONfileService.createNodeObject(response.data.results.bindings);
          graph.nodes.forEach(function(n){
            n.group = "5";
            $rootScope.graph.nodes.push(n);
          });

          $rootScope.graph.nodes = removeDuplicates($rootScope.graph.nodes, "id");

          graph.links.forEach(function(l){
            $rootScope.graph.links.push(l);
          });
          
          $rootScope.dataInfo.objPropObj = [];
          $rootScope.dataInfo.objPropObj.push({
              uri: $scope.selectedObjObjectProperties[0].uri,
              label : $scope.selectedObjObjectProperties[0].label,
              type : 'obj',
              group: 5,
              color : $scope.objPropObj
            });
        });
      }
    }

    $scope.clearQueryParam = function(){
      $scope.selectedClass = '';

      $('#allClassPropertiesDropown .ui.dropdown').dropdown('restore placeholder text');
      $('#allClassDropdown .ui.dropdown').dropdown('restore placeholder text');

      $scope.classObjectProperties.length = 0;
      $scope.selectedClassObjectProperties.length = 0;

      $scope.classDatatypeProperties.length = 0;
      $scope.selectedClassDatatypeProperties.length = 0;

      $scope.objObjectProperties.length = 0;
      $scope.selectedObjObjectProperties.length = 0;

      $scope.objDatatypeProperties.length = 0;
      $scope.selectedObjDatatypeProperties.length = 0;
    };

    // remove duplicates from array of objects
    // input: old array of obj, unique property
    // ouput: array of obj with no duplicates
    function removeDuplicates(originalArray, prop) {
      var newArray = [];
      var lookupObject  = {};

      for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
      }

      for(i in lookupObject) {
        newArray.push(lookupObject[i]);
      }
      return newArray;
   }
});