var app = angular.module('demoApp', ['ng-pub-sub']);

app.controller('MainCtrl', function($scope) {
  
  var vm = this;
  vm.appName = 'ng-pub-sub';
  
});

app.controller('PublishCtrl', function($scope, userService) {
  
  var vm = this;
  vm.publish = publish;
  
  vm.appName = 'ng-pub-sub';
  
  function publish(user) {
    userService.addUser(user);
  }

});

app.controller('ListCtrl', function($scope, userService) {
  
  var vm = this;
  
  userService.$on('demoApp.users', function(data) {
    vm.users = data;
  });
  
  userService.loadUsers();
  
});

app.factory('userService', function($q, $pubSub) {
  
  var userData = [{
      "id": 1,
      "firstName": "Chris",
      "lastName": "Matthews"
    }, {
      "id": 2,
      "firstName": "Keith",
      "lastName": "Ferguson"
    }, {
      "id": 3,
      "firstName": "Philip",
      "lastName": "Ford"
  }];

  var service = {
    
    loadUsers: function() {
      $pubSub.$emit('demoApp.users', userData);
    },
      
    addUser: function(data) {
      var user = {
        firstName: data.firstName,
        lastName: data.lastName
      }
      userData.push(user);
      $pubSub.$emit('demoApp.users', userData);
    }

  };

  //return service;
  return $pubSub.$extend(service);
  
});