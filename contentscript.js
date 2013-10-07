/*jslint indent:4*/
/*global window, document, chrome*/

// This is the script injected into all pages matching youtube as defined in manifest.json
(function () {

    var videoElement = document.getElementById('movie_player');

    // This doesn't work. It should. But wont. Bastards.
    // videoElement.addEventListenter('onStateChange', function (event) {});
    // Instead perhaps I'll have to have all currently active youtube tabs
    //  polling videoElement.getPlayerState() to test state changes. FML.
    // And/or, reimplement my force-HTML5-hack and see if I can access those events.
    //  Note: If I do re-introduce the hack, at least fix back-browsing.
    
    var videoState = null;
    var broadcastVideoPlayerState = function () {
        var newState = videoElement.getPlayerState();
        if (newState !== videoState) {
            videoState = newState;
            chrome.tabs.sendMessage(tabId, "pause");
        }
    }

    var poller = window.setInterval(broadcastVideoPlayerState, 500);

    chrome.runtime.onMessage.addListener(function (message, sender, callback) {
        if (message === "pause") {
            videoElement.pauseVideo();
        }
    });

}());