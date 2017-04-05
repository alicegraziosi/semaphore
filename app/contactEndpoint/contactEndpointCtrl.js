'use strict';

var contactEndpointModule = angular.module('contactEndpointModule');

contactEndpointModule.controller('contactEndpointCtrl',
  function($scope, ContactSPARQLendpoint, queryDatasetService) {

    $scope.selectedEndpoint = "http://dbpedia.org/sparql";

    $scope.classes = [];
    $scope.selectedClass = "";

    $scope.classProperties = [];
    $scope.selectedClassProperties = [];

    //per risolvere proplemi di performance di ng-repeat delle classi
    $scope.totalDisplayed = 100;

    $scope.loadMore = function () {
      $scope.totalDisplayed += 200;
    };


    $scope.contactSelectedEndpoint = function () {
      ContactSPARQLendpoint.contactSelectedEndpoint($scope.selectedEndpoint)
        .success(function(data, status, headers, config){
          $scope.contacted = $scope.selectedEndpoint + " reached";
        })
        .error(function(data, status, headers, config){
          $scope.contacted = $scope.selectedEndpoint + " unreachable";
        });
      $scope.queryDBpediaClass();
    };

    $scope.queryDBpediaClass = function(){
      var promise = queryDatasetService.queryDBpediaClass($scope.selectedEndpoint);
      promise.then(function(response) {
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.classes.push({
            uri: response.data.results.bindings[i].classUri.value,
            label: response.data.results.bindings[i].classLabel.value
          });
        };
      });
    }

    $scope.queryDBpediaClassProperty = function(){
      var promise = queryDatasetService.queryDBpediaClassProperty($scope.selectedEndpoint, $scope.selectedClass);
      promise.then(function(response) {
        for(var i=0; i<response.data.results.bindings.length; i++){
          $scope.classProperties.push({
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
      //eliminate le proprietà della classe precedente
      $scope.classProperties.splice(0, $scope.classProperties.length);
      //vuotato l'array delle proprietà selezionate della classe corrente
      $scope.selectedClassProperties.splice(0, $scope.selectedClassProperties.length);
      $('.ui.label.transition.visible').remove();
      //ricerca delle proprietà della nuova classe corrente
      $scope.queryDBpediaClassProperty();
    }

    $scope.selectClassProperty = function(selectedClassProperty){
      //aggiornate proprietà selezionate (aggiunte) della classe corrente
      $scope.selectedClassProperties.push(selectedClassProperty);
    }

    $scope.dropdown = function(){
      $('.ui.dropdown').dropdown();
      //aggiornate proprietà selezionate (eliminate) della classe corrente
      $('.ui.dropdown .delete.icon').on('click', function(deletedClassProperties){
        $scope.selectedClassProperties.splice($scope.selectedClassProperties.indexOf(deletedClassProperties), 1 );
      });

      $('ui.label.transition.visible').remove();
    }
});
