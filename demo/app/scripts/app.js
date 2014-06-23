'use strict';

angular
  .module('priorisaurusApp', [])

  // Add LoDash to DI.
  .factory('_', function ($window) {
    var _ = $window._;

    return _;
  });
