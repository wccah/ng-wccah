(function(angular){
	'use strict';

/* Services */
	angular.module('wccah.services',[])
	
	/**
	 * wccahTracker( $scope, (trackKeys) )
	 *
	 * the tracker runs $scope.$watch on each trackKeys (or on everything in $scope). it
	 * maintains a boolean 'hasChanges' which says if anything has changed. it also has
	 * an assoc array 'previousValues' which contains the originals or the most recently
	 * accepted changes (via this.acceptChanges()). 'changedValues' is an assoc array of
	 * the current changed values. 
	 *
	 * the tracker runs $emit('wccah.Tracker') on the $scope whenever a change occurs, 
	 * or a reversion to the original/accepted. another call is made when zero changes
	 * are found.
	 *
	 * $scope - the controller's $scope
	 * trackKeys - an optional list of $watch-able keys on the scope. 
	 *  if ommitted, then everything that is currently contained in $scope, at tracker 
	 *  instantiation, is tracked.
	 *
	 **/
	.factory('wccahTracker', [function() {
		var myTracker = function($scope, trackKeys) {
			var self = this;
			
			/**
			 * acceptedValues ~ the originals or most recently adopted values
			 * changedValues  ~ the set of changes
			 * hasChanges     ~ the soul of this class
			 */
			self.acceptedValues = {};
			self.changedValues = {};
			self.hasChanges = false;
			
			if (typeof trackKeys === 'undefined') {
				trackKeys = [];
				for(var key in $scope) {
					if ($scope.hasOwnProperty(key) && key.charAt(0) !== '$') {
						trackKeys.push(key);
					}
				}
			}
			
			angular.forEach(trackKeys, function(key) {
				var saved = $scope[key];
				self.acceptedValues[key] = saved;
				
				$scope.$watch(key, function (newValue, oldValue) {
					var equality = angular.equals(newValue, self.acceptedValues[key]);
					if(!equality) {
						var changeEvt = { 
							event: 'HasChange',
							key: key,
							acceptedValue: self.acceptedValues[key],
							oldValue: oldValue,
							newValue: newValue 
						};
						
						var firstChange = !self.hasChanges;
						
						self.hasChanges = true;
						
						self.changedValues[key] = newValue;
						$scope.$emit('wccah.Tracker', changeEvt);
						
						if ( firstChange ) {
							$scope.$emit('wccah.Tracker.Infrequent', { event: 'HasChanges' });
						}
					} else {
						delete self.changedValues[key];
						var evt = {
							key: key,
							event: 'LostChange'
						};
						$scope.$emit('wccah.Tracker', evt);
						
						if (angular.equals(self.changedValues, {}) && self.hasChanges) {
							self.hasChanges = false;
							
							$scope.$emit('wccah.Tracker.Infrequent', { event: 'NoChanges' });
						}
					}
				});
			});
			
			self.acceptChanges = function() {
				angular.forEach(trackKeys, function(key) {
					self.acceptedValues[key] = $scope[key];
				});
				self.changedValues = {};
				self.hasChanges = false;
				
				$scope.$emit('wccah.Tracker.Infrequent', { event: 'NoChanges' });
			};
			
			self.rejectChanges = function() {
				if ( self.hasChanges ) {
					angular.forEach(trackKeys, function(key) {
						$scope[key] = self.acceptedValues[key];
					});
					self.changedValues = {};
					self.hasChanges = false;
					
					$scope.$emit('wccah.Tracker.Infrequent', { event: 'NoChanges' });
				}
			};
			
			return self;
		};
		
		return myTracker;
	}])
	.factory('wccahMetaTracker', function() {
		var metaTracker = function($scope, trackers) {
			var self = this;
			
			self.hasChanges = false;
			
			$scope.$on('wccah.Tracker.Infrequent', function(e, ea) {
				self.hasChanges = ( ea.event === 'HasChanges' );
			});
			
			return self;	
		};
	})
	;
})(angular);