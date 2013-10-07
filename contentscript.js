/*jslint indent:2*/
/*global window, document, chrome*/

// This is the script injected into all pages matching youtube as defined in manifest.json
(function () {

  var videoElement = document.getElementById("movie_player");

  // This doesn't work. It should. But wont. Bastards.
  // videoElement.addEventListenter("onStateChange", function (event) {});
  // Instead perhaps I'll have to have all currently active youtube tabs
  //  polling videoElement.getPlayerState() to test state changes. FML.
  // And/or, reimplement my force-HTML5-hack and see if I can access those events.
  //  Note: If I do re-introduce the hack, at least fix back-browsing.

  var videoState = null;
  var broadcastVideoPlayerState = function () {
    var newState = videoElement.getPlayerState();
    if (newState !== videoState) {
      videoState = newState;
      var message = {
        message: "videoStateChange",
        videoState: newState
      };
      chrome.runtime.sendMessage(message, function (response) {
        console.log("Response", response);
      });
    }
  };

  var poller = window.setInterval(broadcastVideoPlayerState, 250);

  chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    console.log("content script received message", request, sender, callback);
    if (request.message === "pauseVideo") {
      videoElement.pauseVideo();
    }
  });


  chrome.runtime.sendMessage({message: "registerYoutubeTab"}, function (response) {
    console.log("Response to register", response);
  });

}());
