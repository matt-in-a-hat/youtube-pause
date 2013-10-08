/*jslint indent:2*/
/*global chrome*/

// This script is run when the addon is loaded by the browser (probably when the first window opens).
(function () {

  var youtubeTabIds = {};

  var sendMessage = function (tabId, request) {
    chrome.tabs.sendMessage(tabId, request, function (request) {
      if (typeof request !== "object" || request.message === undefined) {
        // Couldn't communicate to tab, assume it's no longer a registered youtube tab
        delete youtubeTabIds[tabId + "_tabId"];
      }
    });
  };

  var messageAllRegisteredYoutubeTabs = function (message, exceptTabId) {
    Object.keys(youtubeTabIds).forEach(function (tabId) {
      var match = tabId.match(/^(\d+)_tabId$/);
      if (match !== null) {
        tabId = parseInt(match[1], 10);
        if (tabId !== exceptTabId) {
          sendMessage(tabId, {message: message});
        }
      }
    });
  };

  // Handle messages from content scripts in youtube tabs
  chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    var responseObj;
    if (typeof request === "object" && request.message !== undefined) {
      if (request.message === "registerYoutubeTab") {
        youtubeTabIds[sender.tab.id + "_tabId"] = true;
      } else if (request.message === "videoStarted") {
        messageAllRegisteredYoutubeTabs("pauseVideo", sender.tab.id);
      }
    }
    if (typeof callback === "function") {
      callback(responseObj);
    }
  });

  // Tell youtube tabs whether they're active so they don't always have to poll
  // TODO also do this on windows.onFocusChange
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    if (youtubeTabIds[activeInfo.tabId + "_tabId"]) {
      sendMessage(activeInfo.tabId, {message: "startPolling"});
    }
    messageAllRegisteredYoutubeTabs("stopPolling", activeInfo.tabId);
  });

}());
