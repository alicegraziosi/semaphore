'use strict';

/*
  The point of writing the service is to ensure d3 library is ready in the
  application. This ensures we do not write any d3 code until the library has
  loaded.


  Note:

  When declaring providerName as an injectable argument you will be provided
  with (new ProviderFunction()).$get().

  $q : A service that helps you run functions asynchronously, and use their return
  values (or exceptions) when they are done processing.
*/

var d3Module = angular.module('d3Module', [])

d3Module.provider('d3Service', function() {
  function createScript($document, callback, success) {
    var scriptTag = $document.createElement('script');
    scriptTag.type = "text/javascript";
    scriptTag.async = true;
    scriptTag.src = 'https://d3js.org/d3.v4.min.js';
    scriptTag.onreadystatechange = function() {
      if (this.readyState == 'complete') {
        callback();
      }
    }
    scriptTag.onload = callback;
    $document.getElementsByTagName('body')[0].appendChild(scriptTag);
  }

  this.$get = ['$document','$q', '$window', '$rootScope',
    function($document, $q, $window, $rootScope) {
      var deferred = $q.defer();
      createScript($document[0], function(callback) {
        $rootScope.$apply(function(){ deferred.resolve($window.d3) });;
      })
      return deferred.promise;
    }];
})

/*

No longer used.

Service provider for d3 v.3
*/
.provider('d3ServiceVersion3', function() {
  function createScript($document, callback, success) {
    var scriptTag = $document.createElement('script');
    scriptTag.type = "text/javascript";
    scriptTag.async = true;
    scriptTag.src = 'https://d3js.org/d3.v3.min.js';
    scriptTag.onreadystatechange = function() {
      if (this.readyState == 'complete') {
        callback();
      }
    }
    scriptTag.onload = callback;
    $document.getElementsByTagName('body')[0].appendChild(scriptTag);
  }

  this.$get = ['$document','$q', '$window', '$rootScope',
    function($document, $q, $window, $rootScope) {
      var deferred = $q.defer();
      createScript($document[0], function(callback) {
        $rootScope.$apply(function(){ deferred.resolve($window.d3) });;
      })
      return deferred.promise;
    }];
});


