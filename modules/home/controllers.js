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
    		$scope.playingVideoList = [];
    		angular.forEach($scope.videoList, function(video) {
    			$scope.playingVideoList.push(video);
    			$scope.playingVideoList.push(video);
    		});
    		createVideoPlayer();
    	};

    	$scope.openAddVideo = function() {
    		var modalInstance = $modal.open({
				templateUrl: 'modules/addVideo/views/addVideo.html',
				controller: 'AddVideoCtrl',
				size: 'lg',
				backdrop: 'static',
				keyboard: false
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
                    autoplay: 0,
                    controls: 0,
                    iv_load_policy: 3,
                    cc_load_policy: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    rel: 0,
                    showinfo: 0
                },
				events: {
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange
				}
			});

			function onPlayerStateChange(event) {
				if(event.data == YT.PlayerState.ENDED) {
					$scope.videoTitle = null;
					$scope.viewsCount = null;
					$scope.currentIndex++;
					if($scope.currentIndex < $scope.playingVideoList.length) {
						playVideo($scope.playingVideoList[$scope.currentIndex], player);
						$scope.$apply();
					} else {
						$scope.currentIndex = null;
						$scope.libraryWatched = true;
						player.destroy();
						$scope.videoTitle = null;
						$scope.viewsCount = null;
						$scope.$apply();
					}
				}
			}

			function onPlayerReady() {
				playVideo($scope.playingVideoList[$scope.currentIndex], player);
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