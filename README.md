# ng-pub-sub
=========

An [AngularJS](https://github.com/angular/angular.js) module that uses the publish/subscribe pattern allowing your controllers to listen for events in your factories/directives/controllers/etc. You get a single provider: `$pubSub`.

### How this compares to other solutions

There's a few options out there that are quite similar. Here's what makes ng-pub-sub unique.

* **No need to inject into controller** - Use the convenience method `$extend` to extend your existing services. That means there's no need to inject $pubSub into your controller.

* **Cleans up after itself** - Other solutions require you to listen for your controllers `$destroy` event so you can manually unsubscribe. ng-pub-sub cleans up after itself. Awesome!

* **Clean, well tested codebase**

Install
=======

### Bower

```bash
bower install ng-pub-sub
```

[//]: # (Todo: add npm, nuget, cdnjs and jsDeliver options)

Usage
=====

### Require ng-pub-sub and inject your custom services

```javascript
angular.module('myApp', [
    'ng-pub-sub'
]).controller('MainCtrl', function(
    $scope,
    userService
){});
```

### Inject $pubSub into your service

```javascript
.factory('userService', function($pubSub)
```

### Extend your service using $extend

```javascript
return $pubSub.$extend(service);
```

### Publish ($emit)

```javascript
$pubSub.$emit('getUsers', userData);
```

### Subscribe ($on)

```javascript
userService.$on('getUsers', function(users) {
  vm.users = users;
}, $scope);
```

### See it in action | [Demo](http://plnkr.co/edit/GMrtSnIrwuccWQTzO9wT?p=preview)

Guide
=====
Here's everything ng-pub-sub can do

### $extend *(not required)*
This gives you the ability to extend existing services. This means you don't have to inject $pubSub into your controllers. It's just a way of further simplifying your controllers.

**With $extend**
```javascript
angular.module('myApp', [
    'ng-pub-sub'
]).controller('MainCtrl', function(
    $scope,
    userService
){
    userService.$on('getUsers', function(users) {
      vm.users = users;
    }, $scope);
});
```

**Without $extend**
```javascript
angular.module('myApp', [
    'ng-pub-sub'
]).controller('MainCtrl', function(
    $scope,
    $pubSub,
    userService
){
    $pubSub.$on('getUsers', function(users) {
      vm.users = users;
    }, $scope);
});
```

### $on
Creates a new subscriber. This acts as a listener, waiting for the message to be sent. You can create multiple subscriptions with the same name. Each subscription returns and id, which you can use to unsubscribe individual subscriptions.
> You have the option of providing $scope. This is only necessary if you want ng-pub-sub to clean up subscriptions when the controller is destryed. You can clean up subscriptions manually if required (see $off).

**$on with $scope**
```javascript
angular.module('myApp', [
    'ng-pub-sub'
]).controller('MainCtrl', function(
    $scope,
    userService
){
    var id = userService.$on('getUsers', function(users) {
      vm.users = users;
    }, $scope);
});
```

**$on without $scope**
```javascript
angular.module('myApp', [
    'ng-pub-sub'
]).controller('MainCtrl', function(
    $scope,
    $pubSub,
    userService
){
    userService.$on('getUsers', function(users) {
      vm.users = users;
    });

    $scope.$on('$destroy', function() {
        $pubSub.off('getUsers');
    });
});
```

### $once
Just like $on except it only fires once. After that, the subscription is removed.

### $emit
Publishes a message to all subscribers.

```javascript
angular.module('myApp', [
    'ng-pub-sub'
]).factory('userService', function($pubSub) {
  return {
    getUsers: function() {
        $pubSub.$emit('getUsers', [{ id: 1, name: 'Phillip' }, { id: 1, name: 'Jane' }]);
    }
  }
});
```

### $off
Removes subscriptions. There's 3 ways to do this:

1. Provide the subscription id - a single subscription will be removed
2. Provide a subscription name - all subscriptions of that name will be removed
3. Provide a scope - all subscriptions from that scope will be removed.

**$off with id**
```javascript
angular.module('myApp', [
    'ng-pub-sub'
]).controller('MainCtrl', function(
    $scope,
    userService
){
    var id = userService.$on('getUsers', function(users) {
      vm.users = users;
    }, $scope);

    userService.$off(id);
});
```

**$off with name**
```javascript
angular.module('myApp', [
    'ng-pub-sub'
]).controller('MainCtrl', function(
    $scope,
    userService
){
    userService.$on('getUsers', function(users) {
      vm.users = users;
    }, $scope);

    userService.$off('getUsers');
});
```

**$off with $scope**
```javascript
angular.module('myApp', [
    'ng-pub-sub'
]).controller('MainCtrl', function(
    $scope,
    userService
){
    userService.$on('getUsers', function(users) {
      vm.users = users;
    }, $scope);

    userService.$off($scope);
});
```

### $callbacks
Gets all callback functions given the name of the subscription or the scope associated with the subscription. Pass nothing to get all callbacks.

```javascript
angular.module('myApp', [
    'ng-pub-sub'
]).controller('MainCtrl', function(
    $scope,
    userService
){
    userService.$on('getUsers', function(users) {
      vm.users = users;
    }, $scope);

    var namedCallbacks = userService.$callbacks('getUsers');
    var scopedCallbacks = userService.$callbacks($scope);
    var allCallbacks = userService.$callbacks();
});
```