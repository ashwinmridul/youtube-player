'use strict';
 
angular.module('Home')
 
.controller('HomeController',
    ['$scope', '$localStorage', '$modal', '$timeout', 'HomeService',
    function ($scope, $localStorage, $modal, $timeout, HomeService) {

    	$scope.videoList = [];
    	$scope.startPlay = false;
    	$scope.currentIndex = null;
    	$scope.libraryWatched = false;

    	$scope.loadVideos = function() {
    		$scope.videoList = !!$localStorage.videos ? JSON.parse($localStorage.videos) : [];
    	};

    	$scope.loadVideos();

    	$scope.startPlayingVideos = function() {
    		$scope.libraryWatched = false;
    		$scope.currentIndex = 0;
    		createVideoPlayer();
    	};

    	$scope.openAddVideo = function() {
    		var modalInstance = $modal.open({
				templateUrl: 'modules/addVideo/views/addVideo.html',
				controller: 'AddVideoCtrl',
				size: 'lg'
		    });
		    modalInstance.result.then(function(response) {
		    	$scope.loadVideos();
		    }, function(error) {

		    });
    	};

    	var createVideoPlayer = function() {
    		var player = new YT.Player('player', {
				height: '390',
				width: '640',
				playerVars: {
					controls: 0
				},
				events: {
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange
				}
			});

			var endCounts = 0;

			function onPlayerStateChange(event) {
				if(event.data == YT.PlayerState.ENDED) {
					player.destroy();
					$scope.currentIndex++;
					if($scope.currentIndex < $scope.videoList.length) {
						createVideoPlayer();
					} else {
						$scope.currentIndex = null;
						$scope.libraryWatched = true;
						$scope.videoTitle = null;
						$scope.viewsCount = null;
						$scope.$apply();
					}
				}
			}

			function onPlayerReady() {
				playVideo($scope.videoList[$scope.currentIndex], player);
				$scope.$apply();
			}
    	};

    	var playVideo = function(video, player) {
			player.loadVideoById({videoId:video.videoId,
                  startSeconds:video.start,
                  endSeconds:video.end,
                  suggestedQuality:'default'});

			player.playVideo();
			HomeService.getVideoDetails(video.videoId).success(function(response) {
				$scope.videoTitle = response.items[0].snippet.title;
				$scope.viewsCount = response.items[0].statistics.viewCount;
			});
    	};
    }]);