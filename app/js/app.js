'use strict';

angular.module('myApp', [
    'ngRoute', 'ui.bootstrap', 'myApp.services', 'myApp.controllers'
]);

angular.module('myApp').config(
    function ($routeProvider, appSettings) {
        var resumeService = ['resumeService', function (resumeService) {
            return resumeService.getResumeData();
        }];

        var PARTIAL_ROOT = appSettings.partialRoot || 'bower_components/resume-io/app/partials/';
        $routeProvider.
            when('/', {
                templateUrl: PARTIAL_ROOT + 'overview.html',
                controller: 'overviewController',
                title: resumeService,
                resolve: {
                    resume_data: resumeService
                }
            }).
            when('/where/:slug', {
                templateUrl: PARTIAL_ROOT + 'where.html',
                controller: 'whereController',
                resolve: {
                    resume_data: resumeService
                }
            }).
            when('/what/:slug', {
                templateUrl: PARTIAL_ROOT + 'what.html',
                controller: 'whatController',
                resolve: {
                    resume_data: resumeService
                }
            }).
            when('/how/:slug', {
                templateUrl: PARTIAL_ROOT + 'how.html',
                controller: 'howController',
                resolve: {
                    resume_data: resumeService
                }
            }).
            when('/resume/:url', {
                templateUrl: PARTIAL_ROOT + 'overview.html',
                controller: 'resumeUrlController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
);

angular.module('myApp').run(['$rootScope', function ($root) {

    $root.$on('$routeChangeStart', function (e, curr, prev) {
        if (curr.$$route && curr.$$route.resolve) {
            // Show a loading message until promises are resolved
            $root.loadingView = true;
        }
    });

    $root.$on('$routeChangeSuccess', function (e, curr, prev) {
        // Hide loading message
        $root.loadingView = false;
        //Change page title, based on Route information
        $root.title = curr.locals.resume_data.data.name;
    });

}]);


