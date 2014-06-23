'use strict';

describe('Service: ListData', function () {

  // load the service's module
  beforeEach(module('priorisaurusApp'));

  // instantiate service
  var ListData;
  beforeEach(inject(function (_ListData_) {
    ListData = _ListData_;
  }));

  it('should do something', function () {
    expect(!!ListData).toBe(true);
  });

});
