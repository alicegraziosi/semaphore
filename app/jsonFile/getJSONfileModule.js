'use strict';

angular.module('getJSONfileModule', [])

.factory('GetJSONfileService', ['$http', function($http){
  return {
    get: function(filename){
      return $http.get(filename); // this will return a promise to controller
    },

    createJsonFile(results){
      //sogg: target (BAND)
      //oo: source
      //p: etichetta della relazione
      //s: istanze di una certa css_classes
      //o itanze di un altra classe
      var len = results["results"]["bindings"].length;
      var nodeLiteral = '"nodeLiteral":[';
      var linksToLiterals = '"linksToLiterals":[';

      // links
      var jsonNuovo = '{"links":[';
      var links = [];
      for(var i=0; i<results["results"]["bindings"].length; i++){
        var entryLink = '{"source": "' +results["results"]["bindings"][i]['oo']['value']+
                     '", "target": "' +results["results"]["bindings"][i]['sogg']['value']+
                     '", "label": "' +results["results"]["bindings"][i]['p']['value']+
                     '", "type": "band"}';
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
      // nodeObject ((nodes))
      jsonNuovo += '], \n "nodes":[';
      var subj = [];
      subj.push(results["results"]["bindings"][0]["s"]['value']);
      var photoUrl = "";
      if(results["results"]["bindings"][0]['photoSogg']!=undefined){
        photoUrl = results["results"]["bindings"][0]['photoSogg']["value"];
      }
      jsonNuovo += '{"id": "' +results["results"]["bindings"][0]['sogg']['value']+
                   '", "label": "' +results["results"]["bindings"][0]['s']['value']+
                   '", "customProperties":[{"type":"photoUrl", "value":"'+photoUrl+'"}], "group": "1", "type": "band"'+
                   '},\n';
      for(var i=0; i<results["results"]["bindings"].length; i++){
        var bool = false;
        for(var j=0; j<subj.length; j++){
          if(results["results"]["bindings"][i]["s"]['value'] != subj[j]){
            bool=true;
          }else{
            bool=false;
            break;
          }
        }
        if (bool==true){
          var photoUrl = "";
          if(results["results"]["bindings"][i]['photoSogg']!=undefined){
            photoUrl = results["results"]["bindings"][i]['photoSogg']['value'];
          }
          jsonNuovo += '{"id": "' +results["results"]["bindings"][i]['sogg']['value']+
                       '", "label": "' +results["results"]["bindings"][i]['s']['value']+
                       '", "customProperties":[{"type":"photoUrl", "value":"'+photoUrl+'"}], "group": "1", "type": "band"'+
                       '},\n';
            subj.push(results["results"]["bindings"][i]["s"]['value']);
        }
      }

      var subj2 = [];
      subj2.push(results["results"]["bindings"][0]["o"]['value']);
      var photoUrl = "";
      if(results["results"]["bindings"][0]['photoOO']!=undefined){
        photoUrl = results["results"]["bindings"][0]['photoOO']['value'];
      }
      jsonNuovo += '{"id": "' +results["results"]["bindings"][0]['oo']['value']+
                   '", "label": "' +results["results"]["bindings"][0]['o']['value']+
                   '", "type": "' +results["results"]["bindings"][0]['year']['value']+
                   '", "customProperties":[{"type":"photoUrl", "value":"'+photoUrl+'"}], "group": "2"},\n';
      nodeLiteral += '{"id": "0", "label":"' + results["results"]["bindings"][0]['year']['value'] + '", "group": "3", "type": "year"},\n';
      linksToLiterals += '{"target": "0", "source":"' + results["results"]["bindings"][0]['oo']['value'] + '", "type": "year", "label":"year"},\n';

      var leng = results["results"]["bindings"].length;

      nodeLiteral += '{"id": "'+ leng+1 +'", "label":"' + results["results"]["bindings"][0]['birthLabel']['value'] + '", "group": "4", "type": "birth place"},\n';
      linksToLiterals += '{"target": "'+ leng+1 +'", "source":"' + results["results"]["bindings"][0]['oo']['value'] + '", "label": "birth place", "type": "birth place"},\n';

      for(var i=0; i<results["results"]["bindings"].length; i++){
        var bool = false;
        for(var j=0; j<subj2.length; j++){
          if(results["results"]["bindings"][i]["o"]['value'] != subj2[j]){
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
          if(results["results"]["bindings"][i]['photoOO']!=undefined){
            photoUrl = results["results"]["bindings"][i]['photoOO']['value'];
          }
          jsonNuovo += '{"id": "' +results["results"]["bindings"][i]['oo']['value']+
                       '", "label": "' +results["results"]["bindings"][i]['o']['value']+
                       '", "customProperties":[{"type":"photoUrl", "value":"'+photoUrl+'"}], "group": "2", "type":"band member"'+
                       '}\n';
          nodeLiteral += '{"id": "' + i + '", "label":"' + results["results"]["bindings"][i]['year']['value'] + '", "group": "3", "type": "year"},\n';
          linksToLiterals += '{"target": "' + i +'", "source":"' + results["results"]["bindings"][i]['oo']['value'] + '", "label": "year", "type": "year"},\n';

          var index = 0+leng+1+i;

          nodeLiteral += '{"id": "' + index + '", "label":"' + results["results"]["bindings"][i]['birthLabel']['value'] + '", "group": "4", "type": "birth place"}\n';
          linksToLiterals += '{"target": "'+ index +'", "source":"' + results["results"]["bindings"][i]['oo']['value'] + '", "label": "birth place", "type":"birth place"}\n';

          subj2.push(results["results"]["bindings"][i]["o"]['value']);
        }
      }
      jsonNuovo += "],";
      linksToLiterals += "],";
      nodeLiteral += "]}";
      jsonNuovo += linksToLiterals;
      jsonNuovo += nodeLiteral;

      return JSON.parse(jsonNuovo);
    }
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
