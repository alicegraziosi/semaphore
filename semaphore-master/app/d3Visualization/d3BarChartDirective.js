'use strict';

var myAppd3view = angular.module('myApp.d3view');

myAppd3view.directive('d3Barchartvisualization', ['d3ServiceVersion3', '$window', '$parse', 'queryDatasetService',
  function(d3ServiceVersion3, $window, $parse, queryDatasetService) {
    return{
      //restrict:'E' --> <d3-visualization></d3-visualization>
      //restrict:'A' --> <div d3-visualization ></div>
      //restrict:'EA' --> entrambe le forme
      restrict:'E',
      //this is important,
      replace: false,
      //<d3-visualization graph="graph"></d3-visualization> --> $scope.graph
      scope: {
          graph: "=",
          model: "=",
          selectedNodeLabel: "="
      },
      link: function(scope, elem, attrs){
        // quando invoco il provider d3Service viene richiamato this.$get
        d3ServiceVersion3.then(function(d3) {
          // now you can use d3 as usual!
          //nota: tenere sempre tutte insieme queste linee di codice che stanno nel watch

          var width = 960,
              height = 600,
              padding = 1.5, // separation between same-color nodes
              clusterPadding = 100, // separation between different-color nodes
              maxRadius = 25, //radius nodo cluster
              radius = 10;



          scope.$watch('graph', function (graph) {
            if(graph){ //Checking if the given value is not undefined


            } //if(graph)
          }); //scope.$watch('graph', function (graph) {
        }); // d3Service.then(function(d3) {
      } // link
    } // return
}]); //directive function
