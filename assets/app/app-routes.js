(function() {
  "use strict";
  app.config(function($routeProvider, $locationProvider) {

    $routeProvider
    .when('/', {
      templateUrl : 'home.html',
      controller : 'HomeController as HomeCtrl'
    });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

  });
})();
