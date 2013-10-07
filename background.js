/*jslint indent:2*/
/*global chrome*/

// This script is run when the addon is loaded by the browser (probably when the first window opens).
(function () {

  // TODO: Do I need to unregister tabs somehow other than when failing to communicate to them?
  // TODO: Test when a video is paused due to buffering will it auto-continue after the user changes tab? Will this script catch that?
  // TODO: investigate event pages instead of background page, and using alarms instead of setInterval
  var youtubeTabIds = {};

  var pauseAllRegisteredYoutubeTabs = function (exceptTabId) {
    Object.keys(youtubeTabIds).forEach(function (tabId) {
      var match = tabId.match(/^(\d+)_tabId$/);
      if (match !== null) {
        tabId = parseInt(match[1], 10);
        if (tabId !== exceptTabId) {
          chrome.tabs.sendMessage(tabId, {message: "pauseVideo"});
        }
      }
    });
  };

  chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    var responseObj;
    if (request.message === "registerYoutubeTab") {
      youtubeTabIds[sender.tab.id + "_tabId"] = true;
    }
    if (typeof callback === "function") {
      callback(responseObj);
    }
  });


  // Poll the active tabs that are registered youtube tabs
  var checkYoutubeTabVideoStatus = function () {
    chrome.tabs.query({active: true}, function (tabs) {
      tabs.forEach(function (tab) {
        if (youtubeTabIds[tab.id + "_tabId"]) {
          // If they have changed state to start playing, tell the rest to pause
          chrome.tabs.sendMessage(tab.id, {message: "getVideoStarted"}, function (request) {
            if (!request || !request.message) {
              // Couldn't communicate to tab, assume it's no longer a registered youtube tab
              delete youtubeTabIds[tab.id + "_tabId"];
            } else if (request.message === "videoStarted") {
              pauseAllRegisteredYoutubeTabs(tab.id);
            }
          });
        }
      });
    });
  };

  var poller = setInterval(checkYoutubeTabVideoStatus, 250);

}());
