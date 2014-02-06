'use strict';

var services = angular.module('myApp.services', ['ngSanitize']);

services.factory('appSettings', function() {
    return {
        language: 'en',
        version: 1.0,
        mode: 'production'
    }
});

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
            if (data.converted != undefined) {
                console.warn("Data was already converted. Don't call convert(data) twice.");
                return data;
            }
            data.converted = true;

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

            function mapAllTypes() {
                data.howMap = {};
                angular.forEach(data.how, function (value) {
                    if (data.howMap[value.slug] != undefined) {
                        throw new Error("Found two copies of " + value.slug);
                    }
                    data.howMap[value.slug] = value;
                });
                data.whatMap = {};
                angular.forEach(data.what, function (value) {
                    if (data.whatMap[value.slug] != undefined) {
                        throw new Error("Found two copies of " + value.slug);
                    }
                    data.whatMap[value.slug] = value;
                });
                data.whereMap = {};
                angular.forEach(data.where, function (value) {
                    if (data.howMap[value.slug] != undefined) {
                        console.error("Found two copies of " + value.slug);
                    }
                    data.whereMap[value.slug] = value;
                    angular.forEach(value.whats, function (what) {
                        if (data.howMap[value.slug] != undefined) {
                            console.error("Found two copies of " + value.slug);
                        }
                        data.whatMap[what.slug] = what;
                    });
                });
            }
            mapAllTypes();

            function convertDates() {
                function convert(value, field) {
                    if (value[field] != undefined)
                        value[field] = dateUtil.parseStringToDate(value[field]);
                }

                angular.forEach(data.whereMap, function (value) {
                    convert(value, "start");
                    convert(value, "end");
                });
                angular.forEach(data.whatMap, function (value) {
                    convert(value, "start");
                    convert(value, "end");
                });
                angular.forEach(data.howMap, function (value) {
                    convert(value, "start");
                    convert(value, "end");
                });
            }

            convertDates();

            function updateHowDates() {

                function findBestDateForHow() {
                    function cloneDateObject(original) {
                        return {
                            "date": original.date,
                            "display": original.display
                        };
                    }

                    function copyDateFromHowsToHow(what) {
                        if (what.start != undefined || what.end != undefined) {
                            angular.forEach(what.hows, function (how) {
                                var howSlug = how;
                                if (typeof howSlug != "string") {
                                    howSlug = how.slug;
                                }

                                if (data.howMap[howSlug] == undefined) {
                                    data.howMap[howSlug] = addMissingHow(howSlug);
                                    var current_date = dateUtil.parseStringToDate("Current");
                                    data.howMap[howSlug].start = current_date;
                                }

                                if (what.start != undefined) {
                                    if (data.howMap[howSlug].start == undefined) {
                                        data.howMap[howSlug].start = dateUtil.parseStringToDate("Current");
                                    }
                                    if (what.start.date < data.howMap[howSlug].start.date) {
                                        data.howMap[howSlug].start = cloneDateObject(what.start);
                                    }
                                }
                                if (what.end != undefined) {
                                    if (data.howMap[howSlug].end == undefined) {
                                        data.howMap[howSlug].end = dateUtil.parseStringToDate("Current");
                                    }
                                    if (what.end.date > data.howMap[howSlug].end.date) {
                                        data.howMap[howSlug].end = cloneDateObject(what.end);
                                    }
                                }
                            });
                        }
                    }
                    angular.forEach(data.what, function (what) {
                        copyDateFromHowsToHow(what);
                    });
                    angular.forEach(data.where, function (where) {
                        copyDateFromHowsToHow(where);
                        angular.forEach(where.whats, function (what) {
                            copyDateFromHowsToHow(what);
                        });
                    });
                }

                function updateHowDate() {
                    angular.forEach(data.how, function (value) {
                        var current = data.howMap[value.slug];
                        if (current.start != undefined) {
                            value.start = current.start;
                        }
                        if (current.end != undefined) {
                            value.end = current.end;
                        }
                    });
                }

                findBestDateForHow();
                updateHowDate();
            }

            updateHowDates();

            function addMissingHow(slug) {
                var emptySlug = {"slug": slug, "name": slug, "level": 1, "autoadd": true};
                data.how.push(emptySlug);
                return emptySlug;
            }

            function copyWhereWhatsToWhat() {
                angular.forEach(data.where, function (where) {
                    if (where.whats != undefined) {
                        angular.forEach(where.whats, function (what) {
                            what.where = where.slug;
                            data.what.push(what);
                        });
                    }
                });
            }

            copyWhereWhatsToWhat();

            function copyHows() {
                function mergeHow(original) {
                    var full = {};
                    if (typeof original === "string") {
                        full.slug = original;
                    } else if (typeof original === "object") {
                        full = original;
                    }
                    if (data.howMap[full.slug] == undefined) {
                        data.howMap[full.slug] = addMissingHow(full.slug);;
                    }
                    full.name = data.howMap[full.slug].name;
                    if (full.level == undefined) {
                        full.level = 2;
                    }
                    return full;
                }

                angular.forEach(data.what, function (what) {
                    if (what.hows != undefined) {
                        angular.forEach(what.hows, function (how, key) {
                            what.hows[key] = mergeHow(how);
                        });
                    }
                });
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

            function screenshotToArray() {
                function _screenshotToArray(what) {
                    if (what.screenshots != undefined && typeof what.screenshots == "string") {
                        what.screenshots = new Array(what.screenshots);
                    }
                }

                for (var what in data.whatMap) {
                    _screenshotToArray(data.whatMap[what]);
                }
            }
            screenshotToArray();

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
            if (isNaN(result.month)) {
                throw new Error("Invalid date " + value);
            }
            result.date = new Date(result.year, result.month, 1);

            result.display = mthNames[result.month] + " " + result.year;
            return result;
        }
    }
});
