'use strict';

var queryDatasetModule = angular.module('queryDatasetModule');

queryDatasetModule.controller('queryDatasetCtrl', function($scope, queryDatasetService, GetJSONfileService) {
  $scope.queryDataset = function () {
    queryDatasetService.queryDataset()
      .success(function(data, status, headers, config){
        GetJSONfileService.createJsonFile(data);
      });
    }

    $scope.prefixes =
   `PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
	PREFIX owl:     <http://www.w3.org/2002/07/owl#>
	PREFIX fabio:   <http://purl.org/spar/fabio/>
	PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
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
	PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
	PREFIX dbo:     <http://dbpedia.org/ontology/>
	PREFIX cito:    <http://purl.org/spar/cito/>
	PREFIX dcterms: <http://purl.org/dc/terms/>
	PREFIX datacite:<http://purl.org/spar/datacite/>
	PREFIX literal: <http://www.essepuntato.it/2010/06/literalreification/>
	PREFIX biro:    <http://purl.org/spar/biro/>
	PREFIX frbr:    <http://purl.org/vocab/frbr/core#>
	PREFIX c4o:     <http://purl.org/spar/c4o/>
	PREFIX   ex:    <http://www.example.org/resources#>
	PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
	PREFIX text:    <http://jena.apache.org/text#>
    PREFIX indl: <http://www.science.uva.nl/research/sne/indl#>
    PREFIX nml: <http://schemas.ogf.org/nml/2013/05/base#>
    PREFIX nmle: <http://www.science.uva.nl/research/sne/nmle#>
	`
});
