'use strict';

var app = angular.module('myApp', [
    'ngRoute', 'ui.bootstrap', 'myApp.services', 'myApp.controllers'
]);

app.config(
    function ($routeProvider, $locationProvider) {
        var resumeService = function (resumeService) {
            return resumeService.getResumeData();
        };

        $routeProvider.
            when('/', {
                templateUrl: '/app/partials/overview.html',
                controller: 'overviewController',
                resolve: {
                    resume_data: resumeService
                }
            }).
            when('/where/:slug', {
                templateUrl: '/app/partials/where.html',
                controller: 'whereController',
                resolve: {
                    resume_data: resumeService
                }
            }).
            when('/what/:slug', {
                templateUrl: '/app/partials/what.html',
                controller: 'whatController',
                resolve: {
                    resume_data: resumeService
                }
            }).
            when('/how/:slug', {
                templateUrl: '/app/partials/how.html',
                controller: 'howController',
                resolve: {
                    resume_data: resumeService
                }
            }).
            when('/resume/:url', {
                templateUrl: '/app/partials/overview.html',
                controller: 'resumeUrlController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
);

app.run(['$rootScope', function ($root) {

    $root.$on('$routeChangeStart', function (e, curr, prev) {
        if (curr.$$route && curr.$$route.resolve) {
            // Show a loading message until promises are resolved
            $root.loadingView = true;
        }
    });

    $root.$on('$routeChangeSuccess', function (e, curr, prev) {
        // Hide loading message
        $root.loadingView = false;
    });

}]);
