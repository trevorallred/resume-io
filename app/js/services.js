'use strict';

var services = angular.module('myApp.services', []);

services.factory('resumeService', ['$http', 'resumeConverter', function ($http, resumeConverter) {
    var resume_data = null;
    return {
        getRemoteData: function () {
            var resumeURL = 'resume.json';
//            resumeURL = 'samples/sample-long.json';
            // resumeURL = 'samples/sample-short.json';
            resumeURL = 'samples/sample-errors.json';
            return $http({ method: 'GET', url: resumeURL }).success(function (data) {
                data = resumeConverter.convert(data);
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
            function clearErrors() {
                data.errors = [];
            }

            function addError(problem, description) {
                if (data.errors == undefined) {
                    clearErrors();
                }
                data.errors.push({
                    "problem": problem,
                    "description": description
                });
            }

            function findErrors() {
                clearErrors();
                if (data.name == undefined)
                    addError("Missing Name", "Add name like this <pre>{'name': 'Yourname'}</pre>");
                if (data.where == undefined)
                    addError("Missing Work History & Education", "Add history like  <pre>{'name': 'Yourname'}</pre>");
            };
            findErrors();

            function initialize() {
                if (data.what == undefined) {
                    data.what = [];
                }
                if (data.how == undefined) {
                    data.how = [];
                } else {
                    for (var how in data.how) {
                        if (data.how[how].level == undefined)
                            data.how[how].level = 2;
                    }
                }
            };
            initialize();

            function screenshotToArray() {
                function _screenshotToArray(what) {
                    if (what.screenshots != undefined && typeof what.screenshots == "string") {
                        what.screenshots = new Array(what.screenshots);
                    }
                }

                for (var where in data.where) {
                    if (data.where[where].whats != undefined) {
                        for (var what in data.where[where].whats) {
                            _screenshotToArray(data.where[where].whats[what]);
                        }
                    }
                }
                for (var what in data.what) {
                    _screenshotToArray(data.what[what]);
                }
            }

            screenshotToArray();

            function copyWhats() {
                for (var where in data.where) {
                    if (data.where[where].whats != undefined) {
                        for (var what in data.where[where].whats) {
                            data.what.push(data.where[where].whats[what])
                        }
                    }
                }
            }

            copyWhats();

            function copyHows() {
                var hows = {};
                for (var how in data.how) {
                    hows[data.how[how].slug] = data.how[how];
                }
                for (var where in data.where) {
                    if (data.where[where].whats != undefined) {
                        for (var what in data.where[where].whats) {
                            if (data.where[where].whats[what].hows != undefined) {
                                for (var how in data.where[where].whats[what].hows) {
                                    var original = data.where[where].whats[what].hows[how];
                                    var full = {};
                                    if (typeof original === "string") {
                                        full.slug = original;
                                    } else if (typeof original === "object") {
                                        full = original;
                                    }
                                    full.name = hows[full.slug].name;
                                    if (full.level == undefined) {
                                        full.level = 2;
                                    }
                                    data.where[where].whats[what].hows[how] = full;
                                }
                            }
                        }
                    }
                }
            }

            copyHows();

            return data;
        }
    }
});

services.factory('dateUtil', function () {
    var mthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
