var HueServices = angular.module('HueServices', ['ngResource']);

HueServices.factory('Hue', ['$resource',
  function($resource){
    return $resource('http://localhost:3000/api/hue', {
      query: {method:'GET', isArray:true}
    });
  }]);