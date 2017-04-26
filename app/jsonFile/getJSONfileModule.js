'use strict';

angular.module('getJSONfileModule', [])

.factory('GetJSONfileService', ['$http', function($http){
    var get = function(filename){
      return $http.get(filename); // this will return a promise to controller
    }

    var createJsonFile = function(data){
      //sogg: target (BAND)
      //oo: source
      //p: etichetta della relazione
      //s: istanze di una certa css_classes
      //o itanze di un altra classe
      var dataLength = data.length;
      var nodeLiteral = '"nodeLiteral":[';
      var linksToLiterals = '"linksToLiterals":[';

      // links (normali)
      var jsonNuovo = '{"links":[';
      var links = [];
      for(var i=0; i<dataLength; i++){
        var entryLink = '{"source": "' + data[i]['oo']['value'] +
                     '", "target": "' + data[i]['sogg']['value'] +
                     '", "type": "' + data[i]['p']['value'] +
                     '", "label": "'+ data[i]['p']['value'] +'"}';
        links.push(entryLink);
      }

      var uniqueLinks = links.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
      });

      for(var i=0; i<uniqueLinks.length; i++){
        jsonNuovo += uniqueLinks[i];
        if(i != uniqueLinks.length-1){
          jsonNuovo += ", \n"
        }
      }
      // nodes
      jsonNuovo += '], \n "nodes":[';
      var subj = [];
      subj.push(data[0]["soggLabel"]['value']);
      var photoUrl = "";
      if(data[0]['photoSogg']!=undefined){
        photoUrl = data[0]['photoSogg']["value"];
      }
      jsonNuovo += '{"id": "' + data[0]['sogg']['value'] +
                   '", "label": "' + data[0]['soggLabel']['value'] +
                   '", "customProperties":[{"type":"photoUrl", "value":"'+photoUrl+'"}], "group": "1", "type": "'+ data[i]['p']['value'] + '" ' +
                   '},\n';
      for(var i=0; i<dataLength; i++){
        var bool = false;
        for(var j=0; j<subj.length; j++){
          if(data[i]["soggLabel"]['value'] != subj[j]){
            bool=true;
          }else{
            bool=false;
            break;
          }
        }
        if (bool==true){
          var photoUrl = "";
          if(data[i]['photoSogg']!=undefined){
            photoUrl = data[i]['photoSogg']['value'];
          }
          jsonNuovo += '{"id": "' + data[i]['sogg']['value']+
                       '", "label": "' + data[i]['soggLabel']['value']+
                       '", "customProperties":[{"type":"photoUrl", "value":"'+photoUrl+'"}], "group": "1", "type": "'+ data[i]['p']['value']  + '" ' +
                       '},\n';
            subj.push( data[i]["soggLabel"]['value']);
        }
      }

      // nodi (object property della classe iniziale)
      var subj2 = [];
      subj2.push(data[0]["ooLabel"]['value']);
      var photoUrl = "";
      if(data[0]['photoOO']!=undefined){
        photoUrl =  data[0]['photoOO']['value'];
      }
      jsonNuovo += '{"id": "' + data[0]['oo']['value']+
                   '", "label": "' + data[0]['ooLabel']['value']+
                   '", "type": "' + data[0]['ooPropUri0']['value']+
                   '", "customProperties":[{"type":"photoUrl", "value":"'+photoUrl+'"}], "group": "2"},\n';

      nodeLiteral += '{"id": "0", "label":"' +  data[0]['ooPropUri0']['value'] + '", "group": "3", "type": "year"},\n';
      linksToLiterals += '{"target": "0", "source":"' +  data[0]['oo']['value'] + '", "type": "year", "label":"year"},\n';

      nodeLiteral += '{"id": "'+ dataLength+1 +'", "label":"' +  data[0]['ooPropLabel1']['value'] + '", "group": "4", "type": "birth place"},\n';
      linksToLiterals += '{"target": "'+ dataLength+1 +'", "source":"' +  data[0]['oo']['value'] + '", "label": "birth place", "type": "birth place"},\n';

      var ultimoIndice = 0;
      for(var i=0; i< dataLength; i++){
        var bool = false;
        for(var j=0; j<subj2.length; j++){
          if( data[i]["ooLabel"]['value'] != subj2[j]){
            bool=true;
          }else{
            bool=false;
            break;
          }
        }
        if (bool==true){
          if (i>1){
            jsonNuovo += ",\n";
            nodeLiteral += ",\n";
            linksToLiterals += ",\n";
          }
          var photoUrl = "";
          if( data[i]['photoOO']!=undefined){
            photoUrl =  data[i]['photoOO']['value'];
          }
          jsonNuovo += '{"id": "' + data[i]['oo']['value']+
                       '", "label": "' + data[i]['ooLabel']['value']+
                       '", "customProperties":[{"type":"photoUrl", "value":"'+photoUrl+'"}], "group": "2", "type":"' + data[i]['p']['value']  + '"' +
                       '}\n';
          nodeLiteral += '{"id": "' + i + '", "label":"' +  data[i]['ooPropUri0']['value'] + '", "group": "3", "type": "year"},\n';
          linksToLiterals += '{"target": "' + i +'", "source":"' +  data[i]['oo']['value'] + '", "label": "year", "type": "year"},\n';

          var index = 0+dataLength+1+i;

          nodeLiteral += '{"id": "' + index + '", "label":"' +  data[i]['ooPropLabel1']['value'] + '", "group": "4", "type": "birth place"}\n';
          linksToLiterals += '{"target": "'+ index +'", "source":"' +  data[i]['oo']['value'] + '", "label": "birth place", "type":"birth place"}\n';

          subj2.push(data[i]["ooLabel"]['value']);
          ultimoIndice = index;
        }
      }
      console.log("ultimo indice" + ultimoIndice);

      /*
      for(var i=0; i<dataLength; i++){
        var soggPropLabel0 = "";
        if(data[i]['soggPropLabel0']!=undefined){
          soggPropLabel0 =  data[i]['soggPropLabel0']['value'];
        }
      nodeLiteral += ', {"id": "' + ultimoIndice+1 + '", "label":"' +  soggPropLabel0 + '", "group": "4", "type": "' + data[i]['soggPropUri0']['value'] + '"}\n';
      linksToLiterals += ' , {"target": "'+ ultimoIndice+1 +'", "source":"' +  data[i]['sogg']['value'] + '", "label": "'+ data[i]['soggPropUri0']['value'] +'", "type":"'+ data[i]['soggPropUri0']['value'] +'"}\n';
      }*/

      jsonNuovo += "],";
      linksToLiterals += "],";
      nodeLiteral += "]}";
      jsonNuovo += linksToLiterals;
      jsonNuovo += nodeLiteral;

      return JSON.parse(jsonNuovo);
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
