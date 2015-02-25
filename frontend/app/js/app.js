'use strict';

angular.module('SmartTower', ['ngAnimate','ngRoute',  'HueServices']) 
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
