'use strict';

var services = angular.module('myApp.services', []);

services.factory('resumeService', ['$http', function ($http) {
    var resume_data = null;
    return {
        getRemoteData: function () {
            return $http({ method: 'GET', url: 'resume.json' }).success(function (data) {
                return data;
            });
        },
        getResumeData: function () {
            if (resume_data == null) {
                resume_data = this.getRemoteData();
            }
            return resume_data;
        }
    }
}]);
