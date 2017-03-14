'use strict';

angular.module('getJSONfileModule', [])

.factory('GetJSONfileService', ['$http', function($http){
  return {
    get: function(filename){
      return $http.get(filename); // this will return a promise to controller
    },

    createJsonFile(results){

      //sogg: target
      //oo: source
      //p: etichetta della relazione
      //s: istanze di una certa css_classes
      //o itanze di un altra classe
      var len = results["results"]["bindings"].length;
      var jsonNuovo = '{"links":[';


      for(var i=0; i<results["results"]["bindings"].length; i++){

        jsonNuovo += '{"source": "' +results["results"]["bindings"][i]['oo']['value']+
                     '", "target": "' +results["results"]["bindings"][i]['sogg']['value']+
                     '", "label": "' +results["results"]["bindings"][i]['p']['value']+
                     '"}';
        if(i != len-1){
          jsonNuovo += ", \n"
        }
      }
      jsonNuovo += '], \n "nodes":[';
      var subj = [];
      subj.push(results["results"]["bindings"][0]["s"]['value']);
      var photoUrl = "";
      if(results["results"]["bindings"][0]['photoSogg']!=undefined){
        photoUrl = results["results"]["bindings"][0]['photoSogg']["value"];
      }
      jsonNuovo += '{"id": "' +results["results"]["bindings"][0]['sogg']['value']+
                   '", "label": "' +results["results"]["bindings"][0]['s']['value']+
                   '", "photoUrl": "' +photoUrl+
                   '"},\n';
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
                       '", "photoUrl": "' +photoUrl+
                       '"},\n';
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
                   '", "photoUrl": "' +photoUrl+
                   '"},\n';
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
          }
          var photoUrl = "";
          if(results["results"]["bindings"][i]['photoOO']!=undefined){
            photoUrl = results["results"]["bindings"][i]['photoOO']['value'];
          }
          jsonNuovo += '{"id": "' +results["results"]["bindings"][i]['oo']['value']+
                       '", "label": "' +results["results"]["bindings"][i]['o']['value']+
                       '", "photoUrl": "' +photoUrl+
                       '"}\n';
          subj2.push(results["results"]["bindings"][i]["o"]['value']);
        }
      }
      jsonNuovo += "]}";

      //localStorage.setItem('jsonGraph', JSON.stringify(jsonNuovo));
      //return JSON.parse(localStorage.getItem('jsonGraph'));
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
