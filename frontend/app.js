'use strict';


angular.module('SmartTower', ['ngAnimate','ngRoute']) 
.config(function($routeProvider) {
    $routeProvider
      .when('/', { })
      .when('/hue', { template: 'Philips Hue' })
      .when('/network', { template: 'Network Settings' })
      .when('/weather', { templateUrl: 'weather.html' })
      .otherwise({ redirectTo: '/'});
  })
  .controller('WeatherCtl', function($scope, $http){
    $http.get('http://localhost:3000/api/weather').success(function(data) {
      console.log(data);
    });
  })
  .controller('CartCtrl', function($scope, Cart){
    $scope.cart = Cart;
  });
