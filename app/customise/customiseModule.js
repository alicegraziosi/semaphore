'use strict';

var customiseModule = angular.module('customiseModule', ['color.picker', 'angular-loading-bar', 'ngFileUpload']);

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

customiseModule.controller('customiseCtrl', ['$scope', '$rootScope', '$http', 'cfpLoadingBar', 'Upload' , '$window',
   function($scope, $rootScope, $http, cfpLoadingBar, Upload, $window){

    $('.ui.modal').modal('allowMultiple', false);
    $('.ui.modal').modal('hide all');

    $scope.submit = function() {
      if ($scope.form.$valid && $scope.files) {
        $scope.upload($scope.files);
      }
    };

    // upload on file select or drop
    $scope.upload = function (file) {
        Upload.upload({
            //url: 'http://eelst.cs.unibo.it:8095/api/upload',
            //url: 'http://localhost:8095/api/upload',
            url: $rootScope.serviceUrl + "/upload",
            data: {file: file}
        }).then(function (resp) {
          resp.config.data.file.forEach(function(file) {
            console.log('Success ' + file + 'uploaded.');
          });

          $scope.showSuccessMessage = true;
          $scope.showErrorMessage = false;

          $scope.imageprova = "../images/" + resp.config.data.file[0].name;

          if(resp.config.data.file[0]){
            $scope.image1src = "../images/" + resp.config.data.file[0].name;
            $scope.localdataInfo.classe.photo = $scope.image1src;
          };

          if(resp.config.data.file[1]){
            $scope.image2src = "../images/" + resp.config.data.file[1].name;
            $scope.localdataInfo.objPropClasse.photo = $scope.image2src;
          };

          if(resp.config.data.file[2]){
            $scope.image3src = "../images/" + resp.config.data.file[2].name;
            $scope.localdataInfo.objPropObj.photo = $scope.image3src;
          }

        }, function (resp) {
            console.log('Error status: ' + resp.status);
            $scope.showSuccessMessage = false;
            $scope.showErrorMessage = true;
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };

    $rootScope.$watch('dataInfo', function(dataInfo, dataInfoOld) {
      if(dataInfo){
        $scope.localdataInfo = angular.copy($rootScope.dataInfo);
      }
    });

    var location = window.location.href;
    var defaultPath = "../images/";
    var defaultImageName = "default.png";
    $scope.image1src = defaultPath + defaultImageName;
    $scope.image2src = defaultPath + defaultImageName;
    $scope.image3src = defaultPath + defaultImageName;
    $scope.imageDefault = defaultPath + defaultImageName;

    $rootScope.$watch('dataInfo', function(dataInfo, dataInfoOld) {
      if(dataInfo){
        $scope.localdataInfo = angular.copy($rootScope.dataInfo);
      }
    });

    $scope.showSuccessMessage = false;
    $scope.showErrorMessage = false;

    $scope.applyAndCloseModal = function(){
      // apply changes
      $rootScope.dataInfo = angular.copy($scope.localdataInfo);
      $scope.closeModal();
    };

    // close all modal (si sovrappongono in semantic ui)
    $scope.closeModal = function(){
      $scope.showSuccessMessage = false;
      $scope.showErrorMessage = false;
      $('.ui.modal').modal('hide all');
    };

    $scope.restoreDefault = function(){
      $scope.image1src = defaultPath + defaultImageName;
      $scope.image2src = defaultPath + defaultImageName;
      $scope.image3src = defaultPath + defaultImageName;
      $scope.localdataInfo.classe.photo = $scope.image1src;
      $scope.localdataInfo.objPropClasse.photo = $scope.image2src;
      $scope.localdataInfo.objPropObj.photo = $scope.image3src;
      $scope.localdataInfo = angular.copy($rootScope.dataInfo);
    };
}]);
