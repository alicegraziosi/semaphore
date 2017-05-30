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
        var query = "ASK{?s ?p ?o}";
				return $http({
					method:"GET",
          // http://localhost:3030/semanticlancet/query?format=json&query=ASK{?s ?p ?o}
					url: selectedEndpoint + "?format=json&query=" + encodeURIComponent(query),
					timeout: 3000
				})
				.success(function(data, status, headers, config){
					console.log("Selected endpoint " + selectedEndpoint + " succesfully reached!!!");
				})
				.error(function(data, status, headers, config){
					console.log("Selected endpoint " + selectedEndpoint + " unreachable :(");
				});
    }
  }
}]);



/*

How to allow CORS in Apache Jena Fuseki

http://mail-archives.apache.org/mod_mbox/jena-users/201507.mbox/%3C55A6974E.9010009%40maudry.com%3E

*/
