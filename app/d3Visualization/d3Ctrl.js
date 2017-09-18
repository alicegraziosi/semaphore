'use strict';

angular.module('myApp.d3view', ['d3Module', 'getJSONfileModule', 'ngRoute', 'contactEndpointModule'])

.config(['$routeProvider', function($routeProvider) {

  /*
    attenzione!! se il controller è specificato nel config della route allora non bisogna
    scriverlo anche nel html altrimenti viene richiamato due volte!!
  */

  $routeProvider
    .when(
      '/graph', {
        templateUrl: 'd3Visualization/d3GraphView.html',
        controller: 'D3viewCtrl'
      })
    .when(
      '/cluster', {
      templateUrl: 'd3Visualization/d3ClusterView.html',
      controller: 'D3viewCtrl'
    })
    .when(
      '/barchart', {
      templateUrl: 'd3Visualization/d3BarChartView.html',
      controller: 'D3viewCtrl'
    });
}])
.controller('D3viewCtrl',
  function($rootScope, $scope, $http, queryDatasetService, GetJSONfileService, $q, ContactSPARQLendpoint, d3Service) {

    $rootScope.selectedEndpointUrl = "https://dbpedia.org/sparql";
    $rootScope.selectedEndpointName = "DBpedia";
    $rootScope.selectedGraph = "default";

    // wait for all promises
    $q.all([
      queryDatasetService.queryDataset(),
      queryDatasetService.queryDatasetLiteralBand()
    ]).then(function(data) {
        var graph = GetJSONfileService.createJsonFile(data[0].results.bindings);
        var graph2 = GetJSONfileService.createNodeLiteral(data[1].results.bindings, "soggPropLabel");

        $rootScope.nodeLabels = [];
        graph2.nodes.forEach(function(node){
          graph.nodes.push(node);
          $rootScope.nodeLabels.push(node.label)
        });
        graph2.links.forEach(function(l){
          graph.links.push(l);
        });
        graph2.linksToLiterals.forEach(function(ltl){
          graph.linksToLiterals.push(ltl);
        });
        graph2.nodeLiteral.forEach(function(nl){
          graph.nodeLiteral.push(nl);
        });
        $rootScope.graph = graph;
        $rootScope.nodeLabels = $rootScope.nodeLabels.sort();

        /*
        $rootScope.dataInfo = {
          headClass : {
            uri : 'http://dbpedia.org/ontology/Band',
            label : 'Band',
            type: "obj"
          },
          litPropHeadClass: [
            {uri : 'http://dbpedia.org/property/genre',
             label : 'genre',
             type : 'lit'},
            {uri : 'http://dbpedia.org/property/yearsActive',
             label : 'years active',
             type : 'lit'}
          ],
          objPropHeadClass: [
            {uri: 'http://dbpedia.org/ontology/formerBandMember',
             label : 'former band member',
             type : 'obj'},
            {uri: 'http://dbpedia.org/ontology/bandMember',
             label : 'band member',
             type : 'obj'}
          ]
        }*/



        $rootScope.dataInfo = {
          classe : {
            uri : 'http://dbpedia.org/ontology/Band',
            label : 'Band',
            type : "obj",
            color : '1'
          },
          litPropClasse: [
            {
              uri : 'http://dbpedia.org/property/genre',
              label : 'genre',
              type : 'lit',
              color : ''
            }
          ],
          objPropClasse:
            {uri : 'http://dbpedia.org/ontology/bandMember',
             label : 'band member',
             type : 'obj'}
          ,
          litPropObj: [
            {uri : 'http://dbpedia.org/property/yearsActive',
             label : 'years active',
             type : 'lit'}
          ],
          objPropObj: [
            {
              uri : '',
              label : '',
              type : '',
              color : ''
            }
          ]
        };

        $scope.dataInfo = $rootScope.dataInfo;
        $scope.info = $rootScope.info;

        $scope.clusterClasse = $rootScope.dataInfo.classe;
        $scope.litPropClasse = $rootScope.dataInfo.litPropClasse;
        $scope.clusterObj = $rootScope.dataInfo.objPropClasse;
        $scope.litPropObj = $rootScope.dataInfo.litPropObj;
        $scope.objPropObj = $rootScope.dataInfo.objPropObj;

        /*
        $scope.selectedClusterOption =
          {uri : 'http://dbpedia.org/property/genre',
             label : 'genre',
             type : 'lit'};
        */

    });


    $rootScope.$watch('graph', function(graph, graphold) {
      $scope.graph = $rootScope.graph;

      $rootScope.nodeLabels = [];
      if($scope.graph != undefined){
        $scope.graph.nodes.forEach(function(node){
          $rootScope.nodeLabels.push(node.label)
        });
        $scope.nodeLabels = $scope.nodeLabels.sort();
      }
      $scope.nodeLabels = $rootScope.nodeLabels;
    }, true);


    $rootScope.$watch('dataInfo', function(dataInfo) {
      $scope.dataInfo = $rootScope.dataInfo;
      console.log("controller datainfo changed" + $scope.dataInfo);
    });

    $rootScope.$watch('info', function(info) {
      $scope.info = $rootScope.info;
      console.log("controller info changed" + $scope.info);
    });

    $scope.selected = " ";

    $rootScope.$watch('prefixes', function(prefixes) {
      $scope.prefixes = $rootScope.prefixes;
    });

    $scope.exportJSON = function () {
      console.log('"Export as JSON" button clicked');
      console.log($rootScope.graph);

      // In an HTTP POST request, the parameters are not sent along with the URI.
      $http({
          method: 'POST',
          url: 'http://localhost:8080/api/savetofile',
          // url: 'http://eelst.cs.unibo.it:8092/api/savetofile',
          // use $.param jQuery function to serialize data from JSON
          data: $.param($rootScope.graph),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}

      }).then(
        function(response){
          // success callback
          var filename = response.data;
          window.open('http://localhost:8080/api/download?filename='+filename);
        },
        function(response){
          // failure callback
          console.log('ERROR: could not download file');
        }
      );
    };

    $scope.exportPNG = function(){
      d3Service.then(function(d3) {
        var svg = d3.select("svg");

    	var svgString = getSVGString(svg.node());
    	svgString2Image( svgString, 2*960, 2*800, 'png', save ); // passes Blob and filesize String to the callback

    	function save( dataBlob, filesize ){
    		saveAs( dataBlob, 'gigVisualisation.png' ); // FileSaver.js function
    	};

      });
    };

    // Below are the functions that handle actual exporting:
    // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
    function getSVGString(svgNode) {
    	svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    	var cssStyleText = getCSSStyles( svgNode );
    	appendCSS( cssStyleText, svgNode );

    	var serializer = new XMLSerializer();
    	var svgString = serializer.serializeToString(svgNode);
    	svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    	svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    	return svgString;
    };

  	function getCSSStyles( parentElement ) {
    		var selectorTextArr = [];

    		// Add Parent element Id and Classes to the list
    		selectorTextArr.push( '#'+parentElement.id );
    		for (var c = 0; c < parentElement.classList.length; c++)
    				if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
    					selectorTextArr.push( '.'+parentElement.classList[c] );

    		// Add Children element Ids and Classes to the list
    		var nodes = parentElement.getElementsByTagName("*");
    		for (var i = 0; i < nodes.length; i++) {
    			var id = nodes[i].id;
    			if ( !contains('#'+id, selectorTextArr) )
    				selectorTextArr.push( '#'+id );

    			var classes = nodes[i].classList;
    			for (var c = 0; c < classes.length; c++)
    				if ( !contains('.'+classes[c], selectorTextArr) )
    					selectorTextArr.push( '.'+classes[c] );
    		}

    		// Extract CSS Rules
    		var extractedCSSText = "";
    		for (var i = 0; i < document.styleSheets.length; i++) {
    			var s = document.styleSheets[i];

    			try {
    			    if(!s.cssRules) continue;
    			} catch( e ) {
    		    		if(e.name !== 'SecurityError') throw e; // for Firefox
    		    		continue;
    		    	}

    			var cssRules = s.cssRules;
    			for (var r = 0; r < cssRules.length; r++) {
    				if ( contains( cssRules[r].selectorText, selectorTextArr ) )
    					extractedCSSText += cssRules[r].cssText;
    			}
    		}


    		return extractedCSSText;
      }

    		function contains(str,arr) {
    			return arr.indexOf( str ) === -1 ? false : true;
    		}

    	function appendCSS( cssText, element ) {
    		var styleElement = document.createElement("style");
    		styleElement.setAttribute("type","text/css");
    		styleElement.innerHTML = cssText;
    		var refNode = element.hasChildNodes() ? element.children[0] : null;
    		element.insertBefore( styleElement, refNode );
    	}


    function svgString2Image( svgString, width, height, format, callback ) {
    	var format = format ? format : 'png';

    	var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

    	var canvas = document.createElement("canvas");
    	var context = canvas.getContext("2d");

    	canvas.width = width;
    	canvas.height = height;

    	var image = new Image();
    	image.onload = function() {
    		context.clearRect ( 0, 0, width, height );
    		context.drawImage(image, 0, 0, width, height);

    		canvas.toBlob( function(blob) {
    			var filesize = Math.round( blob.length/1024 ) + ' KB';
    			if ( callback ) callback( blob, filesize );
    		});


    	};

  	  image.src = imgsrc;
    }

    // fine download png

    $scope.selectNodeLabel = function(label) {
        $scope.selectedNodeLabel = label;
    };

    $scope.dropdown = function(){
      $('.ui.dropdown').dropdown();
    };

    $scope.searchNode = function(){
      console.log('"searchNode" button clicked');
    };

    $scope.menuItemClick = function(){
      console.log('"menuItemClick" button clicked');
    };

    $scope.toggleSelectionClusterOption = function toggleSelection(selectedClusterOption) {
        $scope.selectedClusterOption = selectedClusterOption;
    };

    // opzioni di visualizzazione (shape)
    $scope.selectObjectShape = function(shape) {
      $scope.objectShape = shape;
    };

    $scope.selectDataTypeShape = function(shape) {
      $scope.datatypeShape = shape;
    };
});
