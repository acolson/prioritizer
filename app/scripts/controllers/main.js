'use strict';

angular.module('priorisaurusApp')
  .controller('MainCtrl', function ($scope, ListData) {
    $scope.list = ListData;
  });
