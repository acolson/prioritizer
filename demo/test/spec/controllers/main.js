'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('priorisaurusApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should have a list of data objects', function () {
    expect(typeof(scope.list[0])).toBe('object');
  });
});
