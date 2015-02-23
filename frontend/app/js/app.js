'use strict';

angular.module('SmartTower', ['ngAnimate','ngRoute',  'HueServices']) 
.config(function($routeProvider) {
    $routeProvider
      .when('/', { })
      .when('/hue', { 
          templateUrl: 'partials/hues.html',
          controller: 'HueListCtrl' 
        })
      .when('/network', { template: 'Network Settings' })
      .when('/weather', { templateUrl: 'partials/weather.html' })
      .otherwise({ redirectTo: '/'});
  }).controller('HueListCtrl', function($scope, $http) {
  $http.get('http://localhost:3000/api/hue').success(function(data) {
      console.log(data);
      $scope.hue = data;
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
