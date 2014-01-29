'use strict';

/* jasmine specs for controllers go here */

describe('Resume Services', function () {
    beforeEach(module('myApp.services'));

    var sampleData = {
        "where": [
            {
                "slug": "google",
                "name": "Google"
            },
            {
                "slug": "facebook",
                "name": "Facebook"
            }
        ],
        "what": [
            {
                "slug": "google-sso",
                "name": "Single Sign On",
                "where": "google",
                "hows": ["extjs", "mysql", {
                    "java": 3
                }]
            },
            {
                "slug": "google-login2",
                "name": "Login 2.0",
                "where": "google",
                "hows": ["extjs", "mysql", {
                    "java": 3
                }]
            }
        ],
        "how": [
            {
                "slug": "extjs",
                "name": "ExtJS"
            },
            {
                "slug": "java",
                "name": "Java"
            },
            {
                "slug": "angular",
                "name": "Angular JS"
            },
            {
                "slug": "mysql",
                "name": "MySQL"
            }
        ]
    };

    describe('resumeConverter', function () {
        var $httpBackend;

        beforeEach(inject(function (_$httpBackend_) {
            // Set up the mock http service responses
            $httpBackend = _$httpBackend_;
            $httpBackend.when('GET', 'samples/sample-long.json').respond(sampleData);
        }));

        var service;
        beforeEach(function() {
            inject(function($injector) {
                service = $injector.get('resumeConverter');
            });
        });
        it('should ....', function () {
            var result = service.convert(sampleData);
            expect(result.where.length).toBe(2);
            expect(result.what.length).toBe(2);
            expect(result.how.length).toBe(4);
        });
    });

    describe('Date Utility', function () {
        var utility;
        beforeEach(function() {
            inject(function($injector) {
                utility = $injector.get('dateUtil');
            });
        });
        it('should convert null to null', function () {
            var testDate = null;
            expect(utility.parseStringToDate(testDate)).toBe(null);
        });
        it('should convert foo to null', function () {
            var testDate = "foo";
            expect(utility.parseStringToDate(testDate)).toBe(null);
        });
        it('should convert 1999 to date with just a year', function () {
            var testDate = "1999";
            expect(utility.parseStringToDate(testDate).date.getFullYear()).toBe(1999);
            expect(utility.parseStringToDate(testDate).date.getMonth()).toBe(0);
            expect(utility.parseStringToDate(testDate).display).toBe("1999");
        });
        it('should convert 1999-02 to date with Jan 1999', function () {
            var testDate = "1999-02";
            expect(utility.parseStringToDate(testDate).date.getFullYear()).toBe(1999);
            expect(utility.parseStringToDate(testDate).date.getMonth()).toBe(1);
            expect(utility.parseStringToDate(testDate).display).toBe("Feb 1999");
        });
    });
});
