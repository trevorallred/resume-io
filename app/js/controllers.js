'use strict';

var controllers = angular.module('myApp.controllers', []);

controllers.controller('overviewController', ['$scope', 'resume_data', function ($scope, resume_data) {
    $scope.resume_data = resume_data.data;
    $scope.title = "ASDF";
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
    }]);
