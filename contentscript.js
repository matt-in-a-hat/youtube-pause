/*jslint indent:2*/
/*global window, document, chrome*/

// This is the script injected into all pages matching youtube as defined in manifest.json
(function () {
  var _YTstates = {
    'UNSTARTED': -1,
    'ENDED': 0,
    'PLAYING': 1,
    'PAUSED': 2,
    'BUFFERING': 3,
    'CUED': 5,
    isPlayState: function (state) {
      return state === this.PLAYING || state === this.BUFFERING;
    }
  };

  var videoElement = document.getElementById("movie_player");
  if (!videoElement) {
    return;
  }

  // This doesn't work:
  // videoElement.addEventListenter("onStateChange", function (event) {});
  // Instead I'll have to poll videoElement.getPlayerState() to test state changes.
  // And/or, reimplement my force-HTML5-hack and see if I can access those events.
  //  Note: If I do re-introduce the hack, at least fix back-browsing.

  var _videoState = null;
  var _poller = null;

  var checkVideoStateChange = function () {
    // Has this tab's video started playing since last queried?
    var oldState = _videoState;
    _videoState = videoElement.getPlayerState();
    if (!_YTstates.isPlayState(oldState) && _YTstates.isPlayState(_videoState) && _poller !== null) {
      chrome.runtime.sendMessage({message: "youtubeExtensionVideoStarted"});
    }
  };

  var startPollingVideoState = function () {
    window.clearInterval(_poller);
    _poller = window.setInterval(checkVideoStateChange, 200);
  };

  chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    if (typeof request === "object" && request.message !== undefined) {
      if (request.message === "youtubeExtensionPauseVideo") {
        // A different tab's video is starting
        videoElement.pauseVideo();
        _videoState = videoElement.getPlayerState();
      } else if (request.message === "youtubeExtensionStopPolling") {
        window.clearInterval(_poller);
        _poller = null;
      } else if (request.message === "youtubeExtensionStartPolling") {
        startPollingVideoState();
      }
    }
  });

  startPollingVideoState();

}());
