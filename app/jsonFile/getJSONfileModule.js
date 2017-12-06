'use strict';

angular.module('getJSONfileModule', [])

.factory('GetJSONfileService', ['$http', function($http){
   var get = function(filename){
      return $http.get(filename); // this will return a promise to controller
    }

    var createJsonFile = function(data){
      var dataLength = data.length;

      //links
      var linksObj = [];
      data.forEach(function(d, index){
        var link = {
          target: d.sogg.value,
          source: d.oo.value,
          type: d.p.value,
          label: d.pLabel.value
        }
        if (_.findWhere(linksObj, link) == null) {
            linksObj.push(link);
        }
      });
      // nodi
      var nodesObj = [];
      var nodesArray = [];
      data.forEach(function(d){
        if (nodesArray.indexOf(d.oo.value)==-1){
          nodesArray.push(d.oo.value);
          // node object property della classe scelta
          var node = {
            id: d.oo.value,
            url: d.oo.value,
            label: d.ooLabel.value,
            type: d.p.value,//type: d.ooLabel.value,
            group: 3,
            shape: "circle",
            radius: 20,
            customProperties : [
              {
                type: "photoUrl",
                value: ""
              }
            ]
          }
          nodesObj.push(node);
        }
      });
      // node literal e link to node literal
      var literalNodesObj = [];
      var linksToLiteralsObj = [];
      var noDupl = [];
      data.forEach(function(d, index){
        // proprietà literal delle object property della classe scelta
        var ooproplabel = "";
        if(d.ooPropUri0 !== undefined){
          ooproplabel = d.ooPropUri0.value;
        }

        var item = {
          source: d.oo.value,
          target: ooproplabel
        }

        // per non avere duplicati nelle literal property di un nodo.
        if (_.findWhere(noDupl, item) == null) {
            noDupl.push(item);

          //linksToLiteralsObj.push(linkToLiteral);
          var literalNode = {
            id: "ooPropUri0"+index,
            label: ooproplabel,
            type: d.ooPropType0.value,
            group: 4,
            shape: "rectangle"
          }
          literalNodesObj.push(literalNode);

          var linkToLiteral = {
            target: "ooPropUri0"+index,
            source: d.oo.value,
            type: d.ooPropType0.value,
            label: d.ooPropType0.value
          }
          linksToLiteralsObj.push(linkToLiteral);
        }

      });

      var jsonData = {
        nodes : nodesObj,
        linksToLiterals : linksToLiteralsObj,
        nodeLiteral : literalNodesObj,
        links : linksObj
      }
      return jsonData;
  }

  var createNodeLiteral = function(data, label){
    // nodi
    var nodesObj = [];
    var nodesArray = [];
    // classi
    data.forEach(function(d){
      if (nodesArray.indexOf(d.sogg.value)==-1){
        nodesArray.push(d.sogg.value);
        var node = {
          id: d.sogg.value,
          label: d.soggLabel.value,
          url: d.sogg.value,
          type: d.soggType.value,
          group: 1,
          shape: "circle",
          radius: 20,
          customProperties : [
            {
              type: "photoUrl",
              value: ""
            }
          ]
        }
        nodesObj.push(node);
      }
    });
    // node literal della classe e link to node literal
    var literalNodesObj = [];
    var linksToLiteralsObj = [];
    data.forEach(function(d, index){
      var soggproplabel0 = "";
      if(d.soggPropLabel0 !== undefined){
        soggproplabel0 = d.soggPropLabel0.value;
      } else {
        soggproplabel0 = d.soggPropUri0.value;
      }
      var literalNode = {
        id: label+index, // soggPropUri0
        url: d.soggPropUri0.value, //
        label: soggproplabel0,
        type: d.propType.value,
        group: 2,
        shape: "rectangle"
      }
      literalNodesObj.push(literalNode);

      var linkToLiteral = {
        target: label+index, // soggPropUri0
        source: d.sogg.value,
        type: d.propType.value,
        label: d.propType.value
      }
      linksToLiteralsObj.push(linkToLiteral);
    });

    var jsonData = {
      nodes : nodesObj,
      linksToLiterals : linksToLiteralsObj,
      nodeLiteral : literalNodesObj,
      links : []
    }
    return jsonData;
  }

  var createNodeObject = function(data){
    // nodi classe scelta
    var nodesObj = [];
    var nodesArray = [];
    data.forEach(function(d){
      if (nodesArray.indexOf(d.sogg.value)==-1){
        nodesArray.push(d.sogg.value);
        var node = {
          id: d.sogg.value,
          label: d.soggLabel.value,
          type: d.soggType.value,
          group: 3,
          shape: "circle",
          radius: 20,
          customProperties : [
            {
              type: "photoUrl",
              value: ""
            }
          ]
        }
        nodesObj.push(node);
      }
      if (nodesArray.indexOf(d.oo.value)==-1){
        // nodi object property della classe scelta
        nodesArray.push(d.oo.value);
        var node = {
          id: d.oo.value,
          label: d.ooLabel.value,
          type: d.ooLabel.value,
          group: 3, // qui è giusto 3
          shape: "circle",
          radius: 20,
          customProperties : [
            {
              type: "photoUrl",
              value: ""
            }
          ]
        }
        nodesObj.push(node);
      }
    });
    // link
    var linksObj = [];
    data.forEach(function(d, index){
      var link = {
        target: d.sogg.value,
        source: d.oo.value,
        type: d.p.value,
        label: d.pLabel.value
      }
      if (_.findWhere(linksObj, link) == null) {
          linksObj.push(link);
      }
    });

    var jsonData = {
      nodes : nodesObj,
      linksToLiterals : [],
      nodeLiteral : [],
      links : linksObj
    }
    console.log(jsonData);
    return jsonData;
  }

  var exportJSON = function(jsonData) {
    // In an HTTP POST request, the parameters are not sent along with the URI.
    $http({
        method: 'POST',
        //url: $rootScope.jsonFileServiceUrl+"savetofile",
        url: "http://eelst.cs.unibo.it:8095/api/savetofile",
        // use $.param jQuery function to serialize data from JSON
        data: $.param(jsonData),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}

    }).then(
      function successCallback(response){
        // success callback
        var filename = response.data;
        //window.open($rootScope.jsonFileServiceUrl+"download?filename="+filename);
        window.open("http://eelst.cs.unibo.it:8095/api/download?filename="+filename);
      },
      function errorCallback(response){
        // failure callback
        console.log('ERROR: could not download file');
        if(response.status == -1){
          console.log("Prefix api service unreachable.." + response.status + "..request was aborted");
        } else {
          console.log("Prefix api service unreachable.." + response.status + ".." + response.statusText);
        }
      }
    );
  }

  return {
    get: get,
    createJsonFile: createJsonFile,
    createNodeLiteral: createNodeLiteral,
    createNodeObject: createNodeObject,
    exportJSON: exportJSON
  };
}])

.controller('JsonCtrl', function($scope, $rootScope, GetJSONfileService){
  $scope.getJSONfile = function () {
    GetJSONfileService.get($scope.filename).then(function(response) {
      var foo = response.data;
      $rootScope.foo = foo;
    });
  };
});
