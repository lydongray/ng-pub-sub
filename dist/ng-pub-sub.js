'use strict';

/**
 * Main Module
 * @namespace ngPubSub
 * @desc Main application module
 */
(function () {

    'use strict';

    /**
     * @namespace ngPubSub.Module
     * @desc Main application module
     * @memberOf ngPubSub
     */

    angular.module('ng-pub-sub', []);
})();

/**
 * App Configuration
 * @namespace ngPubSub
 */
(function () {

    'use strict';

    config.$inject = ["$pubSubProvider"];
    angular.module('ng-pub-sub').config(config);

    /**
     * @namespace ngPubSub.Config
     * @desc Main app configuration
     * @memberOf ngPubSub
     */

    /* @ngInject */
    function config($pubSubProvider) {

        // TODO: configs

    }
})();

/**
 * Core Factory
 * @namespace ngPubSub
 */
(function () {

    'use strict';

    angular.module('ng-pub-sub').provider('$pubSub', PubSubProvider);

    /**
     * @namespace ngPubSub.Factory
     * @desc Core application factor
     * @memberOf ngPubSub
     */

    /* @ngInject */
    function PubSubProvider() {

        // --------------------------------------------------------------------------------
        // ACCESSABLE MEMBERS - DECLARATION
        // --------------------------------------------------------------------------------
        // Subscriptions: {
        //     'getUsers': {
        //         callbacks: [
        //             {
        //                  scope: _scope_,
        //                  func: _func_
        //             }
        //         ]
        //     }
        // }

        var subscriptions = {},
            callbackId = 0;

        // // Declare any accessable members for the service.

        var provider = this;
        this.defaultOptions = {};

        provider.$extend = $extend;
        provider.$on = $on;
        provider.$once = $once;
        provider.$emit = $emit;
        provider.$off = $delete;
        provider.$callbacks = $callbacks;

        provider.$get = [function () {

            return provider;
        }];

        // --------------------------------------------------------------------------------
        // ACCESSABLE MEMBERS - RESOLVERS
        // --------------------------------------------------------------------------------

        /**
            * @name $extend
            * @desc Extends a given service.
            * @param {Object} service - Service to extend.
            * @returns {Object} The extended service
            * @memberOf ngPubSub.Provider
            */
        function $extend(service) {
            var extended = angular.extend({}, provider, service);
            return extended;
        }

        /**
            * @name $on
            * @desc Creates a new subscription.
            * @param {Object} name - The name of the subscription.
            * @param {Object} func - Fired when subscription is called.
            * @param {Object} scope - Used to automatically unsubscribe
                when scope is destroyed.
            * @param {Object} config - Configuration for subscription.
            * @memberOf ngPubSub.Provider
            */
        function $on(name, func) {
            var scope = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
            var config = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];


            var subscriptionExists = angular.isDefined(subscriptions[name]);
            var subscription = subscriptions[name] || {
                callbacks: []
            };
            callbackId++;

            subscription.callbacks.push({
                id: callbackId,
                scope: scope,
                func: func,
                once: config.once || false
            });

            // Ensure to clean up subscriptions when scope is destroyed
            if (scope.$on) {
                scope.$on('$destroy', function () {
                    deleteSubscriptions({
                        scope: scope
                    });
                });
            }

            if (!subscriptionExists) {
                subscriptions[name] = subscription;
            }

            return callbackId;
        }

        /**
            * @name $once
            * @desc Creates a new subscription that destroys itself once called.
            * @param {Object} name - The name of the subscription.
            * @param {Object} func - Fired when subscription is called.
            * @memberOf ngPubSub.Provider
            */
        function $once(name, func, scope) {
            $on(name, func, scope, {
                once: true
            });
        }

        /**
            * @name $emit
            * @desc Fires all subscriptions with given name.
            * @param {Object} name - The name of the subscription.
            * @param {Object} data - Data to pass to subscriber.
            * @memberOf ngPubSub.Provider
            */
        function $emit(name, data) {
            var subscription = subscriptions[name];
            if (subscription) {
                subscription.callbacks = subscription.callbacks.filter(function (c) {
                    return c.func(data) || !c.once;
                });
            }
        }

        /**
            * @name $delete
            * @desc Deletes or unsubscribes subscriptions. If providing a name,
                it will delete all subscriptions of that name. If providing a scope, it
                will only delete subscriptions associated with that scope.
            * @param {Object} subscriptionParam - Ether id, the name of the
                subscription or a scope object.
            * @memberOf ngPubSub.Provider
            */
        function $delete(subscriptionParam) {
            if (angular.isNumber(subscriptionParam)) {
                deleteSubscriptions({
                    id: subscriptionParam
                });
            } else {
                if (angular.isObject(subscriptionParam)) {
                    deleteSubscriptions({
                        scope: subscriptionParam
                    });
                } else {
                    deleteSubscriptions({
                        name: subscriptionParam
                    });
                }
            }
        }

        /**
            * @name $callbacks
            * @desc Gets all callback functions given the name of the
                subscription or the scope associated with the subscriptions.
                Pass nothing to get all callbacks.
            * @param {Object} nameOrScope - Ether the name of the
                subscription or a scope object.
            * @returns {Array} Array of callbacks
            * @memberOf ngPubSub.Provider
            */
        function $callbacks(nameOrScope) {
            if (!nameOrScope) {
                // Gets all callbacks
                return getCallbacks();
            } else {
                if (angular.isObject(nameOrScope)) {
                    // Gets callbacks by scope
                    return getCallbacks({
                        scope: nameOrScope
                    });
                } else {
                    // Gets callbacks by name
                    return getCallbacks({
                        name: nameOrScope
                    });
                }
            }
        }

        // --------------------------------------------------------------------------------
        // PRIVATE MEMBERS
        // --------------------------------------------------------------------------------

        /**
            * @name deleteSubscriptions
            * @desc Deletes subscriptions given scope and/or subscription name.
            * @param {Object} scope - Scope object.
            * @param {String} name - Subscription name.
            * @memberOf ngPubSub.Provider
            */
        function deleteSubscriptions() {
            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var id = _ref.id;
            var scope = _ref.scope;
            var name = _ref.name;

            for (var key in subscriptions) {
                if (subscriptions.hasOwnProperty(key)) {
                    var subscription = subscriptions[key];
                    var callbacks = subscription.callbacks;

                    // Filter callbacks if id is provided
                    subscription.callbacks = callbacks = callbacks.filter(function (callback) {
                        return !id || callback.id !== id;
                    });

                    // Filter callbacks if scope is provided
                    subscription.callbacks = callbacks = callbacks.filter(function (callback) {
                        return !scope || callback.scope !== scope;
                    });

                    // Delete subscription if name is provided
                    if (name) {
                        delete subscriptions[name];
                    }
                }
            }

            /*
            // TODO: Work out how to get uglifier to work with ES6
            // Or get Babel working with Generator Functions (function*)
            for (let [key, subscription] of iterator(subscriptions)) {
                var callbacks = subscription.callbacks;
                subscription.callbacks = callbacks
                    .filter(callback => !scope || callback.scope !== scope);
                  if (name) {
                    delete subscriptions[name];
                }
            }
            */
        }

        /**
            * @name getCallbacks
            * @desc Gets all callback functions by scope and/or name.
            * @param {Object} scope - Scope object.
            * @param {String} name - Subscription name.
            * @returns {Array} Array of callbacks
            * @memberOf ngPubSub.Provider
            */
        function getCallbacks() {
            var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var scope = _ref2.scope;
            var name = _ref2.name;


            var returnCallbacks = [];

            for (var key in subscriptions) {
                if (subscriptions.hasOwnProperty(key)) {
                    var subscription = subscriptions[key];

                    // Filter callbacks by subscription name
                    if (!name || key === name) {
                        subscription.callbacks.forEach(function (callback) {
                            // Filter callbacks by scope
                            if (!scope || callback.scope === scope) {
                                returnCallbacks.push(callback);
                            }
                        });
                    }
                }
            }

            /*
            // TODO: Work out how to get uglifier to work with ES6
            // Or get Babel working with Generator Functions (function*)
            for (let [key, subscription] of iterator(subscriptions)) {
                // Filter callbacks by subscription name
                if (!name || key === name) {
                    subscription.callbacks
                        .forEach(callback => {
                            // Filter callbacks by scope
                            if (!scope || callback.scope === scope) {
                                returnCallbacks.push(callback);
                            }
                        });
                }
            }
            */

            return returnCallbacks;
        }

        /**
            * @name iterator
            * @desc Iterates over objects
            * @param {Object} obj - Object to iterate.
            */
        // TODO: Work out how to get uglifier to work with ES6
        // Or get Babel working with Generator Functions (function*)
        // function* iterator(obj) {
        //     for (let key of Object.keys(obj)) {
        //         yield [key, obj[key]];
        //     }
        // }
    }
})();