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

 customiseModule.service('fileUpload', ['$http', '$q', function ($http, $q) {
    this.uploadFileToUrl = function(file, uploadUrl){
       var deferred = $q.defer();
       var formData = new FormData();
       formData.append('file', file);
       $http({
            url: "http://eelst.cs.unibo.it:8095/api/"+uploadUrl,
            method: "POST",
            data: formData,
            headers: {'Content-Type': false,
              'Content-Length': formData.length
            }
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

customiseModule.controller('customiseCtrl', ['$scope', '$rootScope', '$http', 'fileUpload', 'cfpLoadingBar', 'Upload' , '$window',
   function($scope, $rootScope, $http, fileUpload, cfpLoadingBar, Upload, $window){


    var vm = this;
    vm.submit = function(){ //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file); //call upload function
        }
    }
    vm.upload = function (file) {
        Upload.upload({
            //url: "http://eelst.cs.unibo.it:8095/api/upload"
            url: 'http://localhost:8095/api/upload', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                console.log('Success ' + resp.config.data.file.name + ' uploaded.');
            } else {
                console.log('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            //$window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };


    $('.ui.modal').modal('allowMultiple', false);
    $('.ui.modal').modal('hide all');

    // https://stackoverflow.com/questions/29893496/angular-save-scope-value-to-variable-but-not-update-it-when-scope-updates
    //$scope.localdataInfo = angular.copy($rootScope.dataInfo);

    // upload later on form submit or something similar
    /*
    $scope.submit = function() {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
      }
    };
    */

    $scope.submit = function() {
      if ($scope.form.$valid && $scope.files) {
        $scope.upload($scope.files);
      }
    };

    // upload on file select or drop
    $scope.upload = function (file) {
        Upload.upload({
            url: 'http://eelst.cs.unibo.it:8095/api/upload',
            //url: 'http://localhost:8095/api/upload',
            data: {file: file}
        }).then(function (resp) {
          resp.config.data.file.forEach(function(file) {
            console.log('Success ' + file + 'uploaded.');
          });

          $scope.showSuccessMessage = true;
          $scope.showErrorMessage = false;

          //path file uploadato
          $scope.imageprova = "../images/" + resp.config.data.file[0].name;

          if(resp.config.data.file[0]){
            $scope.image1src = "../images/" + resp.config.data.file[0].name;
            $scope.localdataInfo.classe.photo = $scope.image2src;
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
      $scope.localdataInfo = angular.copy($rootScope.dataInfo);
    };
}]);
