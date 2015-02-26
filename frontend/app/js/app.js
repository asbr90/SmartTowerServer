'use strict';
var host = "http://localhost:3000/api";

angular.module('SmartTower', ['ngAnimate','ngRoute']) 
.config(function($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'partials/home.html'
      })
      .when('/zigbee',{
        templateUrl: 'partials/zigbee.html'
      })
      .when('/devices', { 
          templateUrl: 'partials/hues.html',
          controller: 'HueListCtrl' 
        })
  
      .when('/weather', { templateUrl: 'partials/weather.html' })
      .otherwise({ redirectTo: '/home'});
  })
.controller('HueListCtrl', function($scope, $http) {
  $http.get('http://localhost:3000/api/devices').success(function(data) {
      $scope.hues = data;
    });
})
  .controller('SendHueStateCtrl',['$scope', '$http', function ($scope,$http) {

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
      console.log("openNetwork");
       $http.get(host + "/network/open").success(function(data) {
         });
    };
}])
  .controller('WeatherCtl', function($scope, $http){
    $http.get('http://localhost:3000/api/weather/current').success(function(data) {
      $scope.weather = data;
      $scope.weatherspeed = data.wind.speed;
      $scope.weatherCloudsProcent = data.clouds.all;
      $scope.condition = data.weather[0].id;
    });

    $http.get('http://localhost:3000/api/weather/daily').success(function(data) {
      $scope.weatherDAT = data;
      $scope.weatherDATDaily = data.list[2].temp.day;
      $scope.weatherDATDescription = data.list[2].weather[0].description;
      var date = new Date(data.list[2].dt*1000);
      $scope.weatherDATforecastDate = String(date);
      $scope.DATcondition = data.list[2].weather[0].id;

      $scope.forecastDaily = data.list[1].temp.day;
      $scope.forecastDescription = data.list[1].weather[0].description;
      var dateD = new Date(data.list[1].dt*1000);
      $scope.forecastDate = String(dateD);
      $scope.Tcondition = data.list[1].weather[0].id;
    });

    $scope.current = function() {
        $http.get( host + "/bulb/0001/0B/1/"+$scope.condition).success(function(data) {
     });
    };
   $scope.tomorrow = function() {
          $http.get( host + "/bulb/0001/0B/1/"+$scope.Tcondition).success(function(data) {
      });
    };

   $scope.dt = function() {
        $http.get( host + "/bulb/0001/0B/1/"+$scope.DATcondition).success(function(data) {
     });
    };

  })
  .controller('AdressCtrl', [ '$scope' , function($scope){
   
      $scope.update = function(network) {
        $scope.nodeid = network;
      };

  }])
.controller('SendToGroupCtrl',['$scope', '$http', function ($scope,$http) {

    $scope.takeOn = function(network) {
        var nodeid = angular.copy(network).nodeid;
        var ep = angular.copy(network).endpoint;
        $scope.state = 'ON';
        $http.get( host + "/hue/state/" + nodeid + "/"+ ep +"/1/1").success(function(data) {
         });
    };

     $scope.takeOff = function(network) {
        var nodeid = angular.copy(network).nodeid;
        var ep = angular.copy(network).endpoint;
        $scope.state = 'OFF';
        $http.get( host + "/hue/state/" + nodeid + "/"+ ep +"/1/0").success(function(data) {
         });
    };
}])
.controller('AddToGroupCtrl',['$scope', '$http', function ($scope,$http) {

$scope.ChangeColor = function(network){
  var nodeid = angular.copy(network).nodeid;
  var ep = angular.copy(network).endpoint;  
  var color = angular.copy(network).color;
  $http.get( host + "/hue/color/" + nodeid + "/"+ ep +"/0"+"/"+color).success(function(data) {
     });
};


$scope.ChangeGroupColor = function(network){
var nodeid = angular.copy(network).nodeid;
  var ep = angular.copy(network).endpoint;
  var groupid = angular.copy(network).groupid;  
  var color = angular.copy(network).color;
  $http.get( host + "/hue/color/" + groupid + "/"+ ep +"/1"+"/"+color).success(function(data) {
     });
};

$scope.AddtoGroup = function(network) {
    var nodeid = angular.copy(network).nodeid;
    var ep = angular.copy(network).endpoint;
    var groupid = angular.copy(network).groupid;
    var groupname = angular.copy(network).groupname;
    $scope.state = 'ON';

    $http.get( host + "/group/" + nodeid + "/"+ ep +"/0/"+groupid+"/"+groupname).success(function(data) {
     });
    };
}])
.controller('HeaderController',function ($scope,$location){
$scope.isActive = function(route) {
        return route === $location.path();
    }
});