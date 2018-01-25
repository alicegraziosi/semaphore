'use strict';

var customiseModule = angular.module('customiseModule', ['color.picker', 'angular-loading-bar']);

customiseModule.config(['$routeProvider', function($routeProvider) {

  /*
    attenzione!! se il controller è specificato nel config della route allora non bisogna
    scriverlo anche nel html altrimenti viene richiamato due volte!!
  */

  $routeProvider
    .when(
      '/customise', {
        templateUrl: '/customise/customiseModal.html',
        controller: 'customiseModalCtrl'
      });

  }]);

  customiseModule.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Custom Loading Message...</div>';
    cfpLoadingBarProvider.latencyThreshold = 0;
  }]);

 customiseModule.service('fileUpload', ['$http', '$q', function ($http, $q) {
    this.uploadFileToUrl = function(file, uploadUrl){
       var deferred = $q.defer();
       var formData = new FormData();
       formData.append('file', file);
       $http({
            url: uploadUrl,
            method: "POST",
            data: formData,
            headers: {'Content-Type': undefined}
       })
       .then(function(response) {
          /*
          var data = response.data;
          */
          deferred.resolve(response);
       })
       .catch(function onError(response) {
          // Handle error
          /*
          var data = response.data;
          var status = response.status;
          var statusText = response.statusText;
          var headers = response.headers;
          var config = response.config;
          */
          deferred.reject(response);
        });
       return deferred.promise;
    }
 }]);

customiseModule.controller('customiseCtrl', ['$scope', '$rootScope', '$http', 'fileUpload', 'cfpLoadingBar',
   function($scope, $rootScope, $http, fileUpload, cfpLoadingBar){

    $('.ui.modal').modal('allowMultiple', false);
    $('.ui.modal').modal('hide all');

    // https://stackoverflow.com/questions/29893496/angular-save-scope-value-to-variable-but-not-update-it-when-scope-updates
    $scope.localdataInfo = angular.copy($rootScope.dataInfo);

    var location = window.location.href;
    var defaultPath = "images/";
    var defaultImageName = "default.png";
    $scope.image1src = defaultPath + defaultImageName;
    $scope.image2src = defaultPath + defaultImageName;
    $scope.image3src = defaultPath + defaultImageName;
    $scope.imageDefault = defaultPath + defaultImageName;

    $scope.showSuccessMessage = false;
    $scope.showErrorMessage = false;

    $scope.applyAndCloseModal = function(){
      // apply changes
      $rootScope.dataInfo = angular.copy($scope.localdataInfo);
    };

    // close all modal (si sovrappongono in semantic ui)
    $scope.closeModal = function(){
      $('.ui.modal').modal('hide all');
    };

    $scope.restoreDefault = function(){
      $scope.localdataInfo = angular.copy($rootScope.dataInfo);
    };

    $scope.uploadFile1 = function(){
       $scope.showSuccessMessage = false;
       $scope.showErrorMessage = false;
       // file e route
       var file = document.getElementById('file1').files[0];
       var uploadUrl = "fileUpload";
       var promise = fileUpload.uploadFileToUrl(file, uploadUrl);
       promise.then(function(res) {
         $scope.image1src = defaultPath + res.data.path;
         $scope.localdataInfo.classe.photo = $scope.image1src;
         $scope.showSuccessMessage = true;
       })
       .catch(function(res){
         $scope.showErrorMessage = true;
       });
    };

    $scope.uploadFile2 = function(){
       $scope.showSuccessMessage = false;
       $scope.showErrorMessage = false;
       // file e route
       var file = document.getElementById('file2').files[0];
       var uploadUrl = "fileUpload";
       var promise = fileUpload.uploadFileToUrl(file, uploadUrl);
       promise.then(function(res) {
         $scope.image2src = defaultPath + res.data.path;
         $scope.localdataInfo.objPropClasse.photo = $scope.image2src;
         $scope.showSuccessMessage = true;
       });
    };

    $scope.uploadFile3 = function(){
       $scope.showSuccessMessage = false;
       $scope.showErrorMessage = false;
       // file e route
       var file = document.getElementById('file3').files[0];
       var uploadUrl = "fileUpload";
       var promise = fileUpload.uploadFileToUrl(file, uploadUrl);
       promise.then(function(res) {
         $scope.image3src = defaultPath + res.data.path;
         $scope.localdataInfo.objPropObj.photo = $scope.image3src;
         $scope.showSuccessMessage = true;
       });
    };

}]);
