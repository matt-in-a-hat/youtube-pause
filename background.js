/*jslint indent:2*/
/*global chrome*/

// This script is run when the addon is loaded by the browser (probably when the first window opens).
(function () {

  var _youtubeTabIds = {};

  // I expect all youtube tabs I message to respond with an object that has a message,
  //  if this isn't so then I assume it's no longer running my youtube script.
  var sendMessage = function (tabId, request) {
    chrome.tabs.sendMessage(tabId, request, function (request) {
      if (typeof request !== "object" || request.message === undefined) {
        // Couldn't communicate to tab, assume it's no longer a registered youtube tab
        delete _youtubeTabIds[tabId + "_tabId"];
      }
    });
  };

  // Sends the message to all youtube tabs we know about. Optionally except 1.
  var messageAllRegisteredYoutubeTabs = function (message, exceptTabId) {
    Object.keys(_youtubeTabIds).forEach(function (tabId) {
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
        _youtubeTabIds[sender.tab.id + "_tabId"] = true;
      } else if (request.message === "videoStarted") {
        messageAllRegisteredYoutubeTabs("pauseVideo", sender.tab.id);
      }
    }
    if (typeof callback === "function") {
      callback(responseObj);
    }
  });

  // Stop polling all registered youtube tabs except the current 1 (if it's even a youtube tab)
  var stopPollingAllExcept = function (exceptTabId) {
    if (_youtubeTabIds[exceptTabId + "_tabId"]) {
      sendMessage(exceptTabId, {message: "startPolling"});
    }
    messageAllRegisteredYoutubeTabs("stopPolling", exceptTabId);
  };

  // Tell youtube tabs whether they're active so they don't always have to poll.
  //  When a tab changes,
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    console.log(_youtubeTabIds);
    stopPollingAllExcept(activeInfo.tabId);
  });
  //  and when the focussed window changes
  chrome.windows.onFocusChanged.addListener(function (windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      // All chrome windows lost focus
      messageAllRegisteredYoutubeTabs("stopPolling");
    } else {
      chrome.tabs.query({ active: true, windowId: windowId }, function (tabs) {
        if (tabs.length > 0) {
          stopPollingAllExcept(tabs[0].id);
        }
      });
    }
  });

  // Un-register youtube tabs that are being destroyed.
  chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    delete _youtubeTabIds[tabId + "_tabId"];
  });

}());
