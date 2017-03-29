'use strict';
 
angular.module('AddVideo')
 
.controller('AddVideoCtrl',
    ['$scope', '$localStorage', '$modalInstance', 'HomeService',
    function ($scope, $localStorage, $modalInstance, HomeService) {

        $scope.urlValidating = false;
        $scope.urlValidated = false;
        $scope.videoLength = null;
        $scope.error = false;
        $scope.errors = {};

        $scope.validateURL = function() {
            var videoId = "";
            if($scope.videoUrl.indexOf("https://www.youtube.com/watch?v=") == -1) {
                videoId = $scope.videoUrl;
            } else {
                videoId = $scope.videoUrl.replace("https://www.youtube.com/watch?v=", "");
            }
            $scope.urlValidated = false;
            $scope.urlValidating = true;
            $scope.videoLength = null;
            HomeService.getVideoDetails(videoId).success(function(data) {
                if(!!data.items.length) {
                    $scope.videoLength = YTDurationToSeconds(data.items[0].contentDetails.duration);
                    $scope.videoDesc = data.items[0].snippet.title;
                } else {
                    $scope.videoLength = null;
                }
                $scope.error = false;
                $scope.videoStart = "";
                $scope.videoEnd = "";
                $scope.videoTitle = "";
                $scope.urlValidating = false;
                $scope.urlValidated = true;
            })
            .error(function(error) {
                $scope.urlValidating = false;
                $scope.urlValidated = true;
                $scope.videoLength = null;
            });
        };

        function YTDurationToSeconds(duration) {
            var match = duration.match(/P(\d+W)?(\d+D)?T(\d+H)?(\d+M)?(\d+S)?/)

            var weeks = (parseInt(match[1]) || 0);
            var days = (parseInt(match[2]) || 0)
            var hours = (parseInt(match[3]) || 0);
            var minutes = (parseInt(match[4]) || 0);
            var seconds = (parseInt(match[5]) || 0);

            return (weeks * 7 + days) * 86400 + hours * 3600 + minutes * 60 + seconds;
        }

    	$scope.ok = function() {
            $scope.error = false;
            $scope.errors = {};
            if(parseInt($scope.videoStart) > $scope.videoLength) {
                $scope.error = true;
                $scope.errors['videoStart'] = "Start time should be less than video duration";
            }
            if(parseInt($scope.videoEnd) < parseInt($scope.videoStart) || parseInt($scope.videoEnd) > $scope.videoLength) {
                $scope.error = true;
                $scope.errors['videoEnd'] = "End time should be between start time and video duration";
            }
            if(!!$scope.error) {
                return;
            }
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
    	};
    }]);