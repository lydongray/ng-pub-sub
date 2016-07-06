(function () {

    'use strict';

    angular
        .module('ngPubSub.tests')
        .factory('userService', function($q, $timeout, $pubSub) {

            var userData = [];

            var service = {

                getUsers: function() {

                    var defer = $q.defer();
                    
                    // This would probibly be a $http, but $timeout will do just fine
                    $timeout(function() { 
                        userData = [
                            { id: 1, name: 'Phillip' },
                            { id: 2, name: 'Jane' }
                        ];
                    }).then(function() {
                        $pubSub.$emit('getUsers', userData);
                        defer.resolve(userData);
                    });

                    return defer.promise;

                }

            };

            //return service;
            return $pubSub.$extend(service);
        });

})();
