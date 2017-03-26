'use strict';
 
angular.module('AddVideo')
 
.controller('AddVideoCtrl',
    ['$scope', '$localStorage', '$modalInstance',
    function ($scope, $localStorage, $modalInstance) {
    	$scope.ok = function() {
    		var videos = !!$localStorage.videos ? JSON.parse($localStorage.videos) : [];
    		var videoId = "";
    		if($scope.videoUrl.indexOf("https://www.youtube.com/watch?v=") == -1) {
    			videoId = $scope.videoUrl;
    			$scope.videoUrl = "https://www.youtube.com/watch?v=" + videoId;
    		} else {
    			videoId = $scope.videoUrl.replace("https://www.youtube.com/watch?v=", "");
    		}
    		videos.push({
    			videoUrl: $scope.videoUrl,
    			videoId: videoId,
    			start: parseInt($scope.videoStart),
    			end: parseInt($scope.videoEnd),
    			title: $scope.videoTitle
    		});
    		$localStorage.videos = JSON.stringify(videos);
    		$modalInstance.close('ok');
    	};
    	$scope.cancel = function() {
    		$modalInstance.dismiss('cancel');
    	}
    }]);