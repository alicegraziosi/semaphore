'use strict';

var menuModule = angular.module('menuModule', []);

menuModule.controller('menuCtrl', ['$scope',
  function($scope) {

    $scope.gotoGraph = function(){
    	$("#menuGraph")
        .addClass('active')
        .siblings()
        .removeClass('active');
    };

    $scope.gotoCluster = function(){
      $("#menuCluster")
        .addClass('active')
        .siblings()
        .removeClass('active');
    };
  }
]);