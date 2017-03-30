'use strict';

angular.module('queryDatasetModule', [])

.factory('queryDatasetService', ['$http', '$q', function($http, $q){
  var queryDataset = function(){
        var endpoint = "http://dbpedia.org/sparql";
        var prefixes = $();
        //to do
        //aggiungere anno o un altra proprietà del cantante
        //aggiungere classe a cui appartiene
        // stile in base alla classe
        var query = `SELECT DISTINCT ?sogg ?s ?p ?o ?oo ?photoSogg ?photoOO ?year ?yearLabel ?birth ?birthLabel WHERE{
        { ?sogg a dbo:Band;
          rdfs:label ?s;
          rdfs:label "The Beatles"@en;
              ?pred ?oo.
         ?pred rdfs:label ?p;
            rdfs:label "former band member"@en.
            ?oo rdfs:label ?o;
                dbp:yearsActive ?year;
                dbo:birthPlace ?birth.

         ?birth rdfs:label ?birthLabel.
         dbp:yearsActive rdfs:label ?yearLabel.
         OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
         OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
        FILTER (lang(?s) = "en")
        FILTER (lang(?p) = "en")
        FILTER (lang(?o) = "en")
        FILTER (lang(?birthLabel) = "en")
        FILTER (lang(?yearLabel) = "en")
        } UNION {
          ?sogg a dbo:Band;
                rdfs:label ?s;
                rdfs:label "Paul McCartney and Wings"@en;
                ?pred ?oo.
           ?pred rdfs:label ?p;
              rdfs:label "former band member"@en.
              ?oo rdfs:label ?o;
                dbp:yearsActive ?year;
                dbo:birthPlace ?birth.

           ?birth rdfs:label ?birthLabel.
           dbp:yearsActive rdfs:label ?yearLabel.
           OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
           OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
          FILTER (lang(?s) = "en")
          FILTER (lang(?p) = "en")
          FILTER (lang(?o) = "en")
          FILTER (lang(?birthLabel) = "en")
          FILTER (lang(?yearLabel) = "en")
        } UNION {
          ?sogg a dbo:Band;
                rdfs:label ?s;
                rdfs:label "Nirvana (band)"@en;
                ?pred ?oo.
           ?pred rdfs:label ?p;
              rdfs:label "band member"@en.
              ?oo rdfs:label ?o;
                dbp:yearsActive ?year;
                dbo:birthPlace ?birth.
           ?birth rdfs:label ?birthLabel.
           dbp:yearsActive rdfs:label ?yearLabel.
           OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
           OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
            FILTER (lang(?s) = "en")
            FILTER (lang(?p) = "en")
            FILTER (lang(?o) = "en")
            FILTER (lang(?birthLabel) = "en")
        } UNION {
          ?sogg a dbo:Band;
                rdfs:label ?s;
                rdfs:label "Foo Fighters"@en;
                ?pred ?oo.
           ?pred rdfs:label ?p;
              rdfs:label "band member"@en.
              ?oo rdfs:label ?o;
                dbp:yearsActive ?year;
                dbo:birthPlace ?birth.

           ?birth rdfs:label ?birthLabel.
           dbp:yearsActive rdfs:label ?yearLabel.
           OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
           OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
            FILTER (lang(?s) = "en")
            FILTER (lang(?p) = "en")
            FILTER (lang(?o) = "en")
            FILTER (lang(?birthLabel) = "en")
            FILTER (lang(?yearLabel) = "en")
        }
        } limit 1000`;
        var encodedquery = encodeURIComponent(query);
        var deferred = $q.defer();
				$http.get(endpoint + "?format=json&query=" + encodedquery)
          .success(function(data) {
            deferred.resolve(data);
          })
          .error(function() {
            deferred.reject("Failed to get data");
          });
          return deferred.promise;
    }

    var getDbPediaPhoto = function(entity, callbackFn){
      var endpoint = "http://dbpedia.org/sparql";
      var prefixes = $();
      var query = 'SELECT ?photo WHERE{<'+entity+'> <http://dbpedia.org/ontology/thumbnail> ?photo.}';
      var encodedquery = encodeURIComponent(query);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      //$http.get(endpoint+"?format=json&query="+encodedquery)
      $http.post(endpoint+"?format=json&query="+encodedquery)
        .then(function(response) {
          defer.resolve(response.data);
        });
        return defer.promise;
    }

    return{
      queryDataset: queryDataset,
      getDbPediaPhoto: getDbPediaPhoto
    };
}]);
