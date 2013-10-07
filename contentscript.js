/*jslint indent:2*/
/*global window, document, chrome*/

// This is the script injected into all pages matching youtube as defined in manifest.json
(function () {

  var videoElement = document.getElementById("movie_player");

  // This doesn't work:
  // videoElement.addEventListenter("onStateChange", function (event) {});
  // Instead perhaps I'll have to polling videoElement.getPlayerState() to test state changes.
  // And/or, reimplement my force-HTML5-hack and see if I can access those events.
  //  Note: If I do re-introduce the hack, at least fix back-browsing.

  var videoState = null;

  chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    if (request.message === "getVideoStarted") {
      // Has this tab's video started playing since last queried?
      var newState = videoElement.getPlayerState();
      var message = "videoUnchanged";
      if (newState !== videoState) {
        videoState = newState;
        if (videoState === 1) {
          message = "videoStarted";
        }
      }
      callback({message: message});
    } else if (request.message === "pauseVideo") {
      // A different tab's video is starting
      videoElement.pauseVideo();
      videoState = videoElement.getPlayerState();
    }
  });

  // Register this tab as a youtube tab
  chrome.runtime.sendMessage({message: "registerYoutubeTab"});

}());
