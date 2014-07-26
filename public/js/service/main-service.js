/*global define */

'use strict';

define(['angular',
    './conf/user-service',
    './conf/area-service',
    './conf/env-service',
    './conf/project-service',
    './conf/template-service',
    './conf/conf-service',
    './conf/relation-service',
    './conf/system-service',
    './task/task-service',
    './logs/logs-service'
], function(angular) {

    /* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
    var app = angular.module('bugattiApp.services', [
        'bugattiApp.service.conf.userModule',
        'bugattiApp.service.conf.areaModule',
        'bugattiApp.service.conf.envModule',
        'bugattiApp.service.conf.projectModule',
        'bugattiApp.service.conf.templateModule',
        'bugattiApp.service.conf.confModule',
        'bugattiApp.service.conf.relationModule',
        'bugattiApp.service.conf.systemModule',
        'bugattiApp.service.task.taskModule',
        'bugattiApp.service.logs.logsModule'
    ]);

    app.value('version', '0.1');


    // Auth
    app.factory('Auth', ['$http', '$cookieStore', '$cookies', function ($http, $cookieStore, $cookies) {
        var currentUser = {username: '', role: '', sa: false, permissions: []};

        function changeUser(user) {
            angular.extend(currentUser, user)
        }

        return {
            authorize: function(access) {
                if (currentUser.role === 'admin') return true;

                var keepGoing = false;
                angular.forEach(currentUser.permissions, function(p) {
                    if (p == access) {
                        keepGoing = true;
                        return;
                    }
                });
                return keepGoing;
            },
            ping: function(success, error) {
                $http.get('/ping').success(function(r) {
                    changeUser({username: r.jobNo, role: r.role, sa: r.sa, permissions: r.permissions});
                    success();
                }).error(function(r) {
                    changeUser({username: '', role: '', sa: false, permissions: []});
                    error();
                });
            },
            logout: function(success, error) {
                $http.post('/logout').success(function() {
                    changeUser({username: '', role: '', sa: false, permissions: []});
                    success();
                }).error(error);
            },
            user: currentUser
        };


    }]);

});