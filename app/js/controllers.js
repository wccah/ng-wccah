(function(angular){
	"use strict";
	
	angular.module("wccah.controllers", ["wccah.services"])
		.controller("ctlr", ["$scope", "wccahTracker",
		function($scope, wccahTracker) {
			$scope.alpha = "omega";
			
			$scope.tracker = new wccahTracker($scope);
		}]);
})(angular);