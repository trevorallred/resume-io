'use strict';

var controllers = angular.module('myApp.controllers', []);

controllers.controller('overviewController', ['$scope', 'resume_data', function ($scope, resume_data) {
    $scope.resume_data = resume_data.data;
//    $scope.samples = [
//        {"slug": "resume", "name": "Default"},
//        {"slug": "sample-errors", "name": "Errors"},
//        {"slug": "sample-short", "name": "Short"},
//        {"slug": "sample-long", "name": "Long"}
//    ];
}]);

controllers.controller('resumeUrlController', [
    '$location', '$routeParams', 'resumeService',
    function ($location, $routeParams, resumeService) {
        resumeService.setResumeUrl($routeParams.url);
        $location.path("/");
    }]);

controllers.controller('whereController', [
    '$scope', '$filter', '$routeParams', 'resume_data',
    function ($scope, $filter, $routeParams, resume_data) {
        $scope.resume_data = resume_data.data;
        $scope.where = $filter('filter')(resume_data.data.where, {slug: $routeParams.slug})[0];
        $scope.whats = $filter('filter')(resume_data.data.what, {where: $routeParams.slug});
        $scope.hows = $filter('filter')(resume_data.data.how, {where: $routeParams.slug});
    }]);

controllers.controller('whatController', [
    '$scope', '$filter', '$routeParams', 'resume_data',
    function ($scope, $filter, $routeParams, resume_data) {
        $scope.resume_data = resume_data.data;
        $scope.what = $filter('filter')(resume_data.data.what, {slug: $routeParams.slug})[0];
        if ($scope.what.where != undefined) {
            $scope.where = $filter('filter')(resume_data.data.where, {slug: $scope.what.where})[0];
        }
    }]);

controllers.controller('howController', [
    '$scope', '$filter', '$routeParams', 'resume_data',
    function ($scope, $filter, $routeParams, resume_data) {
        $scope.resume_data = resume_data.data;
        $scope.how = $filter('filter')(resume_data.data.how, {slug: $routeParams.slug})[0];
        $scope.whats = $filter('filter')(resume_data.data.whats, {where: $routeParams.slug});
        $scope.wheres = $filter('filter')(resume_data.data.what, {where: $routeParams.slug});
    }]);
