'use strict';

/* jasmine specs for controllers go here */

describe('Resume Services', function () {
    beforeEach(module('myApp.services'));

    describe('resumeService', function () {
        var service;
        beforeEach(function () {
            inject(function ($injector) {
                service = $injector.get('resumeService');
            });
        });

        it('should set url to test.json', function () {
            service.setResumeUrl("test");
            expect(service.getResumeUrl()).toBe("test.json");
        });

        it('should set sample url to samples/sample-test.json', function () {
            service.setResumeUrl("sample-test");
            expect(service.getResumeUrl()).toBe("samples/sample-test.json");
        });

    });

    describe('resumeConverter', function () {
//        var $httpBackend;
//        beforeEach(inject(function (_$httpBackend_) {
//            // Set up the mock http service responses
//            $httpBackend = _$httpBackend_;
//            $httpBackend.when('GET', 'samples/sample-long.json').respond(sampleData);
//        }));

        var service;
        beforeEach(function () {
            inject(function ($injector) {
                service = $injector.get('resumeConverter');
            });
        });

        var sampleDataOriginal = function () {
            return {
                "name": "Sample Person",
                "where": [
                    {
                        "slug": "google",
                        "name": "Google",
                        "start": "2000-01",
                        "whats": [
                            {
                                "slug": "google-sso",
                                "name": "Single Sign On",
                                "start": "2000-01",
                                "screenshots": "sample.png",
                                "hows": ["mysql", {
                                    "slug": "java",
                                    "level": 3
                                }, "extjs"]
                            }
                        ]
                    },
                    {
                        "slug": "facebook",
                        "name": "Facebook"
                    }
                ],
                "what": [
                    {
                        "slug": "google_login2",
                        "name": "Login 2.0",
                        "start": "2001-01",
                        "screenshots": "sample.png",
                        "hows": ["mysql", {
                            "slug": "java",
                            "level": 3
                        }, "extjs", "bad_how"]
                    }
                ],
                "how": [
                    {
                        "slug": "extjs",
                        "name": "ExtJS"
                    },
                    {
                        "slug": "java",
                        "name": "Java",
                        "start": "2002"
                    },
                    {
                        "slug": "angular",
                        "name": "Angular JS",
                        "start": "2002"
                    },
                    {
                        "slug": "mysql",
                        "name": "MySQL",
                        "start": "1999-01"
                    }
                ]

            };
        }

        /**
         * Some constants so we can keep track of the order of elements
         */
        var mappingOrder = {
            "where": {
                "google": 0
            },
            "what": {
                "google_login2": 0,
                "google-sso": 1
            },
            "how": {
                "extjs": 0,
                "java": 1,
                "angular": 2,
                "mysql": 3
            }
        }

        it('should copy where.what from where to what', function () {
            var sampleData = service.convert(sampleDataOriginal());
            expect(sampleData.where.length).toBe(2);
            expect(sampleData.what.length).toBe(2);
            expect(sampleData.what[1].where).toBe("google");
        });

        it("should create 'what' if it doesn't exist", function () {
            var sampleData = {};
            service.convert(sampleData);
            expect(sampleData.what.length).toBe(0);
        });

        it("should create 'how' if it doesn't exist", function () {
            var sampleData = {};
            service.convert(sampleData);
            expect(sampleData.how.length).toBe(0);
        });

        it("should convert all date strings to objects", function () {
            var sampleData = service.convert(sampleDataOriginal());
            expect(sampleData.where[mappingOrder.where.google].start.display).toBe("Jan 2000");
            expect(sampleData.where[mappingOrder.where.google].whats[0].start.display).toBe("Jan 2000");
            expect(sampleData.what[mappingOrder.what.google_login2].start.display).toBe("Jan 2001");
            expect(sampleData.how[mappingOrder.how.angular].start.display).toBe("2002");
        });

        it("should update 'how.start' if earlier date is found", function () {
            var sampleData = service.convert(sampleDataOriginal());
            expect(sampleData.how[mappingOrder.how.mysql].start.display).toBe("Jan 1999");
            expect(sampleData.how[mappingOrder.how.java].start.display).toBe("Jan 2000");
            expect(sampleData.how[mappingOrder.how.extjs].start.display).toBe("Jan 2000");
        });

        it("should default 'how' to 2 if level doesn't exist", function () {
            var sampleData = sampleDataOriginal();
            service.convert(sampleData);
            expect(sampleData.how[0].level).toBe(2);
        });

        it("should create how stub if it doesn't exist", function () {
            var sampleData = {
                "what": [
                    {
                        "slug": "test",
                        "hows": ["foobar"]
                    }
                ]
            };
            service.convert(sampleData);
            expect(sampleData.how.length).toBe(1);
        });

        it("should copy how to where.whats.hows", function () {
            var sampleData = sampleDataOriginal();
            service.convert(sampleData);
            expect(sampleData.where[0].whats[0].hows[0].name).toBe("MySQL");
            expect(sampleData.where[0].whats[0].hows[1].name).toBe("Java");
            expect(sampleData.where[0].whats[0].hows[1].level).toBe(3);
        });

        it("should convert where.whats.screenshots from string to array", function () {
            var sampleData = sampleDataOriginal();
            service.convert(sampleData);
            expect(sampleData.where[0].whats[0].screenshots.length).toBe(1);
            expect(typeof sampleData.where[0].whats[0].screenshots).toBe("object");
        });

        it("should convert what.screenshots from string to array", function () {
            var sampleData = sampleDataOriginal();
            service.convert(sampleData);
            expect(sampleData.what[0].screenshots.length).toBe(1);
        });

        it("should not have any errors", function () {
            var sampleData = sampleDataOriginal();
            service.convert(sampleData);
            expect(sampleData.errors.length).toBe(0);
        });

        it("should require a name", function () {
            var sampleData = sampleDataOriginal();
            delete sampleData.name;
            service.convert(sampleData);
            expect(sampleData.errors.length).toBe(1);
        });

        it("should require work history", function () {
            var sampleData = sampleDataOriginal();
            delete sampleData.where;
            service.convert(sampleData);
            expect(sampleData.errors.length).toBe(1);
        });
    });

    describe('Date Utility', function () {
        var utility;
        beforeEach(function () {
            inject(function ($injector) {
                utility = $injector.get('dateUtil');
            });
        });
        it('should convert null to null', function () {
            var testDate = null;
            expect(utility.parseStringToDate(testDate)).toBe(null);
        });
        it('should convert Current to Current', function () {
            var testDate = "Current";
            var today = new Date();
            expect(utility.parseStringToDate(testDate).date.getFullYear()).toBe(today.getFullYear());
            expect(utility.parseStringToDate(testDate).date.getMonth()).toBe(today.getMonth());
            expect(utility.parseStringToDate(testDate).display).toBe("Current");
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
        it('should convert 1999-02 to date with Feb 1999', function () {
            var testDate = "1999-02";
            expect(utility.parseStringToDate(testDate).date.getFullYear()).toBe(1999);
            expect(utility.parseStringToDate(testDate).date.getMonth()).toBe(1);
            expect(utility.parseStringToDate(testDate).display).toBe("Feb 1999");
        });
        it('should throw error with Jan 1999', function () {
            var testDate = "Jan 1999";
            expect(function () {
                utility.parseStringToDate(testDate);
            }).toThrow(new Error("Invalid date " + testDate));
        });
    });
});
