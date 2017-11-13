'use strict';

angular.module('queryDatasetModule', [])

.factory('queryDatasetService', ['$http', '$q', function($http, $q){

  var prefixes = `PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
                  PREFIX owl:     <http://www.w3.org/2002/07/owl#>
                  PREFIX fabio:   <http://purl.org/spar/fabio/>
                  PREFIX frbr:    <http://purl.org/vocab/frbr/core#>
                  PREFIX co:      <http://purl.org/co/>
                  PREFIX foaf:    <http://xmlns.com/foaf/0.1/>
                  PREFIX pro:     <http://purl.org/spar/pro/>
                  PREFIX dcterms: <http://purl.org/dc/terms/>
                  PREFIX c4o:     <http://purl.org/spar/c4o/>
                  PREFIX cito:    <http://purl.org/spar/cito/>
                  PREFIX prism:   <http://prismstandard.org/namespaces/basic/2.0/>
                  PREFIX sro:     <http://salt.semanticauthoring.org/ontologies/sro#>
                  PREFIX biro:    <http://purl.org/spar/biro/>
                  PREFIX oa:      <http://www.w3.org/ns/oa#>
                  PREFIX doco:    <http://purl.org/spar/doco/>
                  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                  PREFIX dbo:     <http://dbpedia.org/ontology/>`;

  var queryDataset = function(){
        var endpoint = "http://dbpedia.org/sparql";
        var query = `SELECT DISTINCT * WHERE{
        { ?sogg a dbo:Band;
                rdfs:label ?soggLabel;
                rdfs:label "U2"@en;
                ?p ?oo.
                dbo:Band rdfs:label ?soggType.
           ?p rdfs:label ?pLabel;
              rdfs:label "former band member"@en.
              ?oo rdfs:label ?ooLabel;
                dbp:yearsActive ?ooPropUri0;
                dbo:birthPlace ?ooPropUri1.
                dbp:yearsActive rdfs:label ?ooPropType0.
                ?sogg dbo:genre ?soggPropUri0.
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
                rdfs:label "Pink Floyd"@en;
                ?p ?oo.
                dbo:Band rdfs:label ?soggType.
           ?p rdfs:label ?pLabel;
              rdfs:label "former band member"@en.
              ?oo rdfs:label ?ooLabel;
                dbp:yearsActive ?ooPropUri0;
                dbo:birthPlace ?ooPropUri1.
                dbp:yearsActive rdfs:label ?ooPropType0.
                ?sogg dbo:genre ?soggPropUri0.
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
              rdfs:label "former band member"@en.
              ?oo rdfs:label ?ooLabel;
                dbp:yearsActive ?ooPropUri0;
                dbo:birthPlace ?ooPropUri1.
                dbp:yearsActive rdfs:label ?ooPropType0.
                ?sogg dbo:genre ?soggPropUri0.
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
      var query = `SELECT DISTINCT *
        WHERE{
        {
                ?sogg a dbo:Band;
                  rdfs:label ?soggLabel;
                  rdfs:label "The Beatles"@en;
                  dbo:genre ?soggPropUri0.
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
                  dbo:genre ?soggPropUri0.
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
                  rdfs:label "Pink Floyd"@en;
                  dbo:genre ?soggPropUri0.
        dbo:Band rdfs:label ?soggType.
         <http://dbpedia.org/property/genre> rdfs:label ?propType.
                 OPTIONAL{ ?soggPropUri0 rdfs:label ?soggPropLabel0.
                  FILTER(lang(?soggPropLabel0) = "en")}

        FILTER(lang(?soggType) = "en")
        FILTER(lang(?soggLabel) = "en")



        } UNION {

         ?sogg a dbo:Band;
                  rdfs:label ?soggLabel;
                  rdfs:label "U2"@en;
                  dbo:genre ?soggPropUri0.
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
      /*
      OLD query

      si chiedono le owl:class, ma per il dataset di semanticLancet non si avevano risultati
      perchè non c'è la tripla che specifica che una risorsa è proprio una owl:class

      Per dbpedia è ok. Per semanticLancet no.
      */

      /*
      var query = 'SELECT * ';
      if(graph != "default"){
        query += ' FROM <' + graph + '> ';
      }
      query += `{ ?classUri a owl:Class;
                      rdfs:label ?classLabel
                      FILTER (lang(?classLabel) = "en")
                    } LIMIT 10000`;
      */


      // NEW query
      // non si chiedono le owl:class ma gli rdf:type

      /*
      SELECT DISTINCT ?classUri {
        ?classe a ?classUri.
      } LIMIT 1500

      */

      var query = 'SELECT DISTINCT ?classUri ';
      if(graph != "default"){
        query += ' FROM <' + graph + '> ';
      }

      query += `
        { 
          ?classe a ?classUri.
        } 
      
      LIMIT 500`;

      //Va bene sia per dbpedia che per semanticLancet
      console.log("Query classi: " + query);

      var encodedquery = encodeURIComponent(prefixes + " " + query);
      // https://www.w3.org/TR/sparql11-results-json/
      // 
      var format = "application/sparql-results+json";
      var endcodedformat = encodeURIComponent(format);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      //$http.get(endpoint+"?format=json&query="+encodedquery)
      //$http.get(endpoint+"?format="+endcodedformat+"&query="+encodedquery, {timeout: 60000})
      // per le http get non deve essere specificato il format (non è vero per Apache Jena Fuseki2)
      $http.get(endpoint+"?format=json&query="+encodedquery, {timeout: 60000})
        .then(function(data) {
          defer.resolve(data);
        });
        return defer.promise;
    }

    var queryDatasetClassObjectProperty = function(endpoint, graph, selectedClass){
      var query = 'SELECT DISTINCT ?propertyUri ?propertyLabel ';
      if(graph != "default"){
        query += ' FROM <' + graph + '> ';
      }
      /*
      query += '{ ?propertyUri rdfs:domain  <'+ selectedClass +'>; '+
                  'rdfs:label ?propertyLabel '+
                  'FILTER (lang(?propertyLabel) = "en") '+
                  'FILTER(!isLiteral(?propertyUri)) ' +
                  '}';
      */
      query += '{ ?propertyUri rdfs:domain  ?superclass; '+
                  'rdfs:label ?propertyLabel '+
                  'FILTER (lang(?propertyLabel) = "en") '+
                  '<'+ selectedClass +'> rdfs:subClassOf* ?superclass. ' +
                  'FILTER(!isLiteral(?propertyUri)) ' +
                  '}';
      console.log("queryDatasetClassObjectProperty");
      console.log(prefixes + " " + query)
      var encodedquery = encodeURIComponent(prefixes + " " + query);
      //var format = "application/sparql-results+json";
      //var endcodedformat = encodeURIComponent(format);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      //$http.get(endpoint+"?format=json&query="+encodedquery)
      //$http.get(endpoint+"?format="+endcodedformat+"&query="+encodedquery)
      $http.get(endpoint+"?format=json&query="+encodedquery)
        .then(function(data) {
          defer.resolve(data);
        });
        return defer.promise;
    }

    // todo values
    var queryDatasetValuesObjObjectProperty = function(endpoint, graph, obj){
      var query = 'SELECT DISTINCT ?propertyUri ?propertyLabel ';
      if(graph != "default"){
        query += ' FROM <' + graph + '> { ';
      }
      //  query += ' VALUES ?soggetto { '; // Old
      query += ' WHERE { VALUES ?soggetto { ';
      obj.forEach(function(ob, index){
        query += '<' + ob + '> ';
      });
      query +=    ' } ?soggetto ?propertyUri ?p. '+
                  'FILTER(!isLiteral(?p)) ' + 
                  '?propertyUri rdfs:label ?propertyLabel. '+
                  'FILTER (lang(?propertyLabel) = "en")'+
                  '}';
      console.log(query);
      var encodedquery = encodeURIComponent(prefixes + " " + query);
      //var format = "application/sparql-results+json";
      //var endcodedformat = encodeURIComponent(format);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      $http.get(endpoint+"?format=json&query="+encodedquery)
      //$http.get(endpoint+"?query="+encodedquery)
        .then(function(data) {
          defer.resolve(data);
        });
        return defer.promise;
    }


    var queryDatasetClassDatatypeProperty = function(endpoint, graph, selectedClass){
      var query = 'SELECT DISTINCT ?propertyUri ?propertyLabel ';
      if(graph != "default"){
        query += ' FROM <' + graph + '> ';
      }
      query += 'WHERE { ?s a <'+ selectedClass +'>. '+
                  '?s ?propertyUri ?o. '+
                  '?propertyUri rdfs:label ?propertyLabel. '+
                  'FILTER(isLiteral(?o) || ?o = xsd:string ) '+
                  'FILTER (lang(?propertyLabel) = "en") '+
                  '} LIMIT 100';
      console.log(query);
      var encodedquery = encodeURIComponent(prefixes + " " + query);
      var format = "application/sparql-results+json";
      var endcodedformat = encodeURIComponent(format);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      //$http.get(endpoint+"?format="+endcodedformat+"&query="+encodedquery)
      $http.get(endpoint+"?format=json&query="+encodedquery)
        .then(function(data) {
          defer.resolve(data);
        });
        return defer.promise;
    }

    // todo values
    var queryDatasetValuesObjDatatypeProperty = function(endpoint, graph, obj){
      var query = 'SELECT DISTINCT ?propertyUri ?propertyLabel ';
      if(graph != "default"){
        query += ' FROM <' + graph + '> {';
      }
      //query += ' VALUES ?soggetto { '; // OLD
      query += ' WHERE { VALUES ?soggetto { ';
      obj.forEach(function(ob, index){
        query += '<' + ob + '>';
      });
      query += '} ?soggetto ?propertyUri ?o. '+
                  '?propertyUri rdfs:label ?propertyLabel. '+
                  'FILTER(isLiteral(?o)) '+
                  'FILTER (lang(?propertyLabel) = "en") '+
                  '}';
      console.log(query);
      var encodedquery = encodeURIComponent(prefixes + " " + query);
      var format = "application/sparql-results+json";
      var endcodedformat = encodeURIComponent(format);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      $http.get(endpoint+"?format=json&query="+encodedquery)
      //$http.get(endpoint+"?query="+encodedquery)
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
      if(graph != "default"){
        query += ' FROM <' + graph + '> ';
      }
      query += ' WHERE { ' +
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
      console.log(query);
      var encodedquery = encodeURIComponent(prefixes + " " + query);
      var format = "application/sparql-results+json";
      var endcodedformat = encodeURIComponent(format);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      //$http.get(endpoint+"?format="+endcodedformat+"&query="+encodedquery)
      $http.get(endpoint+"?format=json&query="+encodedquery)
        .then(function(data) {
          defer.resolve(data);
        });
        return defer.promise;
    }

    var queryEndpointForObject = function(endpoint, graph, selectedClass, classObjectProperties){
      var query = 'SELECT DISTINCT ?sogg ?soggLabel ?soggType ?p ?pLabel ?oo ?ooLabel ';
      if(graph != "default"){
        query += ' FROM <' + graph + '> ';
      }
      query += ' WHERE { ' +
                    '?sogg a <' + selectedClass + '>; ' +
                          'rdfs:label ?soggLabel; ' +
                          '?p ?oo. ?p rdfs:label ?pLabel. ' +
                    '?oo rdfs:label ?ooLabel. ' +
                    '<' + selectedClass + '> rdfs:label ?soggType. '+
                    'FILTER(lang(?soggLabel) = "en") ' +
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
      console.log(query);
      var encodedquery = encodeURIComponent(prefixes + " " + query);
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
      if(graph != "default"){
        query += ' FROM <' + graph + '> ';
      }
      query += 'WHERE { ';
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

      var encodedquery = encodeURIComponent(prefixes + " " + query);
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

    var queryEndpointForObjObjectVAL = function(endpoint, graph, selectedClass, classObjectProperties, obj){
      var query = 'SELECT DISTINCT ?sogg ?soggLabel ?soggType ?p ?pLabel ?oo ?ooLabel ';
      if(graph != "default"){
        query += ' FROM <' + graph + '> ';
      }
      query += 'WHERE { VALUES ?sogg { ';
        obj.forEach(function(ob, index){
          query += '<' + ob + '>';
        });
        query +='} ?sogg rdfs:label ?soggLabel; ' +
                      '<' + classObjectProperties[0].uri + '> ?oo; ' +
                      '?p ?oo. '+
                      '<' + classObjectProperties[0].uri + '> rdfs:label ?pLabel. ' +
                    '?oo rdfs:label ?ooLabel. ' +
                    '<' + selectedClass + '> rdfs:label ?soggType. ';

      query +=      'FILTER(lang(?soggLabel) = "en") ' +
                    'FILTER(lang(?pLabel) = "en") ' +
                    'FILTER(lang(?ooLabel) = "en") FILTER(lang(?soggType) = "en")';

      query += '}';
      console.log(query);
      var encodedquery = encodeURIComponent(prefixes + " " + query);
      var format = "application/sparql-results+json";
      var endcodedformat = encodeURIComponent(format);
      var defer = $q.defer();
      // Angular $http() and then() both return promises themselves
      //$http.get(endpoint+"?format=json&query="+encodedquery)
      $http.post(endpoint+"?format=json&query="+encodedquery)
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

    // ok per dbpedia
    var queryPhotoFromDB = function(endpoint, graph, selectedItem){
      var query = 'SELECT DISTINCT ?photoUrl ';
      if(graph != "default"){
        query += ' FROM <' + graph + '> ';
      }
      query += 'WHERE { { <' + selectedItem + '> <http://dbpedia.org/ontology/thumbnail> ?photoUrl. }';
      query += 'UNION { <' + selectedItem + '> <http://www.science.uva.nl/research/sne/nmle#thumbnail> ?photoUrl.} }'
      console.log(query);
      var encodedquery = encodeURIComponent(prefixes + " " + query);
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
      queryDatasetValuesObjDatatypeProperty: queryDatasetValuesObjDatatypeProperty,
      queryPhotoFromDB: queryPhotoFromDB

    };
}]);
