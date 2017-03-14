'use strict';

angular.module('queryDatasetModule', [])

.factory('queryDatasetService', ['$http', '$q', function($http, $q){
  return{
    queryDataset: function(){
        var endpoint = "http://dbpedia.org/sparql";
        var prefixes = $();
        var query = `SELECT DISTINCT ?sogg ?s ?p ?o ?oo ?photoSogg ?photoOO WHERE{
          {?sogg a dbo:Band;
          rdfs:label ?s;
          rdfs:label "The Beatles"@en;
              ?pred ?oo.
         ?pred rdfs:label ?p;
            rdfs:label "former band member"@en.
         ?oo rdfs:label ?o.

         OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
         OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
        FILTER (lang(?s) = "en")
        FILTER (lang(?p) = "en")
        FILTER (lang(?o) = "en")
        } UNION {
          ?sogg a dbo:Band;
                rdfs:label ?s;
                rdfs:label "Paul McCartney and Wings"@en;
                ?pred ?oo.
           ?pred rdfs:label ?p;
              rdfs:label "former band member"@en.
           ?oo rdfs:label ?o.
           OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
           OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
          FILTER (lang(?s) = "en")
          FILTER (lang(?p) = "en")
          FILTER (lang(?o) = "en")
        } UNION {
          ?sogg a dbo:Band;
                rdfs:label ?s;
                rdfs:label "Nirvana (band)"@en;
                ?pred ?oo.
           ?pred rdfs:label ?p;
              rdfs:label "band member"@en.
           ?oo rdfs:label ?o.
           OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
           OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
            FILTER (lang(?s) = "en")
            FILTER (lang(?p) = "en")
            FILTER (lang(?o) = "en")
        } UNION {
          ?sogg a dbo:Band;
                rdfs:label ?s;
                rdfs:label "Foo Fighters"@en;
                ?pred ?oo.
           ?pred rdfs:label ?p;
              rdfs:label "band member"@en.
           ?oo rdfs:label ?o.
           OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
           OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
            FILTER (lang(?s) = "en")
            FILTER (lang(?p) = "en")
            FILTER (lang(?o) = "en")}
        } limit 1000`;
        var encodedquery = encodeURIComponent(query);
        var defer = $q.defer();
				$http.get(endpoint
          + "?format=json&query="
          + encodedquery).then(function(response) {
            defer.resolve(response.data);
          });
          return defer.promise;
    },
    getDbPediaPhoto: function(entity, callbackFn){
      var endpoint = "http://dbpedia.org/sparql";
      var prefixes = $();
      var query = 'SELECT ?photo WHERE{<'+entity+'> <http://dbpedia.org/ontology/thumbnail> ?photo.}';
      var encodedquery = encodeURIComponent(query);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      $http.get(endpoint+"?format=json&query="+encodedquery)
      .then(function(response) {
        defer.resolve(response.data);
      });
      return defer.promise;
    }
  }
}]);
