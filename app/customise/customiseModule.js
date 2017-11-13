'use strict';

var customiseModule = angular.module('customiseModule', ['color.picker']);

customiseModule.controller('customiseCtrl', ['$scope', '$rootScope',
  function($scope, $rootScope){

    $scope.localdataInfo = $scope.dataInfo;
    $scope.image1src = "images/wireframe/image.png"
    $scope.image2src = "images/wireframe/image.png"
    $scope.image3src = "images/wireframe/image.png"

    $scope.files = [];

    $scope.applyAndCloseModal = function(){
      $rootScope.dataInfo = $scope.localdataInfo;
      $('.ui.modal').modal('hide');
    };

    $scope.restoreDefault = function(){
      $scope.localdataInfo = $rootScope.dataInfo;
      $scope.dataInfo = $rootScope.dataInfo;
    };

    $scope.selectImage = function() {
        var f = document.getElementById('file').files[0],
            r = new FileReader();

        r.onloadend = function(e) {
          var data = e.target.result;
          //send your binary data via $http or $resource or do anything else with it
        }

        r.readAsBinaryString(f);
        $scope.files.push(r);
    };

    // npm http-server does not support POST requests :(
    $scope.uploadFile = function() {
        var fd = new FormData()
        for (var i in $scope.files) {
            fd.append("uploadedFile", scope.files[i])
        }
        var xhr = new XMLHttpRequest()
        xhr.upload.addEventListener("progress", uploadProgress, false)
        xhr.addEventListener("load", uploadComplete, false)
        xhr.addEventListener("error", uploadFailed, false)
        xhr.addEventListener("abort", uploadCanceled, false)
        xhr.open("POST", "/fileupload")
        xhr.send(fd)
    }


    function uploadProgress(evt) {

    }

    function uploadComplete(evt) {
        /* This event is raised when the server send back a response */
        alert("server send back a response")
    }

    function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.")
    }

    function uploadCanceled(evt) {
        alert("The upload has been canceled by the user or the browser dropped the connection.")
    }

  }
]);