var HueControllers = angular.module('HueControllers', ['http']);

HueControllers.controller('HueListCtrl', ['$scope', 'Hue', function($scope, $http) {
  $http.get('http://localhost:3000/api/hue').success(function(data) {
      console.log(data);
      $scope.hue = data;
    });
}])
