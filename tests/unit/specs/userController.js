(function () {

    'use strict';

    angular
        .module('ngPubSub.tests')
        .controller('userController', function($scope, userService) {
            var vm = this;

            vm.users = [];
            vm.usersCopy = [];

            userService.$on('getUsers', function(users) {
                vm.users = users;
            }, $scope);

            userService.$on('getUsers', function(users) {
                vm.users2 = users;
            }, $scope);
            
        });

})();
