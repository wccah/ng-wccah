'use strict';

/* jasmine specs for services go here */

describe('service..', function a() {
	var scope, ctl;
	
	beforeEach(module('wccah.controllers'));
	beforeEach(inject(function($rootScope, $controller) {
	    scope = $rootScope.$new();
	    ctl = $controller("ctlr", { $scope: scope });
	}));
	
	describe('tracker..', function b() {
		
		it('expect initial states', function(){
			expect(scope.alpha).toBe('omega');
			
			expect(scope.tracker.hasChanges).toBe(false);
		});
		
		describe('tracker2', function c() {
			beforeEach(function(){
				scope.alpha = 'beta';
				scope.$apply();
			});
			
			it('expect changes', function d() {
				expect(scope.alpha).toBe('beta');
				
				expect(scope.tracker.hasChanges).toBe(true);
			});
		});
	});
});
