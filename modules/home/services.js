'use strict';
 
angular.module('Home')

.factory('HomeService', ['$http', '$sce', 'googleApiKey', 
	function($http, $sce, googleApiKey) {
		return {
			getVideoDetails: function(videoId) {
				var url = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=" + googleApiKey + "&part=snippet,statistics&callback=JSON_CALLBACK";
				$sce.trustAsResourceUrl(url);

				return $http.jsonp(url);
			}
		}
	}]);