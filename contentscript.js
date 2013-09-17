/*jslint indent:4*/
/*global document, chrome*/

(function () {

    var videoElement = document.getElementById('movie_player');

    // This doesn't work. It should. But wont. Bastards.
    // videoElement.addEventListenter('onStateChange', function (event) {});
    // Instead perhaps I'll have to have all currently active youtube tabs
    //  polling videoElement.getPlayerState() to test state changes. FML.
    // And/or, reimplement my force-HTML5-hack and see if I can access those events.
    //  Note: If I do re-introduce the hack, at least fix back-browsing.

    chrome.runtime.onMessage.addListener(function (message, sender, callback) {
        if (message === "pause") {
            videoElement.pauseVideo();
        }
    });

}());