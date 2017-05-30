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
              ?p ?oo.
              dbo:Band rdfs:label ?soggType.
         ?p rdfs:label ?pLabel;
            rdfs:label "former band member"@en.
            ?oo rdfs:label ?ooLabel;
                dbp:yearsActive ?ooPropUri0;
                dbo:birthPlace ?ooPropUri1.
                dbp:yearsActive rdfs:label ?ooPropType0.
          ?sogg <http://dbpedia.org/property/genre> ?soggPropUri0.
          <http://dbpedia.org/property/genre> rdfs:label ?propType.
            OPTIONAL{
            ?soggPropUri0 rdfs:label ?soggPropLabel0.
            FILTER(lang(?soggPropLabel0) = "en")
            }
         ?ooPropUri1 rdfs:label ?ooPropLabel1.
         dbp:yearsActive rdfs:label ?ooPropLabel0.
         OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
         OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
        FILTER (lang(?soggLabel) = "en")
        FILTER (lang(?pLabel) = "en")
        FILTER (lang(?ooLabel) = "en")
        FILTER (lang(?ooPropLabel1) = "en")
        FILTER (lang(?ooPropLabel0) = "en")

        FILTER (lang(?soggType) = "en")
        FILTER (lang(?ooPropType0) = "en")
        } UNION {
          ?sogg a dbo:Band;
                rdfs:label ?soggLabel;
                rdfs:label "Paul McCartney and Wings"@en;
                ?p ?oo.
                dbo:Band rdfs:label ?soggType.
           ?p rdfs:label ?pLabel;
              rdfs:label "former band member"@en.
              ?oo rdfs:label ?ooLabel;
                dbp:yearsActive ?ooPropUri0;
                dbo:birthPlace ?ooPropUri1.
                dbp:yearsActive rdfs:label ?ooPropType0.
                ?sogg <http://dbpedia.org/property/genre> ?soggPropUri0.
                <http://dbpedia.org/property/genre> rdfs:label ?propType.
                OPTIONAL{
                ?soggPropUri0 rdfs:label ?soggPropLabel0.
                FILTER(lang(?soggPropLabel0) = "en")
                }
           ?ooPropUri1 rdfs:label ?ooPropLabel1.
           dbp:yearsActive rdfs:label ?ooPropLabel0.
           OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
           OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
           FILTER (lang(?soggLabel) = "en")
           FILTER (lang(?pLabel) = "en")
           FILTER (lang(?ooLabel) = "en")
          FILTER (lang(?ooPropLabel1) = "en")
          FILTER (lang(?ooPropLabel0) = "en")
          FILTER (lang(?ooPropType0) = "en")
          FILTER (lang(?soggType) = "en")
        } UNION {
          ?sogg a dbo:Band;
                rdfs:label ?soggLabel;
                rdfs:label "Foo Fighters"@en;
                ?p ?oo.
                dbo:Band rdfs:label ?soggType.
           ?p rdfs:label ?pLabel;
              rdfs:label "band member"@en.
              ?oo rdfs:label ?ooLabel;
                dbp:yearsActive ?ooPropUri0;
                dbo:birthPlace ?ooPropUri1.
                dbp:yearsActive rdfs:label ?ooPropType0.
                ?sogg <http://dbpedia.org/property/genre> ?soggPropUri0.
                <http://dbpedia.org/property/genre> rdfs:label ?propType.
                OPTIONAL{
                ?soggPropUri0 rdfs:label ?soggPropLabel0.
                FILTER(lang(?soggPropLabel0) = "en")
                }
           ?ooPropUri1 rdfs:label ?ooPropLabel1.
           dbp:yearsActive rdfs:label ?ooPropLabel0.
           OPTIONAL{?sogg <http://dbpedia.org/ontology/thumbnail> ?photoSogg}
           OPTIONAL{?oo <http://dbpedia.org/ontology/thumbnail> ?photoOO}
           FILTER (lang(?soggLabel) = "en")
           FILTER (lang(?pLabel) = "en")
           FILTER (lang(?ooLabel) = "en")
            FILTER (lang(?ooPropLabel1) = "en")
            FILTER (lang(?ooPropLabel0) = "en")
            FILTER (lang(?ooPropType0) = "en")

            FILTER (lang(?soggType) = "en")
        }
        } limit 1000`;

        var encodedquery = encodeURIComponent(query);
        var deferred = $q.defer();
				$http.post(endpoint + "?format=json&query=" + encodedquery)
          .success(function(data) {
            deferred.resolve(data);
          })
          .error(function() {
            deferred.reject("Failed to get data");
          });
          return deferred.promise;
    }

    var queryDatasetLiteralBand = function(){
      var endpoint = "http://dbpedia.org/sparql";
      var prefixes = $();
      var query = `SELECT DISTINCT *
        WHERE{
        {
                ?sogg a dbo:Band;
                  rdfs:label ?soggLabel;
                  rdfs:label "The Beatles"@en;
                  <http://dbpedia.org/property/genre> ?soggPropUri0.
        dbo:Band rdfs:label ?soggType.
         <http://dbpedia.org/property/genre> rdfs:label ?propType.
                 OPTIONAL{ ?soggPropUri0 rdfs:label ?soggPropLabel0.
                  FILTER(lang(?soggPropLabel0) = "en")}

        FILTER(lang(?soggType) = "en")
        FILTER(lang(?soggLabel) = "en")

        } UNION {

         ?sogg a dbo:Band;
                  rdfs:label ?soggLabel;
                  rdfs:label "Foo Fighters"@en;
                  <http://dbpedia.org/property/genre> ?soggPropUri0.
                   <http://dbpedia.org/property/genre> rdfs:label ?propType.
        dbo:Band rdfs:label ?soggType.
                 OPTIONAL{ ?soggPropUri0 rdfs:label ?soggPropLabel0.
                  FILTER(lang(?soggPropLabel0) = "en")}

        FILTER(lang(?soggType) = "en")
        FILTER(lang(?soggLabel) = "en")



        }
        UNION {

         ?sogg a dbo:Band;
                  rdfs:label ?soggLabel;
                  rdfs:label "Paul McCartney and Wings"@en;
                  <http://dbpedia.org/property/genre> ?soggPropUri0.
        dbo:Band rdfs:label ?soggType.
         <http://dbpedia.org/property/genre> rdfs:label ?propType.
                 OPTIONAL{ ?soggPropUri0 rdfs:label ?soggPropLabel0.
                  FILTER(lang(?soggPropLabel0) = "en")}

        FILTER(lang(?soggType) = "en")
        FILTER(lang(?soggLabel) = "en")



        } UNION {

         ?sogg a dbo:Band;
                  rdfs:label ?soggLabel;
                  rdfs:label "Paul McCartney and Wings"@en;
                  <http://dbpedia.org/property/genre> ?soggPropUri0.
        dbo:Band rdfs:label ?soggType.
         <http://dbpedia.org/property/genre> rdfs:label ?propType.
                 OPTIONAL{ ?soggPropUri0 rdfs:label ?soggPropLabel0.
                  FILTER(lang(?soggPropLabel0) = "en")}

        FILTER(lang(?soggType) = "en")
        FILTER(lang(?soggLabel) = "en")



        }
        }`;
      var encodedquery = encodeURIComponent(query);
      var deferred = $q.defer();
      $http.post(endpoint + "?format=json&query=" + encodedquery)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function() {
          deferred.reject("Failed to get data");
        });
        return deferred.promise;
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

    // todo values
    var queryDatasetValuesObjObjectProperty = function(endpoint, graph, obj){
      var query = 'SELECT DISTINCT ?propertyUri ?propertyLabel FROM <' + graph + '> { ';
      query += 'VALUES ?soggetto { ';
      obj.forEach(function(ob, index){
        query += '<' + ob + '> ';
      });
      query +=    ' } ?soggetto ?p ?propertyUri. ?propertyUri rdfs:label ?propertyLabel. '+
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
                  '} LIMIT 100';
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

    // todo values
    var queryDatasetValuesObjDatatypeProperty = function(endpoint, graph, obj){
      var query = 'SELECT DISTINCT ?propertyUri ?propertyLabel FROM <' + graph + '> {';
      query += 'VALUES ?soggetto { ';
      obj.forEach(function(ob, index){
        query += '<' + ob + '>';
      });
      query += '} ?soggetto ?propertyUri ?o. '+
                  '?propertyUri rdfs:label ?propertyLabel. '+
                  'FILTER(isLiteral(?o)) '+
                  'FILTER (lang(?propertyLabel) = "en") '+
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
        query += '?sogg <' + classDatatypeProperty.uri + '> ?soggPropUri' + index + '. ';
        query += '<' + classDatatypeProperty.uri + '> rdfs:label ?propType. ';
        query += 'OPTIONAL{ ?soggPropUri' + index + ' rdfs:label ?soggPropLabel' + index + '. ';
        query += 'FILTER(lang(?soggPropLabel' + index + ') = "en")} '
      });

      query += 'FILTER(lang(?soggType) = "en") FILTER(lang(?propType) = "en") FILTER(lang(?soggLabel) = "en")} LIMIT 50';

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
                    'FILTER(lang(?soggType) = "en") ' +
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

    /*
    var queryEndpointForObjLiteral = function(endpoint, graph, selectedClass, classDatatypeProperties){
      var query = 'SELECT DISTINCT ?sogg ?soggLabel ?soggType ?propType';
      classDatatypeProperties.forEach(function(classDatatypeProperty, index){
        query += '?soggPropUri' + index + ' ?soggPropLabel' + index + ' ';
      });
      query += 'FROM <' + graph + '> WHERE { ' +
               '?soggetto <' + selectedClass + '> ?sogg. ' +
               '?sogg rdfs:label ?soggLabel. '+
               '<' + selectedClass + '> rdfs:label ?soggType. ';

      classDatatypeProperties.forEach(function(classDatatypeProperty, index){
        query += '?sogg <' + classDatatypeProperty.uri + '> ?soggPropUri' + index + '. ';
        query += '<' + classDatatypeProperty.uri + '> rdfs:label ?propType. ';
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

    var queryEndpointForObjObject = function(endpoint, graph, selectedClass, classObjectProperties){
      var query = 'SELECT DISTINCT ?sogg ?soggLabel ?soggType ';
      query += '?pLabel ?oo ?ooLabel '+
                  'FROM <' + graph + '> WHERE { ' +
                    '?soggetto <' + selectedClass + '> ?sogg.' +
                    '?sogg rdfs:label ?soggLabel; ' +
                      '<' + classObjectProperties[0].uri + '> ?oo. '+
                      '<' + classObjectProperties[0].uri + '> rdfs:label ?pLabel. ' +
                    '?oo rdfs:label ?ooLabel. ' +
                    '<' + selectedClass + '> rdfs:label ?soggType. ';

      query +=      'FILTER(lang(?soggLabel) = "en") ' +
                    'FILTER(lang(?pLabel) = "en") ' +
                    'FILTER(lang(?ooLabel) = "en") FILTER(lang(?soggType) = "en")';

      query += '} LIMIT 50';

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
    }*/

      var queryEndpointForObjLiteralVAL = function(endpoint, graph, selectedClass, classDatatypeProperties, obj){
      var query = 'SELECT DISTINCT ?sogg ?soggLabel ?soggType ?propType';
      classDatatypeProperties.forEach(function(classDatatypeProperty, index){
        query += '?soggPropUri' + index + ' ?soggPropLabel' + index + ' ';
      });
      query += 'FROM <' + graph + '> WHERE { ';
      query += 'VALUES ?sogg { ';
        obj.forEach(function(ob, index){
          query += '<' + ob + '>';
        });
        query += ' } ?sogg rdfs:label ?soggLabel. '+
               '<' + selectedClass + '> rdfs:label ?soggType. ';

      classDatatypeProperties.forEach(function(classDatatypeProperty, index){
        query += '?sogg <' + classDatatypeProperty.uri + '> ?soggPropUri' + index + '. ';
        query += '<' + classDatatypeProperty.uri + '> rdfs:label ?propType. ';
        query += 'OPTIONAL{ ?soggPropUri' + index + ' rdfs:label ?soggPropLabel' + index + '. ';
        query += 'FILTER(lang(?soggPropLabel' + index + ') = "en")} '
      });

      query += 'FILTER(lang(?soggType) = "en") FILTER(lang(?propType) = "en") FILTER(lang(?soggLabel) = "en")}';

      var encodedquery = encodeURIComponent(query);
      var format = "application/sparql-results+json";
      var endcodedformat = encodeURIComponent(format);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      //$http.get(endpoint+"?format=json&query="+encodedquery)
      $http.post(endpoint+"?format="+endcodedformat+"&query="+encodedquery)
        .then(function(data) {
          defer.resolve(data);
        });
        return defer.promise;
    }

    var queryEndpointForObjObjectVAL = function(endpoint, graph, classObjectProperties, obj){
      var query = 'SELECT DISTINCT ?sogg ?soggLabel ?soggType ';
      query += '?pLabel ?oo ?ooLabel '+
                  'FROM <' + graph + '> WHERE { ';
      query += 'VALUES ?sogg { ';
        obj.forEach(function(ob, index){
          query += '<' + ob + '>';
        });
        query +='} ?sogg rdfs:label ?soggLabel; ' +
                      '<' + classObjectProperties[0].uri + '> ?oo. '+
                      '<' + classObjectProperties[0].uri + '> rdfs:label ?pLabel. ' +
                    '?oo rdfs:label ?ooLabel. ' +
                    '<' + selectedClass + '> rdfs:label ?soggType. ';

      query +=      'FILTER(lang(?soggLabel) = "en") ' +
                    'FILTER(lang(?pLabel) = "en") ' +
                    'FILTER(lang(?ooLabel) = "en") FILTER(lang(?soggType) = "en")';

      query += '}';

      var encodedquery = encodeURIComponent(query);
      var format = "application/sparql-results+json";
      var endcodedformat = encodeURIComponent(format);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      //$http.get(endpoint+"?format=json&query="+encodedquery)
      $http.post(endpoint+"?format="+endcodedformat+"&query="+encodedquery)
        .then(function(data) {
          defer.resolve(data);
        });
        return defer.promise;
    }

    /*
    var queryDatasetObjectPropertyRange = function(endpoint, graph, selectedObjectProperty){
      var query = 'SELECT ?rangeClass FROM <' + graph + '> WHERE { ' +
                  '<' + selectedObjectProperty + '> rdfs:range ?rangeClass.}';
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
    }*/

    return{
      queryDataset: queryDataset,
      queryDatasetLiteralBand: queryDatasetLiteralBand,
      queryDatasetClass: queryDatasetClass,
      queryDatasetClassObjectProperty: queryDatasetClassObjectProperty,
      queryDatasetClassDatatypeProperty: queryDatasetClassDatatypeProperty,
      queryEndpointForLiteral: queryEndpointForLiteral,
      queryEndpointForObject: queryEndpointForObject,
      queryEndpointForObjLiteralVAL: queryEndpointForObjLiteralVAL,
      queryEndpointForObjObjectVAL: queryEndpointForObjObjectVAL,
      /*
      queryDatasetObjectPropertyRange: queryDatasetObjectPropertyRange,
      */
      queryDatasetValuesObjObjectProperty: queryDatasetValuesObjObjectProperty,
      queryDatasetValuesObjDatatypeProperty: queryDatasetValuesObjDatatypeProperty
    };
}]);
