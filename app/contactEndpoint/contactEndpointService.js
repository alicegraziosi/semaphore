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

.factory('ContactSPARQLendpoint', ['$http', '$q', function($http, $q){


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
          $(".success.message").removeClass("hidden");
          $(".negative.message").addClass("hidden");    
        })
				.error(function(data, status, headers, config){
					console.log("Selected endpoint " + selectedEndpoint + " unreachable :(");
          $(".negative.message").removeClass("hidden");
          $(".success.message").addClass("hidden"); 
        });
    },

    // uri to prefix
    // url: https://prefix.cc/?q=http://xmlns.com/foaf/0.1/
    // redirect to: https://prefix.cc/foaf = http response location header
    // 302 -Redirect is being handled directly by the browser
    // https://stackoverflow.com/questions/10596999/javascript-get-http-header-location-after-redirection
    // url: "https://prefix.cc/?q="+uri
    convertUriToPrefix: function(uri){
        var deferred = $q.defer();
        //Do not return  here
        //you need to return the deferred.promise
          

        //Inside then() callback you simply resolve or reject deferred promise. 
        //.then(successCallback, errorCallback)
        $http.get("https://prefix.cc/?q="+uri)
        .then(function(response) {
          //resolving the deferred promise here
          deferred.resolve(response);
        });

        // The function must return the deferred.promise
        return deferred.promise;

        //Note:
        //url da cui è partita la richiesta http preso dagli headers della response
        //non funziona in caso di redirect, in caso di redirect restituisce comunque l'url iniziale
        //console.log(headers.location); // ritorna https://prefix.cc/?q=http://xmlns.com/foaf/0.1/
          
        //url da cui è partita la richiesta http preso dagli header della request
        //console.log(config.url); // ritorna https://prefix.cc/?q=http://xmlns.com/foaf/0.1/
    }
  }
}]);