'use strict';

angular.module('SmartTower', ['ngAnimate','ngRoute', 'HueServices' ,'toggle-switch']) 
.config(function($routeProvider) {
    $routeProvider
      .when('/', { })
      .when('/hue', { 
          templateUrl: 'partials/hues.html',
          controller: 'HueListCtrl' 
        })
      .when('/socket', { templateUrl: 'partials/SocketPlug.html' })
      .when('/weather', { templateUrl: 'partials/weather.html' })
      .otherwise({ redirectTo: '/'});
  }).controller('HueListCtrl', function($scope, $http) {
  $http.get('http://192.168.0.12:3000/api/devices').success(function(data) {
      $scope.hues = data;
    });
}).controller('SendHueStateCtrl', function ($scope,$http) {
    $scope.takeOn = function() {
        $scope.state = 'ON';
        $http.get('http://192.168.0.12:3000/api/hue/state/05A3/0B/0/1').success(function(data) {
         });
    };

     $scope.takeOff = function() {
        $scope.state = 'OFF';
         $http.get('http://192.168.0.12:3000/api/hue/state/05A3/0B/0/0').success(function(data) {
         });
    };
})
  .controller('WeatherCtl', function($scope, $http){
    $http.get('http://localhost:3000/api/weather').success(function(data) {
      console.log(data);
      $scope.weather = data;
    });
  })
  .controller('CartCtrl', function($scope, Cart){
    $scope.cart = Cart;
  });
