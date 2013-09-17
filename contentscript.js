/*jslint indent:4*/
/*global document, chrome*/

(function () {

    var videoElement = document.getElementById('movie_player');

    chrome.runtime.onMessage.addListener(function (message, sender, callback) {
        if (message === "pause") {
            videoElement.pauseVideo();
        }
    });

}());