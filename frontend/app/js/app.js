'use strict';

angular.module('SmartTower', ['ngAnimate','ngRoute']) 
.config(function($routeProvider) {
    $routeProvider
      .when('/', { })
      .when('/hue', { 
          templateUrl: 'partials/hues.html',
          controller: 'HueListCtrl' 
        })
      .when('/plug', { 
        templateUrl: 'partials/SocketPlug.html',
        controller: 'SocketListCtrl'
      })
      .when('/weather', { templateUrl: 'partials/weather.html' })
      .otherwise({ redirectTo: '/'});
  })
.controller('HueListCtrl', function($scope, $http) {
  $http.get('http://localhost:3000/api/devices').success(function(data) {
      $scope.hues = data;
    });
})
  .controller('SendHueStateCtrl', function ($scope,$http) {
    $scope.takeOn = function() {
        $scope.state = 'ON';
        $http.get('http://localhost:3000/api/hue/state/05A3/0B/0/1').success(function(data) {
         });
    };

     $scope.takeOff = function() {
        $scope.state = 'OFF';
         $http.get('http://localhost:3000/api/hue/state/05A3/0B/0/0').success(function(data) {
         });
    };
})
.controller('SendSocketStateCtrl', function ($scope,$http) {
    $scope.On = function() {
        $scope.state = 'ON';
        $http.get('http://localhost:3000/api/socket/state/3A4F/01/0/1').success(function(data) {
         });
    };

     $scope.Off = function() {
        $scope.state = 'OFF';
         $http.get('http://localhost:3000/api/socket/state/3A4F/01/0/0').success(function(data) {
         });
    };
})
.controller('SocketListCtrl', function ($scope,$http) {
  $http.get('http://localhost:3000/api/devices').success(function(data) {
      $scope.sockets = data;
    });
})
  .controller('WeatherCtl', function($scope, $http){
    $http.get('http://localhost:3000/api/weather').success(function(data) {
      console.log(data);
      $scope.weather = data;
    });
  });
