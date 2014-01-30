'use strict';

var services = angular.module('myApp.services', ['ngSanitize']);

services.factory('resumeService', ['$http', 'resumeConverter', function ($http, resumeConverter) {
    var resume_data;
    var url = 'resume.json'; // Default
    return {
        getResumeUrl: function () {
            return url;
        },
        setResumeUrl: function (newURL) {
            url = newURL + ".json";
            if (newURL.substr(0, 6) == "sample") {
                url = "samples/" + url;
            }
            resume_data = null;
        },
        getRemoteData: function () {
            return $http({ method: 'GET', url: url }).success(function (data) {
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

services.factory('resumeConverter', ['dateUtil', function (dateUtil) {
    return {
        convert: function (data) {
            function findErrors() {
                function clearErrors() {
                    data.errors = [];
                    data.warnings = [];
                }

                clearErrors();

                function addError(problem, description) {
                    data.errors.push({
                        "problem": problem,
                        "description": description
                    });
                }

                function addWarning(problem, description) {
                    data.warnings.push({
                        "problem": problem,
                        "description": description
                    });
                }

                function formatJsonWithPre(json) {
                    function formatJson(oData, sIndent) {
                        if (arguments.length < 2) {
                            var sIndent = "";
                        }
                        var sIndentStyle = "    ";
                        var sDataType = realTypeOf(oData);
                        // open object
                        if (sDataType == "array") {
                            if (oData.length == 0) {
                                return "[]";
                            }
                            var sHTML = "[";
                        } else {
                            var iCount = 0;
                            angular.forEach(oData, function () {
                                iCount++;
                                return;
                            });
                            if (iCount == 0) {
                                // object is empty
                                return "{}";
                            }
                            var sHTML = "{";
                        }

                        // loop through items
                        var iCount = 0;
                        angular.forEach(oData, function (vValue, sKey) {
                            if (iCount > 0) {
                                sHTML += ",";
                            }
                            if (sDataType == "array") {
                                sHTML += ("\n" + sIndent + sIndentStyle);
                            } else {
                                sHTML += ("\n" + sIndent + sIndentStyle + "\"" + sKey + "\"" + ": ");
                            }

                            // display relevant data type
                            switch (realTypeOf(vValue)) {
                                case "array":
                                case "object":
                                    sHTML += formatJson(vValue, (sIndent + sIndentStyle));
                                    break;
                                case "boolean":
                                case "number":
                                    sHTML += vValue.toString();
                                    break;
                                case "null":
                                    sHTML += "null";
                                    break;
                                case "string":
                                    sHTML += ("\"" + vValue + "\"");
                                    break;
                                default:
                                    sHTML += ("TYPEOF: " + typeof(vValue));
                            }

                            // loop
                            iCount++;
                        });

                        // close object
                        if (sDataType == "array") {
                            sHTML += ("\n" + sIndent + "]");
                        } else {
                            sHTML += ("\n" + sIndent + "}");
                        }

                        // return
                        return sHTML;
                    }

                    function realTypeOf(v) {
                        if (typeof(v) == "object") {
                            if (v === null) return "null";
                            if (v.constructor == (new Array).constructor) return "array";
                            if (v.constructor == (new Date).constructor) return "date";
                            if (v.constructor == (new RegExp).constructor) return "regex";
                            return "object";
                        }
                        return typeof(v);
                    }

                    var output = "Sample JSON: <pre>";
                    output += formatJson(json);
                    output += "</pre>";
                    return output;
                }

                (function () {
                    if (data.name == undefined || data.name.length == 0) {
                        addError("Missing Name", formatJsonWithPre({"name": "Your Name Goes Here"}));
                    }
                    if (data.photo == undefined || data.photo.length == 0) {
                        addWarning("Missing Profile Photo", "A photo of yourself is recommended. " + formatJsonWithPre({"photo": "relative_url_to_image"}));
                    }
                    if (data.where == undefined || data.where.length == 0) {
                        var sampleJson = {
                            "where": [
                                {
                                    "slug": "short_url_friendly_abbreviation",
                                    "name": "Name of Company or University"
                                }
                            ]
                        };
                        addError("Missing Work History & Education", formatJsonWithPre(sampleJson));
                    } else {
                        angular.forEach(data.where, function (where) {
                            if (where.slug == undefined) {
                                addError("Missing Slug", formatJsonWithPre({"name": "Your Name Goes Here"}));
                            }
                        });
                    }
                }());
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

            function convertDates() {
                function convert(value, field) {
                    if (value[field] != undefined)
                        value[field] = dateUtil.parseStringToDate(value[field]);
                }

                angular.forEach(data.where, function (value) {
                    convert(value, "start");
                    convert(value, "end");
                    angular.forEach(value.whats, function (value) {
                        convert(value, "start");
                        convert(value, "end");
                    });
                });
                angular.forEach(data.what, function (value) {
                    convert(value, "start");
                    convert(value, "end");
                });
            }

            convertDates();

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
                angular.forEach(data.where, function (where) {
                    if (where.whats != undefined) {
                        angular.forEach(where.whats, function (what) {
                            what.where = where.slug;
                            data.what.push(what);
                        });
                    }
                });
            }

            copyWhats();

            function copyHows() {
                var hows = {};
                angular.forEach(data.how, function (how) {
                    hows[how.slug] = how;
                });

                function mergeHow(original) {
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
                    return full;
                }

                angular.forEach(data.where, function (where) {
                    if (where.whats != undefined) {
                        angular.forEach(where.whats, function (what) {
                            if (what.hows != undefined) {
                                angular.forEach(what.hows, function (how, key) {
                                    what.hows[key] = mergeHow(how);
                                });
                            }
                        });
                    }
                });
            }

            copyHows();

            return data;
        }
    }
}]);

services.factory('dateUtil', function () {
    var mthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return {
        parseStringToDate: function (value) {
            var result = Object();
            if (value == null || value.length < 4) {
                return null;
            }

            if (value == "Current") {
                result.date = new Date();
                result.display = "Current";
                return result;
            }

            if (value == "Jan 1999") {
            }

            result.year = parseInt(value.substr(0, 4));
            if (isNaN(result.year)) {
                throw new Error("Invalid date " + value);
            }
            if (value.length == 4) {
                result.date = new Date(result.year, 0, 1);
                result.display = result.year + "";
                return result;
            }

            result.month = parseInt(value.substr(5, 2)) - 1;
            if (result.month == NaN) {
                throw new Error("Invalid date " + value);
            }
            result.date = new Date(result.year, result.month, 1);

            result.display = mthNames[result.month] + " " + result.year;
            return result;
        }
    }
});
