'use strict';

var controllers = angular.module('myApp.controllers', []);

controllers.controller('overviewController', ['$scope', 'resume_data', function ($scope, resume_data) {
    $scope.resume_data = resume_data.data;
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
        $scope.where = $filter('filter')(resume_data.data.where, {slug: $scope.what.where})[0];
        if (!$scope.what.start) {
            $scope.what.start = $scope.where.start;
            $scope.what.end = $scope.where.end;
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
