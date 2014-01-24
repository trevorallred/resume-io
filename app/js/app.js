'use strict';

var app = angular.module('myApp', [
    'ngRoute', 'myApp.services', 'myApp.controllers'
]);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'app/overview.html',
                controller: 'overviewController',
                resolve: {
                    resume_data: function(resumeService) {
                        return resumeService.getResumeData();
                    }
                }
            }).
            when('/where/:slug', {
                templateUrl: 'app/where.html',
                controller: 'whereController',
                resolve: {
                    resume_data: function(resumeService) {
                        return resumeService.getResumeData();
                    }
                }
            }).
            when('/what/:slug', {
                templateUrl: 'app/what.html',
                controller: 'whatController',
                resolve: {
                    resume_data: function(resumeService) {
                        return resumeService.getResumeData();
                    }
                }
            }).
            when('/how/:slug', {
                templateUrl: 'app/how.html',
                controller: 'howController',
                resolve: {
                    resume_data: function(resumeService) {
                        return resumeService.getResumeData();
                    }
                }
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);

app.run(['$rootScope', function($root) {

    $root.$on('$routeChangeStart', function(e, curr, prev) {
        if (curr.$$route && curr.$$route.resolve) {
            // Show a loading message until promises are resolved
            $root.loadingView = true;
        }
    });

    $root.$on('$routeChangeSuccess', function(e, curr, prev) {
        // Hide loading message
        $root.loadingView = false;
    });

}]);
