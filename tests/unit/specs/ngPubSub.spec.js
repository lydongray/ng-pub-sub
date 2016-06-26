/*global angular, describe, it, jasmine, expect, beforeEach, inject */
'use strict';

describe('Testing PubSub Provider', function () {

    var
        $timeout,
        $controller,
        $rootScope,
        pubSub,
        userService,
        scope,
        scope2,
        userController;

    beforeEach(module('ngPubSub.tests'));

    beforeEach(inject(function(_$timeout_, _$controller_, _$rootScope_, _$pubSub_, _userService_) {
        $timeout = _$timeout_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        pubSub = _$pubSub_;
        userService = _userService_;

        scope = $rootScope.$new();
        scope2 = $rootScope.$new();
        userController = $controller('userController', { $scope: scope });
    }));

    describe('Testing PubSub Functionality', function() {

        it('creates a service that extends subscriber', function() {
            var users = userService
                .getUsers()
                .then(function(data) {
                    expect(data).toEqual(userController.users);
                });
            $timeout.flush();
        });
        it('creates a subscriber', function() {
            userService.$on('getUsers', function(data) { }, scope2);
            spyOn(userService, '$emit');
            userService.getUsers();
            // Async testing
            setTimeout(function() {
                expect(userService.$emit).toHaveBeenCalled();
                done();
            });
            $timeout.flush();
        });
        it('creates a subscriber without scope', function() {
            userService.$on('getUsers', function(data) { });
            spyOn(userService, '$emit');
            userService.getUsers();
            // Async testing
            setTimeout(function() {
                expect(userService.$emit).toHaveBeenCalled();
                done();
            });
            $timeout.flush();
        });
        it('gets all callbacks', function() {
            expect(userService.$callbacks().length).toEqual(2);
        });
        it('gets all callbacks by scope', function() {
            expect(userService.$callbacks(scope).length).toEqual(2);
            expect(userService.$callbacks(scope2).length).toEqual(0);
        });
        it('gets all callbacks by name', function() {
            expect(userService.$callbacks('getUsers').length).toEqual(2);
        });
        it('deletes subscriptions given scope', function() {
            expect(userService.$callbacks(scope).length).toEqual(2);
            userService.$off(scope);
            expect(userService.$callbacks(scope).length).toEqual(0);
            expect(userService.$callbacks(scope).length).toEqual(0);
        });
        it('deletes subscriptions given name', function() {
            expect(userService.$callbacks('getUsers').length).toEqual(2);
            userService.$off('getUsers');
            expect(userService.$callbacks('getUsers').length).toEqual(0);
        });
        it('unsubscribes when controller is destroyed', function() {
            userService.$on('getUsers', function() { }, scope2);
            expect(userService.$callbacks(scope).length).toEqual(2);
            expect(userService.$callbacks(scope2).length).toEqual(1);
            scope.$destroy();
            expect(userService.$callbacks(scope).length).toEqual(0);
            expect(userService.$callbacks(scope2).length).toEqual(1);
        });
        it('deletes callback when subscriber is subscribed once', function() {
            userService.$once('getUsers', function() { }, scope);
            expect(userService.$callbacks(scope).length).toEqual(3);
            userService.getUsers();
            $timeout.flush();
            expect(userService.$callbacks(scope).length).toEqual(2);
        });

    });

});
