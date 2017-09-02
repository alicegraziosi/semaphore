'use strict';

angular.module('myApp.datasetsAndGraphs', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/datasetsAndGraphs', {
    templateUrl: 'datasetsAndGraphs/datasetsAndGraphs.html',
    controller: 'DatasetsAndGraphsCtrl'
  });
}])

.controller('DatasetsAndGraphsCtrl', [function() {

	

}]);
