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
        var query = `SELECT DISTINCT * WHERE{
        { ?sogg a dbo:Band;
          rdfs:label ?soggLabel;
          rdfs:label "The Beatles"@en;
              ?pred ?oo.
         ?pred rdfs:label ?p;
            rdfs:label "former band member"@en.
            ?oo rdfs:label ?ooLabel;
                dbp:yearsActive ?ooPropUri0;
                dbo:birthPlace ?ooPropUri1.
          ?sogg <http://dbpedia.org/property/genre> ?soggPropUri0.
            OPTIONAL{
            ?soggPropUri0 rdfs:label ?soggPropLabel0.
            FILTER(lang(?soggPropLabel0) = "en")
            }
         ?ooPropUri1 rdfs:label ?ooPropLabel1.
         dbp:yearsActive rdfs:label ?ooPropLabel0.
         OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
         OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
        FILTER (lang(?soggLabel) = "en")
        FILTER (lang(?p) = "en")
        FILTER (lang(?ooLabel) = "en")
        FILTER (lang(?ooPropLabel1) = "en")
        FILTER (lang(?ooPropLabel0) = "en")
        } UNION {
          ?sogg a dbo:Band;
                rdfs:label ?soggLabel;
                rdfs:label "Paul McCartney and Wings"@en;
                ?pred ?oo.
           ?pred rdfs:label ?p;
              rdfs:label "former band member"@en.
              ?oo rdfs:label ?ooLabel;
                dbp:yearsActive ?ooPropUri0;
                dbo:birthPlace ?ooPropUri1.
                ?sogg <http://dbpedia.org/property/genre> ?soggPropUri0.
                OPTIONAL{
                ?soggPropUri0 rdfs:label ?soggPropLabel0.
                FILTER(lang(?soggPropLabel0) = "en")
                }
           ?ooPropUri1 rdfs:label ?ooPropLabel1.
           dbp:yearsActive rdfs:label ?ooPropLabel0.
           OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
           OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
           FILTER (lang(?soggLabel) = "en")
           FILTER (lang(?p) = "en")
           FILTER (lang(?ooLabel) = "en")
          FILTER (lang(?ooPropLabel1) = "en")
          FILTER (lang(?ooPropLabel0) = "en")
        } UNION {
          ?sogg a dbo:Band;
                rdfs:label ?soggLabel;
                rdfs:label "Nirvana (band)"@en;
                ?pred ?oo.
           ?pred rdfs:label ?p;
              rdfs:label "band member"@en.
              ?oo rdfs:label ?ooLabel;
                dbp:yearsActive ?ooPropUri0;
                dbo:birthPlace ?ooPropUri1.
                ?sogg <http://dbpedia.org/property/genre> ?soggPropUri0.
            OPTIONAL{
            ?soggPropUri0 rdfs:label ?soggPropLabel0.
            FILTER(lang(?soggPropLabel0) = "en")
            }
           ?ooPropUri1 rdfs:label ?ooPropLabel1.
           dbp:yearsActive rdfs:label ?ooPropLabel0.
           OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
           OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
           FILTER (lang(?soggLabel) = "en")
           FILTER (lang(?p) = "en")
           FILTER (lang(?ooLabel) = "en")
            FILTER (lang(?ooPropLabel1) = "en")
        } UNION {
          ?sogg a dbo:Band;
                rdfs:label ?soggLabel;
                rdfs:label "Foo Fighters"@en;
                ?pred ?oo.
           ?pred rdfs:label ?p;
              rdfs:label "band member"@en.
              ?oo rdfs:label ?ooLabel;
                dbp:yearsActive ?ooPropUri0;
                dbo:birthPlace ?ooPropUri1.
                ?sogg <http://dbpedia.org/property/website> ?soggPropUri0.
                OPTIONAL{
                ?soggPropUri0 rdfs:label ?soggPropLabel0.
                FILTER(lang(?soggPropLabel0) = "en")
                }
           ?ooPropUri1 rdfs:label ?ooPropLabel1.
           dbp:yearsActive rdfs:label ?ooPropLabel0.
           OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
           OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
           FILTER (lang(?soggLabel) = "en")
           FILTER (lang(?p) = "en")
           FILTER (lang(?ooLabel) = "en")
            FILTER (lang(?ooPropLabel1) = "en")
            FILTER (lang(?ooPropLabel0) = "en")
        }
        } limit 1000`;


        var queryPinkFloyd = `
        SELECT ?sogg ?s ?p ?o ?oo ?photoSogg ?photoOO ?ooPropUri0 ?ooPropLabel0 ?ooPropUri1 ?ooPropLabel1 WHERE{
        {
                ?sogg a dbo:Band;
                  rdfs:label ?s;
                  rdfs:label "Pink Floyd"@en;
                      ?pred ?oo.
                 ?pred rdfs:label ?p;
                    rdfs:label "former band member"@en.
                    ?oo rdfs:label ?o;
                        dbp:yearsActive ?ooPropUri0;
                        dbo:birthPlace ?ooPropUri1.

                 ?ooPropUri1 rdfs:label ?ooPropLabel1.
                 dbp:yearsActive rdfs:label ?ooPropLabel0.
                 OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
                 OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
                FILTER (lang(?s) = "en")
                FILTER (lang(?p) = "en")
                FILTER (lang(?o) = "en")
                FILTER (lang(?ooPropLabel1) = "en")
                FILTER (lang(?ooPropLabel0) = "en")
        } }`;
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

    var queryDatasetClass = function(endpoint, graph){
      var query = 'SELECT * FROM <' + graph + '>' +
                    `{ ?classUri a owl:Class;
                                 rdfs:label ?classLabel
                      FILTER (lang(?classLabel) = "en")
                    }`;
      var encodedquery = encodeURIComponent(query);
      var format = "application/sparql-results+json";
      var endcodedformat = encodeURIComponent(format);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      //$http.get(endpoint+"?format=json&query="+encodedquery)
      $http.get(endpoint+"?format="+endcodedformat+"&query="+encodedquery)
        .then(function(data) {
          defer.resolve(data);
        });
        return defer.promise;
    }

    var queryDatasetClassObjectProperty = function(endpoint, graph, selectedClass){
      var query = 'SELECT DISTINCT ?propertyUri ?propertyLabel FROM <' + graph + '> ' +
                    '{ ?propertyUri rdfs:domain  <'+ selectedClass +'>; '+
                  'rdfs:label ?propertyLabel '+
                  'FILTER (lang(?propertyLabel) = "en")'+
                  '}';
      var encodedquery = encodeURIComponent(query);
      var format = "application/sparql-results+json";
      var endcodedformat = encodeURIComponent(format);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      //$http.get(endpoint+"?format=json&query="+encodedquery)
      $http.get(endpoint+"?format="+endcodedformat+"&query="+encodedquery)
        .then(function(data) {
          defer.resolve(data);
        });
        return defer.promise;
    }

    var queryDatasetClassDatatypeProperty = function(endpoint, graph, selectedClass){
      var query = 'SELECT DISTINCT ?propertyUri ?propertyLabel FROM <' + graph + '> ' +
                  'WHERE { ?s a <'+ selectedClass +'>. '+
                  '?s ?propertyUri ?o. '+
                  '?propertyUri rdfs:label ?propertyLabel. '+
                  'FILTER(isLiteral(?o)) '+
                  'FILTER (lang(?propertyLabel) = "en") '+
                  '} ORDER BY ASC(UCASE(str(?propertyLabel)))';
      var encodedquery = encodeURIComponent(query);
      var format = "application/sparql-results+json";
      var endcodedformat = encodeURIComponent(format);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      //$http.get(endpoint+"?format=json&query="+encodedquery)
      $http.get(endpoint+"?format="+endcodedformat+"&query="+encodedquery)
        .then(function(data) {
          defer.resolve(data);
        });
        return defer.promise;
    }

    var queryEndpointForLiteral = function(endpoint, graph, selectedClass, classDatatypeProperties){
      var query = 'SELECT DISTINCT ?sogg ?soggLabel ?soggType ?propType';
      classDatatypeProperties.forEach(function(classDatatypeProperty, index){
        query += '?soggPropUri' + index + ' ?soggPropLabel' + index + ' ';
      });
      query += 'FROM <' + graph + '> WHERE { ' +
               '?sogg a <' + selectedClass + '>; ' +
                      'rdfs:label ?soggLabel. '+
               '<' + selectedClass + '> rdfs:label ?soggType. ';

      classDatatypeProperties.forEach(function(classDatatypeProperty, index){
        query += '?sogg <' + classDatatypeProperty + '> ?soggPropUri' + index + '. ';
        query += '<' + classDatatypeProperty + '> rdfs:label ?propType. ';
        query += 'OPTIONAL{ ?soggPropUri' + index + ' rdfs:label ?soggPropLabel' + index + '. ';
        query += 'FILTER(lang(?soggPropLabel' + index + ') = "en")} '
      });

      query += 'FILTER(lang(?soggType) = "en") FILTER(lang(?soggLabel) = "en")} LIMIT 5';

      var encodedquery = encodeURIComponent(query);
      var format = "application/sparql-results+json";
      var endcodedformat = encodeURIComponent(format);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      //$http.get(endpoint+"?format=json&query="+encodedquery)
      $http.get(endpoint+"?format="+endcodedformat+"&query="+encodedquery)
        .then(function(data) {
          defer.resolve(data);
        });
        return defer.promise;
    }

    var queryEndpointForObject = function(endpoint, graph, selectedClass, classObjectProperties){
      var query = 'SELECT DISTINCT ?sogg ?soggLabel ?soggType ';
      query += '?p ?pLabel ?oo ?ooLabel '+
                  'FROM <' + graph + '> WHERE { ' +
                    '?sogg a <' + selectedClass + '>; ' +
                          'rdfs:label ?soggLabel; ' +
                          '?p ?oo. ?p rdfs:label ?pLabel. ' +
                    '?oo rdfs:label ?ooLabel. ' +
                    '<' + selectedClass + '> rdfs:label ?soggType. ';

      query +=      'FILTER(lang(?soggLabel) = "en") ' +
                    'FILTER(lang(?pLabel) = "en") ' +
                    'FILTER(lang(?ooLabel) = "en") ' +
                    'FILTER ( ';

      classObjectProperties.forEach(function(classObjectProperty){
        query += '?p = <' + classObjectProperty.uri + '> ';
        if(classObjectProperties.indexOf(classObjectProperty)!=classObjectProperties.length-1){
          query += ' || ';
        }
      });
      query += ')} LIMIT 50';

      var encodedquery = encodeURIComponent(query);
      var format = "application/sparql-results+json";
      var endcodedformat = encodeURIComponent(format);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      //$http.get(endpoint+"?format=json&query="+encodedquery)
      $http.get(endpoint+"?format="+endcodedformat+"&query="+encodedquery)
        .then(function(data) {
          defer.resolve(data);
        });
        return defer.promise;
    }

    return{
      queryDataset: queryDataset,
      getDbPediaPhoto: getDbPediaPhoto,
      queryDatasetClass: queryDatasetClass,
      queryDatasetClassObjectProperty: queryDatasetClassObjectProperty,
      queryDatasetClassDatatypeProperty: queryDatasetClassDatatypeProperty,
      queryEndpointForLiteral: queryEndpointForLiteral,
      queryEndpointForObject: queryEndpointForObject
    };
}]);
