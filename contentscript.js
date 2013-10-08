/*jslint indent:2*/
/*global window, document, chrome*/

// This is the script injected into all pages matching youtube as defined in manifest.json
(function () {

  var videoElement = document.getElementById("movie_player");
  if (!videoElement) {
    return;
  }

  // This doesn't work:
  // videoElement.addEventListenter("onStateChange", function (event) {});
  // Instead perhaps I'll have to polling videoElement.getPlayerState() to test state changes.
  // And/or, reimplement my force-HTML5-hack and see if I can access those events.
  //  Note: If I do re-introduce the hack, at least fix back-browsing.

  var videoState = null;
  var keepPolling = true;
  var poller = null;

  var checkVideoStateChange = function () {
    // Has this tab's video started playing since last queried?
    var newState = videoElement.getPlayerState();
    var message = "videoUnchanged";
    if (newState !== videoState) {
      videoState = newState;
      if (videoState === 1 && poller !== null) {
        chrome.runtime.sendMessage({message: "videoStarted"});
      }
    }
  };

  var startPollingVideoState = function () {
    poller = window.setInterval(checkVideoStateChange, 200);
  };

  chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    var responseObj = {
      message: 'success'
    };
    if (typeof request === "object" && request.message !== undefined) {
      if (request.message === "pauseVideo") {
        // A different tab's video is starting
        videoElement.pauseVideo();
        videoState = videoElement.getPlayerState();
      } else if (request.message === "stopPolling") {
        window.clearInterval(poller);
      } else if (request.message === "startPolling") {
        startPollingVideoState();
      }
    }
    if (typeof callback === "function") {
      callback(responseObj);
    }
  });

  // Register this tab as a youtube tab
  chrome.runtime.sendMessage({message: "registerYoutubeTab"}, function () {
    startPollingVideoState();
  });

}());
