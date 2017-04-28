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
        linksObj.push(link);
      });
      // nodi
      var nodesObj = [];
      var nodesArray = [];
      data.forEach(function(d){
        if (nodesArray.indexOf(d.sogg.value)==-1){
          nodesArray.push(d.sogg.value);

          var node = {
            id: d.sogg.value,
            label: d.soggLabel.value,
            type: d.soggType.value,//type: d.ooLabel.value,
            group: 1,
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
          nodesArray.push(d.oo.value);
          // node object property della classe scelta
          var node = {
            id: d.oo.value,
            label: d.ooLabel.value,
            type: d.p.value,//type: d.ooLabel.value,
            group: 2,
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
      data.forEach(function(d, index){
        // proprietà literal della classe scelta
        var soggproplabel0 = "";
        if(d.soggPropLabel0 !== undefined){
          soggproplabel0 = d.soggPropLabel0.value;
        }
        var literalNode = {
          id: "soggPropUri0"+index,
          label: soggproplabel0,
          type: d.propType.value,
          group: 3
        }
        literalNodesObj.push(literalNode);

        var linkToLiteral = {
          target: "soggPropUri0"+index,
          source: d.sogg.value,
          type: d.propType.value,
          label: d.propType.value
        }
        if (_.findWhere(linksToLiteralsObj, linkToLiteral) == null) {
            linksToLiteralsObj.push(linkToLiteral);
        }
        //linksToLiteralsObj.push(linkToLiteral);

        // proprietà literal delle object property della classe scellta
        var ooproplabel = "";
        if(d.ooPropUri0 !== undefined){
          ooproplabel = d.ooPropUri0.value;
        }
        var literalNode = {
          id: "ooPropUri0"+index,
          label: ooproplabel,
          type: d.ooPropType0.value,
          group: 3
        }
        literalNodesObj.push(literalNode);

        var linkToLiteral = {
          target: "ooPropUri0"+index,
          source: d.oo.value,
          type: d.ooPropType0.value,
          label: d.ooPropType0.value
        }
        linksToLiteralsObj.push(linkToLiteral);
      });

      var jsonData = {
        nodes : nodesObj,
        linksToLiterals : linksToLiteralsObj,
        nodeLiteral : literalNodesObj,
        links : linksObj
      }
      return jsonData;
  }

  var createNodeLiteral = function(data){
    // nodi
    var nodesObj = [];
    var nodesArray = [];
    data.forEach(function(d){
      if (nodesArray.indexOf(d.sogg.value)==-1){
        nodesArray.push(d.sogg.value);
        var node = {
          id: d.sogg.value,
          label: d.soggLabel.value,
          type: d.soggType.value,
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
    data.forEach(function(d, index){
      var literalNode = {
        id: "soggPropUri0"+index,
        label: d.soggPropLabel0.value,
        type: d.propType.value
      }
      literalNodesObj.push(literalNode);

      var linkToLiteral = {
        target: "soggPropUri0"+index,
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
    // nodi
    var nodesObj = [];
    var nodesArray = [];
    data.forEach(function(d){
      if (nodesArray.indexOf(d.sogg.value)==-1){
        nodesArray.push(d.sogg.value);
        var node = {
          id: d.sogg.value,
          label: d.soggLabel.value,
          type: d.soggType.value,
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
        // nod object property della classe scelta
        nodesArray.push(d.oo.value);
        var node = {
          id: d.oo.value,
          label: d.ooLabel.value,
          type: d.ooLabel.value,
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
      linksObj.push(link);
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

  return {
    get: get,
    createJsonFile: createJsonFile,
    createNodeLiteral: createNodeLiteral,
    createNodeObject: createNodeObject
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
