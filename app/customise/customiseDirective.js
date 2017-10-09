/* direttiva customise*/
'use strict';

var myAppd3view = angular.module('myApp.d3view');

myAppd3view.directive('customiseDirective',
  ['$rootScope', '$scope', '$window', '$parse',
  function($rootScope, $scope, $window, $parse,) {
    return{
      //restrict:'E' --> <customise-directive></customise-directive>
      //restrict:'A' --> <div d3-visualization ></div>
      //restrict:'EA' --> entrambe le forme
      restrict:'E',
      //this is important,
      replace: false,
      //<d3-visualization graph="graph"></d3-visualization> --> $scope.graph

      //The @ symbol tells angular that this is a one-way bound value
      //The = symbol tells angular that this is a two-way bound value

      scope: {
          model: "=",
          dataInfo: "="
      },

      link: function(scope, elem, attrs){
      	console.log("+++++++++"+dataInfo);
      } // chiude link
  	} // chiude return
  }]); // chiude directive
