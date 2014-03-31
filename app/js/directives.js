(function(angular) {
	'use strict';
	
	/* Directives */	
	angular.module('wccah.directives', [])
	
	/**
	 * blockUi
	 * 
	 * this directive enables jquery-blockui style UI notifications for a boolean $scope.
	 * useful for when a chunk of html is updating from an async/json call. 
	 *
	 * example: <div block-ui="{{myBool}}" />
	 * when myBool is flagged as true, then the div would start an overlay. 
	 */
	.directive('blockUi', function() {
		return {
			link: function($scope, element, attributes) {
				var ex = attributes.blockUi;
				var val = $scope.$eval(ex);
				if(!val){
					element.unblock();
				} else {
					element.block();
				}
				$scope.$watch(ex, function(newValue, oldValue) {
					if(newValue===oldValue) return;
					
					if(newValue) {
						element.block();
					} else {
						element.unblock();
					}
				});
			}
		};
	});
})(angular);