'use strict';

var services = angular.module('myApp.services', []);

services.factory('resumeService', ['$http', function ($http) {
    var resume_data = null;
    return {
        getRemoteData: function () {
            var resumeURL = 'resume.json';
            resumeURL = 'samples/sample-long.json';
            // resumeURL = 'samples/sample-short.json';
            return $http({ method: 'GET', url: resumeURL }).success(function (data) {
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

services.factory('resumeConverter', function () {
    return {
        convert: function (data) {
            // console.info("Starting to convert resume data");
            return data;
        }
    }
});

services.factory('dateUtil', function () {
    var mthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    return {
        parseStringToDate: function (value) {
            var result = Object();
            if (value == null || value.length < 4) {
                return null;
            }

            result.year = parseInt(value.substr(0, 4));
            if (value.length == 4) {
                result.date = new Date(result.year, 0, 1);
                result.display = result.year + "";
                return result;
            }

            result.month = parseInt(value.substr(5, 2)) - 1;
            result.date = new Date(result.year, result.month, 1);

            result.display = mthNames[result.month] + " " + result.year;
            return result;
        }
    }
});
