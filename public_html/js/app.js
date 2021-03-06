'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ngGrid'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.when('/testlist', {templateUrl: 'partials/testlist.html', controller: 'TestListCtrl'});
  $routeProvider.when('/svclist', {templateUrl: 'partials/serviceslist.html', controller: 'SvcListCtrl'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
