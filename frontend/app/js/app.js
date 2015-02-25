'use strict';
var host = "http://localhost:3000/api";

angular.module('SmartTower', ['ngAnimate','ngRoute']) 
.config(function($routeProvider) {
    $routeProvider
      .when('/', { })
      .when('/devices', { 
          templateUrl: 'partials/hues.html',
          controller: 'HueListCtrl' 
        })
  
      .when('/weather', { templateUrl: 'partials/weather.html' })
      .otherwise({ redirectTo: '/'});
  })
.controller('HueListCtrl', function($scope, $http) {
  $http.get('http://localhost:3000/api/devices').success(function(data) {
      $scope.hues = data;
    });
})
  .controller('SendHueStateCtrl',['$scope', '$http', function ($scope,$http) {

     $scope.update = function(network) {
        $scope.master = angular.copy(network);
      };

    $scope.takeOn = function(network) {
        var nodeid = angular.copy(network).nodeid;
        var ep = angular.copy(network).endpoint;

        $scope.state = 'ON';
        $http.get( host + "/hue/state/" + nodeid + "/"+ ep +"/0/1").success(function(data) {
         });
    };

     $scope.takeOff = function(network) {
        var nodeid = angular.copy(network).nodeid;
        var ep = angular.copy(network).endpoint;
        $scope.state = 'OFF';
        $http.get( host + "/hue/state/" + nodeid + "/"+ ep +"/0/0").success(function(data) {
         });
    };

    $scope.openNetwork = function(){
       $http.get(host + "/network/open").success(function(data) {
         });
    };
}])
  .controller('WeatherCtl', function($scope, $http){
    $http.get('http://localhost:3000/api/weather').success(function(data) {
      console.log(data);
      $scope.weather = data;
    });
  })
  .controller('AdressCtrl', [ '$scope' , function($scope){
   
      $scope.update = function(network) {
        $scope.nodeid = network;
      };

  }]);
