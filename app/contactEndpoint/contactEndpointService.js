'use strict';

/*
  factory (servizio) per fare il ping di uno SPARQL endpoint per vedere se sia
  o meno raggiungibile

  note:
  metodo richiamabile all'interno del controller in questo modo:
  ContactSPARQLendpoint.contactSelectedEndpoint($scope.selectedEndpoint);

  The success or error method will always return a promise
  (it wraps your return value into a new promise). Quindi è inutile scrivere
  dentro a .success() o a .error() un return.

*/
angular.module('contactEndpointModule', [])

.factory('ContactSPARQLendpoint', ['$http', function($http){
  return{
    //var selectedEndpoint = "http://localhost:3030/semanticLancet/query";  //endpoint di esempio
    contactSelectedEndpoint: function(selectedEndpoint){  //selectedEndpoint è variabile di scope
        var query = "ASK  { ?x ?y ?z }";
				return $http({
					method:"GET",
					url: selectedEndpoint + "?format=json&query=" + encodeURIComponent(query),
					timeout: 3000
				})
				.success(function(data, status, headers, config){
					console.log("Selected endpoint " + selectedEndpoint + " succesfully reached");
				})
				.error(function(data, status, headers, config){
					console.log("selected endpoint " + selectedEndpoint + " unreachable");
				});
    }
  }
}]);
