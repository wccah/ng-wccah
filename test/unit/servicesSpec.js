'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('wccah.services'));


  describe('tracker', function() {
    it('should return current version', inject(function(wccahTracker) {
      expect(typeof wccahTracker).toEqual('function');
    }));
  });
});
