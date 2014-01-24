'use strict';

/* jasmine specs for controllers go here */

describe('Resume Controllers', function () {
    beforeEach(module('myApp.controllers'));

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
    }

    describe('overviewController', function () {
        it('should ....', inject(function ($controller) {
            var scope = {},
                ctrl = $controller('overviewController', {
                    $scope: scope,
                    resume_data: { data: sampleData}
                });

            expect(scope.resume_data.where.length).toBe(2);
            expect(scope.resume_data.what.length).toBe(2);
            expect(scope.resume_data.how.length).toBe(4);
        }));
    });
});
