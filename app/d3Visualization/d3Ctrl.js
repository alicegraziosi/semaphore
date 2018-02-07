'use strict';

angular.module('myApp.d3view', ['d3Module', 'getJSONfileModule', 'ngRoute', 'contactEndpointModule', 'angularModalService'])

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
  function($rootScope, $scope, $http, queryDatasetService, GetJSONfileService, $q, ContactSPARQLendpoint, d3Service, ModalService) {

    $scope.checkboxModel = {
      value1 : true,
      value2 : true,
      value3 : true,
      value4 : true,
      value5 : true
    };

    //$scope.showLoader = true;

      if($rootScope.dataInfo == undefined){
        // INFORMAZIONI TBox

        $scope.dataInfoInit = {
          classe : {
            uri : 'http://dbpedia.org/ontology/Band',
            label : 'Band',
            type : "obj",
            group: 1,
            color :'#1f77b4',
            photo : ''
          },
          litPropClasse: {
            uri : 'http://dbpedia.org/property/genre',
            label : 'genre',
            type : 'lit',
            group: 2,
            color : '#ff7f0e'
          },
          objPropClasse: {
            uri : 'http://dbpedia.org/ontology/formerBandMember',
            label : 'former band member',
            type : 'obj',
            group: 3,
            color :  '#2ca02c',
            photo : ''
          },
          litPropObj: {
            uri : 'http://dbpedia.org/property/yearsActive',
            label : 'years active',
            type : 'lit',
            group: 4,
            color : '#d62728',
            range: 'former band member'
          },
          objPropObj: {
            uri : ' ',
            label : ' ',
            type : 'obj',
            group: 5,
            color : '#9467bd',
            range: 'former band member',
            photo : ''
          }
        };

        $rootScope.dataInfo = $scope.dataInfoInit;
      };

    $scope.selectedEndpointUrl = "https://dbpedia.org/sparql";
    $scope.selectedEndpointName = "DBpedia";
    $scope.selectedGraph = "http://dbpedia.org";

    $scope.showPhoto = {
       value: 'true'
    };


    $rootScope.$watch(function() {
      return $rootScope.selectedEndpointUrl;
    }, function() {
      if($rootScope.selectedEndpointUrl != ""){
        $scope.selectedEndpointUrl = $rootScope.selectedEndpointUrl;
      }
    });

    $rootScope.$watch(function() {
      return $rootScope.selectedEndpointName;
    }, function() {
      if($rootScope.selectedEndpointName != ""){
        $scope.selectedEndpointName = $rootScope.selectedEndpointName;
      }
    });

    $rootScope.$watch(function() {
      return $rootScope.selectedGraph;
    }, function() {
      if($rootScope.selectedGraph != ""){
        $scope.selectedGraph = $rootScope.selectedGraph;
      }
    });


    $rootScope.$watch('graph', function(graph) {
      if($rootScope.graph == undefined){

        $scope.checkboxModel = {
          value1 : true,
          value2 : true,
          value3 : true,
          value4 : true,
          value5 : true
        };

        // wait for all promises
        $q.all([
          queryDatasetService.queryDataset(),
          queryDatasetService.queryDatasetLiteralBand()
        ]).then(function(data) {
            var graph1 = GetJSONfileService.createJsonFile(data[0].results.bindings);
            var graph2 = GetJSONfileService.createNodeLiteral(data[1].results.bindings, "soggPropLabel");

            $rootScope.nodeLabels = [];
            graph2.nodes.forEach(function(node){
              graph1.nodes.push(node);
              $rootScope.nodeLabels.push(node.label)
            });
            graph2.links.forEach(function(l){
              graph1.links.push(l);
            });
            graph2.linksToLiterals.forEach(function(ltl){
              graph1.linksToLiterals.push(ltl);
            });
            graph2.nodeLiteral.forEach(function(nl){
              graph1.nodeLiteral.push(nl);
            });
            graph1.dataInfo =  $rootScope.dataInfo;
            $rootScope.graph = graph1;
            $scope.graph = $rootScope.graph;
            $rootScope.nodeLabels = $rootScope.nodeLabels.sort();

            $scope.clusterClasse = $rootScope.dataInfo.classe;
            $scope.litPropClasse = $rootScope.dataInfo.litPropClasse;
            $scope.clusterObj = $rootScope.dataInfo.objPropClasse;
            $scope.litPropObj = $rootScope.dataInfo.litPropObj;
            $scope.objPropObj = $rootScope.dataInfo.objPropObj;

            $scope.c = $rootScope.dataInfo.classe.label;
            $scope.toggleSelectionClusterOption($scope.c, $scope.litPropClasse);

        });

      } else {
        $scope.graph = angular.copy($rootScope.graph);
        // photo

        var temp =  angular.copy($scope.graph);
        temp.nodes.forEach(function(node){
          var promise = queryDatasetService.queryPhotoFromDB($scope.selectedEndpointUrl, $scope.selectedGraph, node.id);
          promise.then(function(response) {
            var photoUrl = "";
            if(response.data.results.bindings[0] != undefined){
              photoUrl = response.data.results.bindings[0].photoUrl.value;
            }
            node.customProperties[0].value = photoUrl;
          });
        });

        $scope.graph = temp;

        $rootScope.nodeLabels = [];
        if($scope.graph != undefined){
          $scope.graph.nodes.forEach(function(node){
            $rootScope.nodeLabels.push(node.label)
          });
          $scope.nodeLabels = $scope.nodeLabels.sort();
        }
        $scope.nodeLabels = $rootScope.nodeLabels;

        $rootScope.graph = $scope.graph;
      }


      $scope.c = $rootScope.dataInfo.classe.label;
      $scope.toggleSelectionClusterOption($scope.c, $scope.litPropClasse);
    }, true);

      $rootScope.$watch('dataInfo', function(dataInfo, dataInfoOld) {

        $scope.dataInfo = $rootScope.dataInfo;
        //$scope.dataInfo = angular.copy($rootScope.dataInfo);

        $scope.clusterClasse = $rootScope.dataInfo.classe;
        $scope.litPropClasse = $rootScope.dataInfo.litPropClasse;
        $scope.clusterObj = $rootScope.dataInfo.objPropClasse;
        $scope.litPropObj = $rootScope.dataInfo.litPropObj;
        $scope.objPropObj = $rootScope.dataInfo.objPropObj;


        $scope.graph.dataInfo =  $rootScope.dataInfo;
        console.log("I see a dataaaaaaaa change!1");
      }, true);

    $scope.selected = " ";

    $rootScope.$watch('prefixes', function(prefixes) {
      $scope.prefixes = $rootScope.prefixes;
    });

    $scope.exportJSON = function () {
        GetJSONfileService.exportJSON($rootScope.graph);
    };

    $scope.importJSON = function () {
        GetJSONfileService.importJSON();
        $scope.fileName = document.getElementById('embedpollfileinput').files[0];
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

    // opzione cluster
    $scope.toggleSelectionClusterOption = function toggleSelection(c, clusterOption) {
        $scope.selectedClusterOption = clusterOption;
        $scope.c = c;
    };


    // opzioni di visualizzazione (shape)
    $scope.selectObjectShape = function(shape) {
      $scope.objectShape = shape;
    };

    $scope.selectDataTypeShape = function(shape) {
      $scope.datatypeShape = shape;
    };

    $scope.customise = function(){
      $('.ui.modal').modal('show');
    };

    $scope.openMenu = function(){
      $('.ui.left.sidebar').sidebar('toggle');
    };

});
